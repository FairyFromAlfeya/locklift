/// <reference types="node" />
import { BigNumber } from 'bignumber.js';
export declare class OutputDecoder {
    output: any;
    functionAttributes: any;
    constructor(output: any, functionAttributes: any);
    decode_value(encoded_value: any, schema: any): any;
    decodeBytes(value: any): Buffer;
    decodeBytesArray(value: any): any;
    decodeBool(value: any): boolean;
    decodeInt(value: any): BigNumber;
    decodeIntArray(value: any): any;
    decode(): unknown;
    decodeTuple(value: any, schema: any): {};
}
