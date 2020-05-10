"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("./schema/storage");
var fast_json_stable_stringify_1 = require("fast-json-stable-stringify");
var isMapType = function (value) {
    return 'args' in value && Array.isArray(value.args) && value.args.length === 2;
};
var MapTypecheckError = /** @class */ (function () {
    function MapTypecheckError(value, type, errorType) {
        this.value = value;
        this.type = type;
        this.name = 'MapTypecheckError';
        this.message = errorType + " not compliant with underlying michelson type";
    }
    return MapTypecheckError;
}());
exports.MapTypecheckError = MapTypecheckError;
/**
 * @description Michelson Map is an abstraction over the michelson native map. It supports complex Pair as key
 */
var MichelsonMap = /** @class */ (function () {
    /**
     * @param mapType If specified key and value will be type-checked before being added to the map
     *
     * @example new MichelsonMap({ prim: "map", args: [{prim: "string"}, {prim: "int"}]})
     */
    function MichelsonMap(mapType) {
        this.valueMap = new Map();
        this.keyMap = new Map();
        if (mapType) {
            this.setType(mapType);
        }
    }
    MichelsonMap.prototype.setType = function (mapType) {
        if (!isMapType(mapType)) {
            throw new Error('mapType is not a valid michelson map type');
        }
        this.keySchema = new storage_1.Schema(mapType.args[0]);
        this.valueSchema = new storage_1.Schema(mapType.args[1]);
    };
    MichelsonMap.prototype.removeType = function () {
        this.keySchema = undefined;
        this.valueSchema = undefined;
    };
    MichelsonMap.fromLiteral = function (obj, mapType) {
        var map = new MichelsonMap(mapType);
        Object.keys(obj).forEach(function (key) {
            map.set(key, obj[key]);
        });
        return map;
    };
    MichelsonMap.prototype.typecheckKey = function (key) {
        if (this.keySchema) {
            return this.keySchema.Typecheck(key);
        }
        return true;
    };
    MichelsonMap.prototype.typecheckValue = function (value) {
        if (this.valueSchema) {
            return this.valueSchema.Typecheck(value);
        }
        return true;
    };
    MichelsonMap.prototype.assertTypecheckValue = function (value) {
        if (!this.typecheckValue(value)) {
            throw new MapTypecheckError(value, this.valueSchema, 'value');
        }
    };
    MichelsonMap.prototype.assertTypecheckKey = function (key) {
        if (!this.typecheckKey(key)) {
            throw new MapTypecheckError(key, this.keySchema, 'key');
        }
    };
    MichelsonMap.prototype.serializeDeterministically = function (key) {
        return fast_json_stable_stringify_1.default(key);
    };
    MichelsonMap.prototype.keys = function () {
        var _a, _b, _c, key, e_1_1;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, 6, 7]);
                    _a = __values(this.entries()), _b = _a.next();
                    _e.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    _c = __read(_b.value, 1), key = _c[0];
                    return [4 /*yield*/, key];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    MichelsonMap.prototype.values = function () {
        var _a, _b, _c, value, e_2_1;
        var e_2, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, 6, 7]);
                    _a = __values(this.entries()), _b = _a.next();
                    _e.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    _c = __read(_b.value, 2), value = _c[1];
                    return [4 /*yield*/, value];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_2_1 = _e.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    MichelsonMap.prototype.entries = function () {
        var _a, _b, key, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(this.valueMap.keys()), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    key = _b.value;
                    return [4 /*yield*/, [this.keyMap.get(key), this.valueMap.get(key)]];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    MichelsonMap.prototype.get = function (key) {
        this.assertTypecheckKey(key);
        var strKey = this.serializeDeterministically(key);
        return this.valueMap.get(strKey);
    };
    /**
     *
     * @description Set a key and a value in the MichelsonMap. If the key already exists, override the current value.
     *
     * @example map.set("myKey", "myValue") // Using a string as key
     *
     * @example map.set({0: "test", 1: "test1"}, "myValue") // Using a pair as key
     *
     * @warn The same key can be represented in multiple ways, depending on the type of the key. This duplicate key situation will cause a runtime error (duplicate key) when sending the map data to the Tezos RPC node.
     *
     * For example, consider a contract with a map whose key is of type boolean.  If you set the following values in MichelsonMap: map.set(false, "myValue") and map.set(null, "myValue").
     *
     * You will get two unique entries in the MichelsonMap. These values will both be evaluated as falsy by the MichelsonEncoder and ultimately rejected by the Tezos RPC.
     */
    MichelsonMap.prototype.set = function (key, value) {
        this.assertTypecheckKey(key);
        this.assertTypecheckValue(value);
        var strKey = this.serializeDeterministically(key);
        this.keyMap.set(strKey, key);
        this.valueMap.set(strKey, value);
    };
    MichelsonMap.prototype.delete = function (key) {
        this.assertTypecheckKey(key);
        this.keyMap.delete(this.serializeDeterministically(key));
        this.valueMap.delete(this.serializeDeterministically(key));
    };
    MichelsonMap.prototype.has = function (key) {
        this.assertTypecheckKey(key);
        var strKey = this.serializeDeterministically(key);
        return this.keyMap.has(strKey) && this.valueMap.has(strKey);
    };
    MichelsonMap.prototype.clear = function () {
        this.keyMap.clear();
        this.valueMap.clear();
    };
    Object.defineProperty(MichelsonMap.prototype, "size", {
        get: function () {
            return this.keyMap.size;
        },
        enumerable: true,
        configurable: true
    });
    MichelsonMap.prototype.forEach = function (cb) {
        var e_4, _a;
        try {
            for (var _b = __values(this.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                cb(value, key, this);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    return MichelsonMap;
}());
exports.MichelsonMap = MichelsonMap;
//# sourceMappingURL=michelson-map.js.map