(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@taquito/utils'), require('bignumber.js')) :
  typeof define === 'function' && define.amd ? define(['exports', '@taquito/utils', 'bignumber.js'], factory) :
  (global = global || self, factory(global.taquitoLocalForging = {}, global.utils, global.BigNumber));
}(this, (function (exports, utils, BigNumber) { 'use strict';

  var BigNumber__default = 'default' in BigNumber ? BigNumber['default'] : BigNumber;

  var toHexString = function (bytes) {
      return bytes.reduce(function (str, byte) { return str + byte.toString(16).padStart(2, '0'); }, '');
  };
  var pad = function (num, paddingLen) {
      if (paddingLen === void 0) { paddingLen = 8; }
      return num.toString(16).padStart(paddingLen, '0');
  };

  /*
   * Some code in this file is originally from sotez
   * Copyright (c) 2018 Andrew Kishino
   */
  // See: https://tezos.gitlab.io/protocols/005_babylon.html#transactions-now-have-an-entrypoint
  var ENTRYPOINT_MAX_LENGTH = 31;
  (function (CODEC) {
      CODEC["SECRET"] = "secret";
      CODEC["RAW"] = "raw";
      CODEC["TZ1"] = "tz1";
      CODEC["BRANCH"] = "branch";
      CODEC["ZARITH"] = "zarith";
      CODEC["PUBLIC_KEY"] = "public_key";
      CODEC["PKH"] = "pkh";
      CODEC["DELEGATE"] = "delegate";
      CODEC["SCRIPT"] = "script";
      CODEC["BALLOT_STATEMENT"] = "ballotStmt";
      CODEC["PROPOSAL"] = "proposal";
      CODEC["PROPOSAL_ARR"] = "proposalArr";
      CODEC["INT32"] = "int32";
      CODEC["PARAMETERS"] = "parameters";
      CODEC["ADDRESS"] = "address";
      CODEC["OPERATION"] = "operation";
      CODEC["OP_ACTIVATE_ACCOUNT"] = "activate_account";
      CODEC["OP_DELEGATION"] = "delegation";
      CODEC["OP_TRANSACTION"] = "transaction";
      CODEC["OP_ORIGINATION"] = "origination";
      CODEC["OP_BALLOT"] = "ballot";
      CODEC["OP_ENDORSEMENT"] = "endorsement";
      CODEC["OP_SEED_NONCE_REVELATION"] = "seed_nonce_revelation";
      CODEC["OP_REVEAL"] = "reveal";
      CODEC["OP_PROPOSALS"] = "proposals";
      CODEC["MANAGER"] = "manager";
  })(exports.CODEC || (exports.CODEC = {}));
  // See https://tezos.gitlab.io/whitedoc/michelson.html#full-grammar
  var opMapping = {
      '00': 'parameter',
      '01': 'storage',
      '02': 'code',
      '03': 'False',
      '04': 'Elt',
      '05': 'Left',
      '06': 'None',
      '07': 'Pair',
      '08': 'Right',
      '09': 'Some',
      '0a': 'True',
      '0b': 'Unit',
      '0c': 'PACK',
      '0d': 'UNPACK',
      '0e': 'BLAKE2B',
      '0f': 'SHA256',
      '10': 'SHA512',
      '11': 'ABS',
      '12': 'ADD',
      '13': 'AMOUNT',
      '14': 'AND',
      '15': 'BALANCE',
      '16': 'CAR',
      '17': 'CDR',
      '18': 'CHECK_SIGNATURE',
      '19': 'COMPARE',
      '1a': 'CONCAT',
      '1b': 'CONS',
      '1c': 'CREATE_ACCOUNT',
      '1d': 'CREATE_CONTRACT',
      '1e': 'IMPLICIT_ACCOUNT',
      '1f': 'DIP',
      '20': 'DROP',
      '21': 'DUP',
      '22': 'EDIV',
      '23': 'EMPTY_MAP',
      '24': 'EMPTY_SET',
      '25': 'EQ',
      '26': 'EXEC',
      '27': 'FAILWITH',
      '28': 'GE',
      '29': 'GET',
      '2a': 'GT',
      '2b': 'HASH_KEY',
      '2c': 'IF',
      '2d': 'IF_CONS',
      '2e': 'IF_LEFT',
      '2f': 'IF_NONE',
      '30': 'INT',
      '31': 'LAMBDA',
      '32': 'LE',
      '33': 'LEFT',
      '34': 'LOOP',
      '35': 'LSL',
      '36': 'LSR',
      '37': 'LT',
      '38': 'MAP',
      '39': 'MEM',
      '3a': 'MUL',
      '3b': 'NEG',
      '3c': 'NEQ',
      '3d': 'NIL',
      '3e': 'NONE',
      '3f': 'NOT',
      '40': 'NOW',
      '41': 'OR',
      '42': 'PAIR',
      '43': 'PUSH',
      '44': 'RIGHT',
      '45': 'SIZE',
      '46': 'SOME',
      '47': 'SOURCE',
      '48': 'SENDER',
      '49': 'SELF',
      '4a': 'STEPS_TO_QUOTA',
      '4b': 'SUB',
      '4c': 'SWAP',
      '4d': 'TRANSFER_TOKENS',
      '4e': 'SET_DELEGATE',
      '4f': 'UNIT',
      '50': 'UPDATE',
      '51': 'XOR',
      '52': 'ITER',
      '53': 'LOOP_LEFT',
      '54': 'ADDRESS',
      '55': 'CONTRACT',
      '56': 'ISNAT',
      '57': 'CAST',
      '58': 'RENAME',
      '59': 'bool',
      '5a': 'contract',
      '5b': 'int',
      '5c': 'key',
      '5d': 'key_hash',
      '5e': 'lambda',
      '5f': 'list',
      '60': 'map',
      '61': 'big_map',
      '62': 'nat',
      '63': 'option',
      '64': 'or',
      '65': 'pair',
      '66': 'set',
      '67': 'signature',
      '68': 'string',
      '69': 'bytes',
      '6a': 'mutez',
      '6b': 'timestamp',
      '6c': 'unit',
      '6d': 'operation',
      '6e': 'address',
      '6f': 'SLICE',
      '70': 'DIG',
      '71': 'DUG',
      '72': 'EMPTY_BIG_MAP',
      '73': 'APPLY',
      '74': 'chain_id',
      '75': 'CHAIN_ID',
  };
  var opMappingReverse = (function () {
      var result = {};
      Object.keys(opMapping).forEach(function (key) {
          result[opMapping[key]] = key;
      });
      return result;
  })();
  // See https://tezos.gitlab.io/api/p2p.html
  var kindMapping = {
      0x04: 'activate_account',
      0x6b: 'reveal',
      0x6e: 'delegation',
      0x6c: 'transaction',
      0x6d: 'origination',
      0x06: 'ballot',
      0x00: 'endorsement',
      0x01: 'seed_nonce_revelation',
      0x05: 'proposals',
  };
  var kindMappingReverse = (function () {
      var result = {};
      Object.keys(kindMapping).forEach(function (key) {
          var keyNum = typeof key === 'string' ? parseInt(key, 10) : key;
          result[kindMapping[keyNum]] = pad(keyNum, 2);
      });
      return result;
  })();
  // See https://tezos.gitlab.io/protocols/005_babylon.html#transactions-now-have-an-entrypoint
  var entrypointMapping = {
      '00': 'default',
      '01': 'root',
      '02': 'do',
      '03': 'set_delegate',
      '04': 'remove_delegate',
  };
  var entrypointMappingReverse = (function () {
      var result = {};
      Object.keys(entrypointMapping).forEach(function (key) {
          result[entrypointMapping[key]] = key;
      });
      return result;
  })();

  var Uint8ArrayConsumer = /** @class */ (function () {
      function Uint8ArrayConsumer(arr, offset) {
          if (offset === void 0) { offset = 0; }
          this.arr = arr;
          this.offset = offset;
      }
      Uint8ArrayConsumer.fromHexString = function (hex) {
          var lowHex = hex.toLowerCase();
          if (/^(([a-f]|\d){2})*$/.test(lowHex)) {
              var arr = new Uint8Array((lowHex.match(/([a-z]|\d){2}/g) || []).map(function (byte) { return parseInt(byte, 16); }));
              return new Uint8ArrayConsumer(arr);
          }
          else {
              throw new Error('Invalid hex string');
          }
      };
      Uint8ArrayConsumer.prototype.consume = function (count) {
          var subArr = this.arr.subarray(this.offset, this.offset + count);
          this.offset += count;
          return subArr;
      };
      Uint8ArrayConsumer.prototype.get = function (idx) {
          return this.arr[this.offset + idx];
      };
      Uint8ArrayConsumer.prototype.length = function () {
          return this.arr.length - this.offset;
      };
      return Uint8ArrayConsumer;
  }());

  var isPrim = function (value) {
      return 'prim' in value;
  };
  var isBytes = function (value) {
      // tslint:disable-next-line: strict-type-predicates
      return 'bytes' in value && typeof value.bytes === 'string';
  };
  var isString = function (value) {
      // tslint:disable-next-line: strict-type-predicates
      return 'string' in value && typeof value.string === 'string';
  };
  var isInt = function (value) {
      // tslint:disable-next-line: strict-type-predicates
      return 'int' in value && typeof value.int === 'string';
  };
  var scriptEncoder = function (script) {
      var code = valueEncoder(script.code);
      var storage = valueEncoder(script.storage);
      return "" + pad(code.length / 2, 8) + code + pad(storage.length / 2, 8) + storage;
  };
  var scriptDecoder = function (value) {
      var code = extractRequiredLen(value);
      var storage = extractRequiredLen(value);
      return {
          code: valueDecoder(new Uint8ArrayConsumer(code)),
          storage: valueDecoder(new Uint8ArrayConsumer(storage)),
      };
  };
  var valueEncoder = function (value) {
      if (Array.isArray(value)) {
          var encoded = value.map(function (x) { return valueEncoder(x); }).join('');
          var len = encoded.length / 2;
          return "02" + pad(len) + encoded;
      }
      else if (isPrim(value)) {
          return primEncoder(value);
      }
      else if (isBytes(value)) {
          return bytesEncoder(value);
      }
      else if (isString(value)) {
          return stringEncoder(value);
      }
      else if (isInt(value)) {
          return intEncoder(value);
      }
      throw new Error('Unexpected value');
  };
  var valueDecoder = function (value) {
      var preamble = value.consume(1);
      switch (preamble[0]) {
          case 0x0a:
              return bytesDecoder(value);
          case 0x01:
              return stringDecoder(value);
          case 0x00:
              return intDecoder(value);
          case 0x02:
              var val = new Uint8ArrayConsumer(extractRequiredLen(value));
              var results = [];
              while (val.length() > 0) {
                  results.push(valueDecoder(val));
              }
              return results;
          default:
              return primDecoder(value, preamble);
      }
  };
  var extractRequiredLen = function (value, bytesLength) {
      if (bytesLength === void 0) { bytesLength = 4; }
      var len = value.consume(bytesLength);
      var valueLen = parseInt(Buffer.from(len).toString('hex'), 16);
      return value.consume(valueLen);
  };
  var bytesEncoder = function (value) {
      if (!/^([A-Fa-f0-9]{2})*$/.test(value.bytes)) {
          throw new Error("Invalid hex string: " + value.bytes);
      }
      var len = value.bytes.length / 2;
      return "0a" + pad(len) + value.bytes;
  };
  var bytesDecoder = function (value) {
      var bytes = extractRequiredLen(value);
      return {
          bytes: Buffer.from(bytes).toString('hex'),
      };
  };
  var stringEncoder = function (value) {
      var str = Buffer.from(value.string, 'utf8').toString('hex');
      var hexLength = str.length / 2;
      return "01" + pad(hexLength) + str;
  };
  var stringDecoder = function (value) {
      var str = extractRequiredLen(value);
      return {
          string: Buffer.from(str).toString('utf8'),
      };
  };
  var intEncoder = function (_a) {
      var int = _a.int;
      var num = new BigNumber.BigNumber(int, 10);
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
  var intDecoder = function (value) {
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
      var num = new BigNumber.BigNumber(numBin.join(''), 2);
      if (isNegative) {
          num = num.times(-1);
      }
      return {
          int: num.toFixed(),
      };
  };
  var primEncoder = function (value) {
      var hasAnnot = +Array.isArray(value.annots);
      var argsCount = Array.isArray(value.args) ? value.args.length : 0;
      // Specify the number of args max is 3 without annotation
      var preamble = pad(Math.min(2 * argsCount + hasAnnot + 0x03, 9), 2);
      var op = opMappingReverse[value.prim];
      var encodedArgs = (value.args || []).map(function (arg) { return valueEncoder(arg); }).join('');
      var encodedAnnots = Array.isArray(value.annots) ? encodeAnnots(value.annots) : '';
      if (value.prim === 'LAMBDA' && argsCount) {
          encodedArgs = pad(encodedArgs.length / 2) + encodedArgs + pad(0);
      }
      return "" + preamble + op + encodedArgs + encodedAnnots;
  };
  var primDecoder = function (value, preamble) {
      var hasAnnot = (preamble[0] - 0x03) % 2 === 1;
      var argsCount = Math.floor((preamble[0] - 0x03) / 2);
      var op = value
          .consume(1)[0]
          .toString(16)
          .padStart(2, '0');
      if (opMapping[op] === 'LAMBDA') {
          value.consume(4);
      }
      var args = new Array(argsCount).fill(0).map(function () { return valueDecoder(value); });
      if (opMapping[op] === 'LAMBDA') {
          value.consume(4);
      }
      var result = {
          prim: opMapping[op],
      };
      if (args.length) {
          result['args'] = args;
      }
      if (hasAnnot) {
          result['annots'] = decodeAnnots(value);
      }
      return result;
  };
  var encodeAnnots = function (value) {
      var mergedAnnot = value
          .map(function (x) {
          return Buffer.from(x, 'utf8').toString('hex');
      })
          .join('20');
      var len = mergedAnnot.length / 2;
      return "" + pad(len) + mergedAnnot;
  };
  var decodeAnnots = function (val) {
      var len = val.consume(4);
      var annotLen = parseInt(Buffer.from(len).toString('hex'), 16);
      var restOfAnnot = val.consume(annotLen);
      var restOfAnnotHex = Buffer.from(restOfAnnot).toString('hex');
      return restOfAnnotHex.split('20').map(function (x) { return Buffer.from(x, 'hex').toString('utf8'); });
  };

  var prefixEncoder = function (prefix) { return function (str) {
      return utils.buf2hex(Buffer.from(utils.b58cdecode(str, utils.prefix[prefix])));
  }; };
  var prefixDecoder = function (pre) { return function (str) {
      var val = str.consume(utils.prefixLength[pre]);
      return utils.b58cencode(val, utils.prefix[pre]);
  }; };
  var tz1Decoder = prefixDecoder(utils.Prefix.TZ1);
  var branchDecoder = prefixDecoder(utils.Prefix.B);
  var pkhDecoder = function (val) {
      var prefix = val.consume(1);
      if (prefix[0] === 0x00) {
          return prefixDecoder(utils.Prefix.TZ1)(val);
      }
      else if (prefix[0] === 0x01) {
          return prefixDecoder(utils.Prefix.TZ2)(val);
      }
      else if (prefix[0] === 0x02) {
          return prefixDecoder(utils.Prefix.TZ3)(val);
      }
  };
  var branchEncoder = prefixEncoder(utils.Prefix.B);
  var tz1Encoder = prefixEncoder(utils.Prefix.TZ1);
  var boolEncoder = function (bool) { return (bool ? 'ff' : '00'); };
  var proposalEncoder = function (proposal) {
      return prefixEncoder(utils.Prefix.P)(proposal);
  };
  var proposalDecoder = function (proposal) {
      return prefixDecoder(utils.Prefix.P)(proposal);
  };
  var proposalsDecoder = function (proposal) {
      var proposals = [];
      proposal.consume(4);
      while (proposal.length() > 0) {
          proposals.push(proposalDecoder(proposal));
      }
      return proposals;
  };
  var proposalsEncoder = function (proposals) {
      return pad(32 * proposals.length) + proposals.map(function (x) { return proposalEncoder(x); }).join('');
  };
  var ballotEncoder = function (ballot) {
      switch (ballot) {
          case 'yay':
              return '00';
          case 'nay':
              return '01';
          case 'pass':
              return '02';
          default:
              throw new Error("Invalid ballot value: " + ballot);
      }
  };
  var ballotDecoder = function (ballot) {
      var value = ballot.consume(1);
      switch (value[0]) {
          case 0x00:
              return 'yay';
          case 0x01:
              return 'nay';
          case 0x02:
              return 'pass';
          default:
              throw new Error("Unable to decode ballot value " + value[0]);
      }
  };
  var delegateEncoder = function (val) {
      if (val) {
          return boolEncoder(true) + pkhEncoder(val);
      }
      else {
          return boolEncoder(false);
      }
  };
  var int32Encoder = function (val) {
      var num = parseInt(String(val), 10);
      var byte = [];
      for (var i = 0; i < 4; i++) {
          var shiftBy = (4 - (i + 1)) * 8;
          byte.push((num & (0xff << shiftBy)) >> shiftBy);
      }
      return Buffer.from(byte).toString('hex');
  };
  var int32Decoder = function (val) {
      var num = val.consume(4);
      var finalNum = 0;
      for (var i = 0; i < num.length; i++) {
          finalNum = finalNum | (num[i] << ((num.length - (i + 1)) * 8));
      }
      return finalNum;
  };
  var boolDecoder = function (val) {
      var bool = val.consume(1);
      return bool[0] === 0xff;
  };
  var delegateDecoder = function (val) {
      var hasDelegate = boolDecoder(val);
      if (hasDelegate) {
          return pkhDecoder(val);
      }
  };
  var pkhEncoder = function (val) {
      var pubkeyPrefix = val.substr(0, 3);
      switch (pubkeyPrefix) {
          case utils.Prefix.TZ1:
              return '00' + prefixEncoder(utils.Prefix.TZ1)(val);
          case utils.Prefix.TZ2:
              return '01' + prefixEncoder(utils.Prefix.TZ2)(val);
          case utils.Prefix.TZ3:
              return '02' + prefixEncoder(utils.Prefix.TZ3)(val);
          default:
              throw new Error('Invalid public key hash');
      }
  };
  var publicKeyEncoder = function (val) {
      var pubkeyPrefix = val.substr(0, 4);
      switch (pubkeyPrefix) {
          case utils.Prefix.EDPK:
              return '00' + prefixEncoder(utils.Prefix.EDPK)(val);
          case utils.Prefix.SPPK:
              return '01' + prefixEncoder(utils.Prefix.SPPK)(val);
          case utils.Prefix.P2PK:
              return '02' + prefixEncoder(utils.Prefix.P2PK)(val);
          default:
              throw new Error('Invalid PK');
      }
  };
  var addressEncoder = function (val) {
      var pubkeyPrefix = val.substr(0, 3);
      switch (pubkeyPrefix) {
          case utils.Prefix.TZ1:
          case utils.Prefix.TZ2:
          case utils.Prefix.TZ3:
              return '00' + pkhEncoder(val);
          case utils.Prefix.KT1:
              return '01' + prefixEncoder(utils.Prefix.KT1)(val) + '00';
          default:
              throw new Error('Invalid address');
      }
  };
  var publicKeyDecoder = function (val) {
      var preamble = val.consume(1);
      switch (preamble[0]) {
          case 0x00:
              return prefixDecoder(utils.Prefix.EDPK)(val);
          case 0x01:
              return prefixDecoder(utils.Prefix.SPPK)(val);
          case 0x02:
              return prefixDecoder(utils.Prefix.P2PK)(val);
          default:
              throw new Error('Invalid PK');
      }
  };
  var addressDecoder = function (val) {
      var preamble = val.consume(1);
      switch (preamble[0]) {
          case 0x00:
              return pkhDecoder(val);
          case 0x01:
              var address = prefixDecoder(utils.Prefix.KT1)(val);
              val.consume(1);
              return address;
          default:
              throw new Error('Invalid Address');
      }
  };
  var zarithEncoder = function (n) {
      var fn = [];
      var nn = new BigNumber__default(n, 10);
      if (nn.isNaN()) {
          throw new TypeError("Invalid zarith number " + n);
      }
      while (true) {
          // eslint-disable-line
          if (nn.lt(128)) {
              if (nn.lt(16))
                  fn.push('0');
              fn.push(nn.toString(16));
              break;
          }
          else {
              var b = nn.mod(128);
              nn = nn.minus(b);
              nn = nn.dividedBy(128);
              b = b.plus(128);
              fn.push(b.toString(16));
          }
      }
      return fn.join('');
  };
  var zarithDecoder = function (n) {
      var mostSignificantByte = 0;
      while (mostSignificantByte < n.length() && (n.get(mostSignificantByte) & 128) !== 0) {
          mostSignificantByte += 1;
      }
      var num = new BigNumber__default(0);
      for (var i = mostSignificantByte; i >= 0; i -= 1) {
          var tmp = n.get(i) & 0x7f;
          num = num.multipliedBy(128);
          num = num.plus(tmp);
      }
      n.consume(mostSignificantByte + 1);
      return new BigNumber__default(num).toString();
  };
  var entrypointDecoder = function (value) {
      var preamble = pad(value.consume(1)[0], 2);
      if (preamble in entrypointMapping) {
          return entrypointMapping[preamble];
      }
      else {
          var entry = extractRequiredLen(value, 1);
          var entrypoint = Buffer.from(entry).toString('utf8');
          if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
              throw new Error("Oversized entrypoint: " + entrypoint + ". The maximum length of entrypoint is " + ENTRYPOINT_MAX_LENGTH);
          }
          return entrypoint;
      }
  };
  var parametersDecoder = function (val) {
      var preamble = val.consume(1);
      if (preamble[0] === 0x00) {
          return;
      }
      else {
          var encodedEntrypoint = entrypointDecoder(val);
          var params = extractRequiredLen(val);
          var parameters = valueDecoder(new Uint8ArrayConsumer(params));
          return {
              entrypoint: encodedEntrypoint,
              value: parameters,
          };
      }
  };
  var entrypointEncoder = function (entrypoint) {
      if (entrypoint in entrypointMappingReverse) {
          return "" + entrypointMappingReverse[entrypoint];
      }
      else {
          if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
              throw new Error("Oversized entrypoint: " + entrypoint + ". The maximum length of entrypoint is " + ENTRYPOINT_MAX_LENGTH);
          }
          var value = { string: entrypoint };
          return "ff" + valueEncoder(value).slice(8);
      }
  };
  var parametersEncoder = function (val) {
      if (!val || (val.entrypoint === 'default' && 'prim' in val.value && val.value.prim === 'Unit')) {
          return '00';
      }
      var encodedEntrypoint = entrypointEncoder(val.entrypoint);
      var parameters = valueEncoder(val.value);
      var length = (parameters.length / 2).toString(16).padStart(8, '0');
      return "ff" + encodedEntrypoint + length + parameters;
  };

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var ManagerOperationSchema = {
      branch: 'branch',
      contents: ['operation'],
  };
  var ActivationSchema = {
      pkh: 'tz1',
      secret: 'secret',
  };
  var RevealSchema = {
      source: 'pkh',
      fee: 'zarith',
      counter: 'zarith',
      gas_limit: 'zarith',
      storage_limit: 'zarith',
      public_key: 'public_key',
  };
  var DelegationSchema = {
      source: 'pkh',
      fee: 'zarith',
      counter: 'zarith',
      gas_limit: 'zarith',
      storage_limit: 'zarith',
      delegate: 'delegate',
  };
  var TransactionSchema = {
      source: 'pkh',
      fee: 'zarith',
      counter: 'zarith',
      gas_limit: 'zarith',
      storage_limit: 'zarith',
      amount: 'zarith',
      destination: 'address',
      parameters: 'parameters',
  };
  var OriginationSchema = {
      source: 'pkh',
      fee: 'zarith',
      counter: 'zarith',
      gas_limit: 'zarith',
      storage_limit: 'zarith',
      balance: 'zarith',
      delegate: 'delegate',
      script: 'script',
  };
  var BallotSchema = {
      source: 'pkh',
      period: 'int32',
      proposal: 'proposal',
      ballot: 'ballotStmt',
  };
  var EndorsementSchema = {
      level: 'int32',
  };
  var SeedNonceRevelationSchema = {
      level: 'int32',
      nonce: 'raw',
  };
  var ProposalsSchema = {
      source: 'pkh',
      period: 'int32',
      proposals: 'proposalArr',
  };
  var operationEncoder = function (encoders) { return function (operation) {
      if (!(operation.kind in encoders) || !(operation.kind in kindMappingReverse)) {
          throw new Error("Unsupported operation kind: " + operation.kind);
      }
      return kindMappingReverse[operation.kind] + encoders[operation.kind](operation);
  }; };
  var operationDecoder = function (decoders) { return function (value) {
      var op = value.consume(1);
      var operationName = kindMapping[op[0]];
      var decodedObj = decoders[operationName](value);
      if (typeof decodedObj !== 'object') {
          throw new Error('Decoded invalid operation');
      }
      if (operationName) {
          return __assign({ kind: operationName }, decodedObj);
      }
      else {
          throw new Error("Unsupported operation " + op[0]);
      }
  }; };
  var schemaEncoder = function (encoders) { return function (schema) { return function (value) {
      var keys = Object.keys(schema);
      return keys.reduce(function (prev, key) {
          var valueToEncode = schema[key];
          if (Array.isArray(valueToEncode)) {
              var encoder_1 = encoders[valueToEncode[0]];
              var values = value[key];
              if (!Array.isArray(values)) {
                  throw new Error("Exepected value to be Array " + JSON.stringify(values));
              }
              return prev + values.reduce(function (prevBytes, current) { return prevBytes + encoder_1(current); }, '');
          }
          else {
              var encoder = encoders[valueToEncode];
              return prev + encoder(value[key]);
          }
      }, '');
  }; }; };
  var schemaDecoder = function (decoders) { return function (schema) { return function (value) {
      var keys = Object.keys(schema);
      return keys.reduce(function (prev, key) {
          var _a, _b;
          var valueToEncode = schema[key];
          if (Array.isArray(valueToEncode)) {
              var decoder = decoders[valueToEncode[0]];
              var decoded = [];
              var lastLength = value.length();
              while (value.length() > 0) {
                  decoded.push(decoder(value));
                  if (lastLength === value.length()) {
                      throw new Error('Unable to decode value');
                  }
              }
              return __assign(__assign({}, prev), (_a = {}, _a[key] = decoded, _a));
          }
          else {
              var decoder = decoders[valueToEncode];
              var result = decoder(value);
              if (result) {
                  return __assign(__assign({}, prev), (_b = {}, _b[key] = result, _b));
              }
              else {
                  return __assign({}, prev);
              }
          }
      }, {});
  }; }; };

  var _a;
  var decoders = (_a = {},
      _a[exports.CODEC.SECRET] = function (val) { return toHexString(val.consume(20)); },
      _a[exports.CODEC.RAW] = function (val) { return toHexString(val.consume(32)); },
      _a[exports.CODEC.TZ1] = tz1Decoder,
      _a[exports.CODEC.BRANCH] = branchDecoder,
      _a[exports.CODEC.ZARITH] = zarithDecoder,
      _a[exports.CODEC.PUBLIC_KEY] = publicKeyDecoder,
      _a[exports.CODEC.PKH] = pkhDecoder,
      _a[exports.CODEC.DELEGATE] = delegateDecoder,
      _a[exports.CODEC.INT32] = int32Decoder,
      _a[exports.CODEC.SCRIPT] = scriptDecoder,
      _a[exports.CODEC.BALLOT_STATEMENT] = ballotDecoder,
      _a[exports.CODEC.PROPOSAL] = proposalDecoder,
      _a[exports.CODEC.PROPOSAL_ARR] = proposalsDecoder,
      _a[exports.CODEC.PARAMETERS] = parametersDecoder,
      _a[exports.CODEC.ADDRESS] = addressDecoder,
      _a);
  decoders[exports.CODEC.OPERATION] = operationDecoder(decoders);
  decoders[exports.CODEC.OP_ACTIVATE_ACCOUNT] = function (val) {
      return schemaDecoder(decoders)(ActivationSchema)(val);
  };
  decoders[exports.CODEC.OP_DELEGATION] = function (val) {
      return schemaDecoder(decoders)(DelegationSchema)(val);
  };
  decoders[exports.CODEC.OP_TRANSACTION] = function (val) {
      return schemaDecoder(decoders)(TransactionSchema)(val);
  };
  decoders[exports.CODEC.OP_ORIGINATION] = function (val) {
      return schemaDecoder(decoders)(OriginationSchema)(val);
  };
  decoders[exports.CODEC.OP_BALLOT] = function (val) { return schemaDecoder(decoders)(BallotSchema)(val); };
  decoders[exports.CODEC.OP_ENDORSEMENT] = function (val) {
      return schemaDecoder(decoders)(EndorsementSchema)(val);
  };
  decoders[exports.CODEC.OP_SEED_NONCE_REVELATION] = function (val) {
      return schemaDecoder(decoders)(SeedNonceRevelationSchema)(val);
  };
  decoders[exports.CODEC.OP_PROPOSALS] = function (val) {
      return schemaDecoder(decoders)(ProposalsSchema)(val);
  };
  decoders[exports.CODEC.OP_REVEAL] = function (val) { return schemaDecoder(decoders)(RevealSchema)(val); };
  decoders[exports.CODEC.MANAGER] = schemaDecoder(decoders)(ManagerOperationSchema);

  var _a$1;
  var encoders = (_a$1 = {},
      _a$1[exports.CODEC.SECRET] = function (val) { return val; },
      _a$1[exports.CODEC.RAW] = function (val) { return val; },
      _a$1[exports.CODEC.TZ1] = tz1Encoder,
      _a$1[exports.CODEC.BRANCH] = branchEncoder,
      _a$1[exports.CODEC.ZARITH] = zarithEncoder,
      _a$1[exports.CODEC.PUBLIC_KEY] = publicKeyEncoder,
      _a$1[exports.CODEC.PKH] = pkhEncoder,
      _a$1[exports.CODEC.DELEGATE] = delegateEncoder,
      _a$1[exports.CODEC.SCRIPT] = scriptEncoder,
      _a$1[exports.CODEC.BALLOT_STATEMENT] = ballotEncoder,
      _a$1[exports.CODEC.PROPOSAL] = proposalEncoder,
      _a$1[exports.CODEC.PROPOSAL_ARR] = proposalsEncoder,
      _a$1[exports.CODEC.INT32] = int32Encoder,
      _a$1[exports.CODEC.PARAMETERS] = parametersEncoder,
      _a$1[exports.CODEC.ADDRESS] = addressEncoder,
      _a$1);
  encoders[exports.CODEC.OPERATION] = operationEncoder(encoders);
  encoders[exports.CODEC.OP_ACTIVATE_ACCOUNT] = function (val) { return schemaEncoder(encoders)(ActivationSchema)(val); };
  encoders[exports.CODEC.OP_DELEGATION] = function (val) { return schemaEncoder(encoders)(DelegationSchema)(val); };
  encoders[exports.CODEC.OP_TRANSACTION] = function (val) { return schemaEncoder(encoders)(TransactionSchema)(val); };
  encoders[exports.CODEC.OP_ORIGINATION] = function (val) { return schemaEncoder(encoders)(OriginationSchema)(val); };
  encoders[exports.CODEC.OP_BALLOT] = function (val) { return schemaEncoder(encoders)(BallotSchema)(val); };
  encoders[exports.CODEC.OP_ENDORSEMENT] = function (val) { return schemaEncoder(encoders)(EndorsementSchema)(val); };
  encoders[exports.CODEC.OP_SEED_NONCE_REVELATION] = function (val) {
      return schemaEncoder(encoders)(SeedNonceRevelationSchema)(val);
  };
  encoders[exports.CODEC.OP_PROPOSALS] = function (val) { return schemaEncoder(encoders)(ProposalsSchema)(val); };
  encoders[exports.CODEC.OP_REVEAL] = function (val) { return schemaEncoder(encoders)(RevealSchema)(val); };
  encoders[exports.CODEC.MANAGER] = schemaEncoder(encoders)(ManagerOperationSchema);

  function getCodec(codec) {
      return {
          encoder: encoders[codec],
          decoder: function (hex) {
              var consumer = Uint8ArrayConsumer.fromHexString(hex);
              return decoders[codec](consumer);
          },
      };
  }
  var LocalForger = /** @class */ (function () {
      function LocalForger() {
          this.codec = getCodec(exports.CODEC.MANAGER);
      }
      LocalForger.prototype.forge = function (params) {
          return Promise.resolve(this.codec.encoder(params));
      };
      LocalForger.prototype.parse = function (hex) {
          return Promise.resolve(this.codec.decoder(hex));
      };
      return LocalForger;
  }());
  var localForger = new LocalForger();

  exports.LocalForger = LocalForger;
  exports.Uint8ArrayConsumer = Uint8ArrayConsumer;
  exports.decoders = decoders;
  exports.encoders = encoders;
  exports.getCodec = getCodec;
  exports.localForger = localForger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=taquito-local-forging.umd.js.map
