"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zeroAddress = exports.getRandomNonce = exports.convertCrystal = exports.loadBase64FromFile = exports.loadJSONFromFile = void 0;
const fs_1 = __importDefault(require("fs"));
const bignumber_js_1 = require("bignumber.js");
const loadJSONFromFile = (filePath) => {
    return JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
};
exports.loadJSONFromFile = loadJSONFromFile;
const loadBase64FromFile = (filePath) => {
    return fs_1.default.readFileSync(filePath, 'utf8').split('\n').join('');
};
exports.loadBase64FromFile = loadBase64FromFile;
const convertCrystal = (amount, dimension) => {
    const crystalBN = new bignumber_js_1.BigNumber(amount);
    if (dimension === 'nano') {
        return crystalBN.times(10 ** 9).toFixed(0);
    }
    else if (dimension === 'ton') {
        return crystalBN.div(new bignumber_js_1.BigNumber(10).pow(9));
    }
};
exports.convertCrystal = convertCrystal;
const getRandomNonce = () => (Math.random() * 64000) | 0;
exports.getRandomNonce = getRandomNonce;
exports.zeroAddress = '0:0000000000000000000000000000000000000000000000000000000000000000';
//# sourceMappingURL=index.js.map