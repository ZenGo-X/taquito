"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var uint8array_consumer_1 = require("../uint8array-consumer");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
exports.isPrim = function (value) {
    return 'prim' in value;
};
exports.isBytes = function (value) {
    // tslint:disable-next-line: strict-type-predicates
    return 'bytes' in value && typeof value.bytes === 'string';
};
exports.isString = function (value) {
    // tslint:disable-next-line: strict-type-predicates
    return 'string' in value && typeof value.string === 'string';
};
exports.isInt = function (value) {
    // tslint:disable-next-line: strict-type-predicates
    return 'int' in value && typeof value.int === 'string';
};
exports.scriptEncoder = function (script) {
    var code = exports.valueEncoder(script.code);
    var storage = exports.valueEncoder(script.storage);
    return "" + utils_1.pad(code.length / 2, 8) + code + utils_1.pad(storage.length / 2, 8) + storage;
};
exports.scriptDecoder = function (value) {
    var code = exports.extractRequiredLen(value);
    var storage = exports.extractRequiredLen(value);
    return {
        code: exports.valueDecoder(new uint8array_consumer_1.Uint8ArrayConsumer(code)),
        storage: exports.valueDecoder(new uint8array_consumer_1.Uint8ArrayConsumer(storage)),
    };
};
exports.valueEncoder = function (value) {
    if (Array.isArray(value)) {
        var encoded = value.map(function (x) { return exports.valueEncoder(x); }).join('');
        var len = encoded.length / 2;
        return "02" + utils_1.pad(len) + encoded;
    }
    else if (exports.isPrim(value)) {
        return exports.primEncoder(value);
    }
    else if (exports.isBytes(value)) {
        return exports.bytesEncoder(value);
    }
    else if (exports.isString(value)) {
        return exports.stringEncoder(value);
    }
    else if (exports.isInt(value)) {
        return exports.intEncoder(value);
    }
    throw new Error('Unexpected value');
};
exports.valueDecoder = function (value) {
    var preamble = value.consume(1);
    switch (preamble[0]) {
        case 0x0a:
            return exports.bytesDecoder(value);
        case 0x01:
            return exports.stringDecoder(value);
        case 0x00:
            return exports.intDecoder(value);
        case 0x02:
            var val = new uint8array_consumer_1.Uint8ArrayConsumer(exports.extractRequiredLen(value));
            var results = [];
            while (val.length() > 0) {
                results.push(exports.valueDecoder(val));
            }
            return results;
        default:
            return exports.primDecoder(value, preamble);
    }
};
exports.extractRequiredLen = function (value, bytesLength) {
    if (bytesLength === void 0) { bytesLength = 4; }
    var len = value.consume(bytesLength);
    var valueLen = parseInt(Buffer.from(len).toString('hex'), 16);
    return value.consume(valueLen);
};
exports.bytesEncoder = function (value) {
    if (!/^([A-Fa-f0-9]{2})*$/.test(value.bytes)) {
        throw new Error("Invalid hex string: " + value.bytes);
    }
    var len = value.bytes.length / 2;
    return "0a" + utils_1.pad(len) + value.bytes;
};
exports.bytesDecoder = function (value) {
    var bytes = exports.extractRequiredLen(value);
    return {
        bytes: Buffer.from(bytes).toString('hex'),
    };
};
exports.stringEncoder = function (value) {
    var str = Buffer.from(value.string, 'utf8').toString('hex');
    var hexLength = str.length / 2;
    return "01" + utils_1.pad(hexLength) + str;
};
exports.stringDecoder = function (value) {
    var str = exports.extractRequiredLen(value);
    return {
        string: Buffer.from(str).toString('utf8'),
    };
};
exports.intEncoder = function (_a) {
    var int = _a.int;
    var num = new bignumber_js_1.BigNumber(int, 10);
    var positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
    var binary = num.toString(2).replace('-', '');
    var pad = binary.length <= 6
        ? 6
        : (binary.length - 6) % 7
            ? binary.length + 7 - ((binary.length - 6) % 7)
            : binary.length;
    var splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);
    var reversed = splitted.reverse();
    reversed[0] = positiveMark + reversed[0];
    var numHex = reversed.map(function (x, i) {
        // Add one to the last chunk
        return parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
            .toString(16)
            .padStart(2, '0');
    });
    return "00" + numHex.join('');
};
exports.intDecoder = function (value) {
    var c = value.consume(1)[0];
    var hexNumber = [];
    // console.log(c);
    var isNotLastChunkMask = 1 << 7;
    while (c & isNotLastChunkMask) {
        hexNumber.push(c);
        c = value.consume(1)[0];
    }
    hexNumber.push(c);
    var isNegative = !!((1 << 6) & hexNumber[0]);
    hexNumber[0] = hexNumber[0] & 127;
    var numBin = hexNumber
        .map(function (x, i) {
        return x
            .toString(2)
            .slice(i === 0 ? -6 : -7)
            .padStart(i === 0 ? 6 : 7, '0');
    })
        .reverse();
    var num = new bignumber_js_1.BigNumber(numBin.join(''), 2);
    if (isNegative) {
        num = num.times(-1);
    }
    return {
        int: num.toFixed(),
    };
};
exports.primEncoder = function (value) {
    var hasAnnot = +Array.isArray(value.annots);
    var argsCount = Array.isArray(value.args) ? value.args.length : 0;
    // Specify the number of args max is 3 without annotation
    var preamble = utils_1.pad(Math.min(2 * argsCount + hasAnnot + 0x03, 9), 2);
    var op = constants_1.opMappingReverse[value.prim];
    var encodedArgs = (value.args || []).map(function (arg) { return exports.valueEncoder(arg); }).join('');
    var encodedAnnots = Array.isArray(value.annots) ? exports.encodeAnnots(value.annots) : '';
    if (value.prim === 'LAMBDA' && argsCount) {
        encodedArgs = utils_1.pad(encodedArgs.length / 2) + encodedArgs + utils_1.pad(0);
    }
    return "" + preamble + op + encodedArgs + encodedAnnots;
};
exports.primDecoder = function (value, preamble) {
    var hasAnnot = (preamble[0] - 0x03) % 2 === 1;
    var argsCount = Math.floor((preamble[0] - 0x03) / 2);
    var op = value
        .consume(1)[0]
        .toString(16)
        .padStart(2, '0');
    if (constants_1.opMapping[op] === 'LAMBDA') {
        value.consume(4);
    }
    var args = new Array(argsCount).fill(0).map(function () { return exports.valueDecoder(value); });
    if (constants_1.opMapping[op] === 'LAMBDA') {
        value.consume(4);
    }
    var result = {
        prim: constants_1.opMapping[op],
    };
    if (args.length) {
        result['args'] = args;
    }
    if (hasAnnot) {
        result['annots'] = exports.decodeAnnots(value);
    }
    return result;
};
exports.encodeAnnots = function (value) {
    var mergedAnnot = value
        .map(function (x) {
        return Buffer.from(x, 'utf8').toString('hex');
    })
        .join('20');
    var len = mergedAnnot.length / 2;
    return "" + utils_1.pad(len) + mergedAnnot;
};
exports.decodeAnnots = function (val) {
    var len = val.consume(4);
    var annotLen = parseInt(Buffer.from(len).toString('hex'), 16);
    var restOfAnnot = val.consume(annotLen);
    var restOfAnnotHex = Buffer.from(restOfAnnot).toString('hex');
    return restOfAnnotHex.split('20').map(function (x) { return Buffer.from(x, 'hex').toString('utf8'); });
};
//# sourceMappingURL=codec.js.map