"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var codec_1 = require("./codec");
var constants_1 = require("./constants");
var codec_2 = require("./michelson/codec");
var operation_1 = require("./schema/operation");
var utils_1 = require("./utils");
exports.decoders = (_a = {},
    _a[constants_1.CODEC.SECRET] = function (val) { return utils_1.toHexString(val.consume(20)); },
    _a[constants_1.CODEC.RAW] = function (val) { return utils_1.toHexString(val.consume(32)); },
    _a[constants_1.CODEC.TZ1] = codec_1.tz1Decoder,
    _a[constants_1.CODEC.BRANCH] = codec_1.branchDecoder,
    _a[constants_1.CODEC.ZARITH] = codec_1.zarithDecoder,
    _a[constants_1.CODEC.PUBLIC_KEY] = codec_1.publicKeyDecoder,
    _a[constants_1.CODEC.PKH] = codec_1.pkhDecoder,
    _a[constants_1.CODEC.DELEGATE] = codec_1.delegateDecoder,
    _a[constants_1.CODEC.INT32] = codec_1.int32Decoder,
    _a[constants_1.CODEC.SCRIPT] = codec_2.scriptDecoder,
    _a[constants_1.CODEC.BALLOT_STATEMENT] = codec_1.ballotDecoder,
    _a[constants_1.CODEC.PROPOSAL] = codec_1.proposalDecoder,
    _a[constants_1.CODEC.PROPOSAL_ARR] = codec_1.proposalsDecoder,
    _a[constants_1.CODEC.PARAMETERS] = codec_1.parametersDecoder,
    _a[constants_1.CODEC.ADDRESS] = codec_1.addressDecoder,
    _a);
exports.decoders[constants_1.CODEC.OPERATION] = operation_1.operationDecoder(exports.decoders);
exports.decoders[constants_1.CODEC.OP_ACTIVATE_ACCOUNT] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.ActivationSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_DELEGATION] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.DelegationSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_TRANSACTION] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.TransactionSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_ORIGINATION] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.OriginationSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_BALLOT] = function (val) { return operation_1.schemaDecoder(exports.decoders)(operation_1.BallotSchema)(val); };
exports.decoders[constants_1.CODEC.OP_ENDORSEMENT] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.EndorsementSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_SEED_NONCE_REVELATION] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.SeedNonceRevelationSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_PROPOSALS] = function (val) {
    return operation_1.schemaDecoder(exports.decoders)(operation_1.ProposalsSchema)(val);
};
exports.decoders[constants_1.CODEC.OP_REVEAL] = function (val) { return operation_1.schemaDecoder(exports.decoders)(operation_1.RevealSchema)(val); };
exports.decoders[constants_1.CODEC.MANAGER] = operation_1.schemaDecoder(exports.decoders)(operation_1.ManagerOperationSchema);
//# sourceMappingURL=decoder.js.map