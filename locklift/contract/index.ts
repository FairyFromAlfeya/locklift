import { OutputDecoder } from './output-decoder';
import { QMessageType } from 'ton-client-js';
import Locklift from '../index';

/**
 * Smart contract object.
 */
export class Contract {
  locklift: Locklift;
  abi: any;
  base64: any;
  code: any;
  name: string;
  address: string;
  keyPair: any;
  afterRun: any;
  autoAnswerIdOnCall: boolean;
  autoRandomNonce: boolean;

  /**
   * Contract constructor
   * @param locklift Locklift instance
   * @param abi Contract ABI
   * @param base64 Contract base64 encoded TVC
   * @param code Contract code
   * @param name Contract name
   * @param address Contract address
   * @param keyPair Default keyPair to use for interacting with smart contract
   * @param [autoAnswerIdOnCall=true] Boolean, specify dummy answer_id automatically
   * @param autoRandomNonce Automatically fill _randomNonce in init data if it discovered in ABI
   * @param afterRun After run hook, receives a run transaction.
   */
  constructor({
    locklift,
    abi,
    base64,
    code,
    name,
    address,
    keyPair,
    autoAnswerIdOnCall,
    autoRandomNonce,
    afterRun,
  }: {
    locklift: any;
    abi: any;
    base64?: any;
    code?: any;
    name: any;
    address?: string;
    keyPair?: any;
    autoAnswerIdOnCall?: any;
    autoRandomNonce?: boolean;
    afterRun?: any;
  }) {
    this.locklift = locklift;
    this.abi = abi;
    this.base64 = base64;
    this.code = code;
    this.name = name;
    this.address = address;
    this.keyPair = keyPair;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.afterRun = afterRun === undefined ? async () => {} : afterRun;

    this.autoAnswerIdOnCall =
      autoAnswerIdOnCall === undefined ? true : autoAnswerIdOnCall;
    this.autoRandomNonce =
      autoRandomNonce === undefined ? true : autoRandomNonce;
  }

  /**
   * Set contract address
   * @param address
   */
  setAddress(address) {
    this.address = address;
  }

  /**
   * Set key pair to use for interacting with contract.
   * @param keyPair
   */
  setKeyPair(keyPair) {
    this.keyPair = keyPair;
  }

  /**
   * Run smart contract method. Create run message and wait for transaction.
   * @param method Method name
   * @param params Method params
   * @param [keyPair=this.keyPair] Key pair to use
   * @returns {Promise<*>}
   */
  async run({
    method,
    params,
    keyPair,
  }: {
    method: any;
    params: any;
    keyPair?: any;
  }) {
    const message = await Locklift.ton.createRunMessage({
      contract: this,
      method,
      params: params === undefined ? {} : params,
      keyPair: keyPair === undefined ? this.keyPair : keyPair,
    });

    const tx = Locklift.ton.waitForRunTransaction({
      message,
      abi: this.abi,
    });

    await this.afterRun(tx);

    return tx;
  }

  /**
   * Call smart contract method. Uses runLocal to run TVM code locally and decodes result
   * according to the ABI.
   * @dev Specify _answer_id if necessary in case this.autoAnswerIdOnCall is true
   * @param method Method name
   * @param [params={}] Method params
   * @param [keyPair=this.keyPair] Keypair to use
   * @returns {Promise<void>} Decoded output
   */
  async call({ method, params, keyPair }) {
    const extendedParams = params === undefined ? {} : params;

    if (this.autoAnswerIdOnCall) {
      if (
        this.abi.functions
          .find((e) => e.name === method)
          .inputs.find((e) => e.name === '_answer_id')
      ) {
        extendedParams._answer_id =
          extendedParams._answer_id === undefined
            ? 1
            : extendedParams._answer_id;
      } else if (
        this.abi.functions
          .find((e) => e.name === method)
          .inputs.find((e) => e.name === 'answerId')
      ) {
        extendedParams.answerId =
          extendedParams.answerId === undefined ? 1 : extendedParams.answerId;
      }
    }

    const { message } = await Locklift.ton.createRunMessage({
      contract: this,
      method,
      params: extendedParams,
      keyPair: keyPair === undefined ? this.keyPair : keyPair,
    });

    const {
      result: [{ boc }],
    } = await Locklift.ton.client.net.query_collection({
      collection: 'accounts',
      filter: {
        id: {
          eq: this.address,
        },
      },
      result: 'boc',
    });

    // Get output of the method run execution
    const {
      decoded: { output },
    } = await Locklift.ton.client.tvm.run_tvm({
      abi: {
        type: 'Contract',
        value: this.abi,
      },
      message: message,
      account: boc,
    });

    // Decode output
    const functionAttributes = this.abi.functions.find(
      ({ name }) => name === method,
    );

    const outputDecoder = new OutputDecoder(output, functionAttributes);

    return outputDecoder.decode();
  }

  /**
   * Decode list of messages according to the ABI
   * @param messages
   * @param is_internal
   * @returns {Promise<unknown[]>}
   */
  async decodeMessages(messages, is_internal) {
    const decodedMessages = messages.map(async (message) => {
      const decodedMessage = await Locklift.ton.client.abi.decode_message_body({
        abi: {
          type: 'Contract',
          value: this.abi,
        },
        body: message.body,
        is_internal,
      });

      return {
        ...decodedMessage,
        messageId: message.id,
        src: message.src,
        created_at: message.created_at,
      };
    });

    return Promise.all(decodedMessages);
  }

  /**
   * Get list of messages, sent from the contract
   * @param messageType Message type
   * @param internal Internal type
   * @returns {Promise<unknown[]>} List of messages
   */
  async getSentMessages(messageType, internal) {
    const { result } = await Locklift.ton.client.net.query_collection({
      collection: 'messages',
      filter: {
        src: {
          eq: this.address,
        },
        msg_type: {
          eq: messageType,
        },
      },
      result: 'body id src created_at',
    });

    return this.decodeMessages(result, internal);
  }

  /**
   * Get solidity events, emitted by the contract.
   * @dev Under the hood, events are extOut messages
   * @param eventName Event name
   * @returns {Promise<*>} List of emitted events
   */
  async getEvents(eventName) {
    const sentMessages = await this.getSentMessages(QMessageType.extOut, false);

    return sentMessages.filter((message) => message.name === eventName);
  }
}
