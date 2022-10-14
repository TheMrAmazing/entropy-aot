export var ControllerMessageType;
(function (ControllerMessageType) {
    ControllerMessageType[ControllerMessageType["Cleanup"] = 0] = "Cleanup";
    ControllerMessageType[ControllerMessageType["Commands"] = 1] = "Commands";
})(ControllerMessageType || (ControllerMessageType = {}));
export class Messenger {
}
export var ReceiverMessageType;
(function (ReceiverMessageType) {
    ReceiverMessageType[ReceiverMessageType["Done"] = 0] = "Done";
    ReceiverMessageType[ReceiverMessageType["Callback"] = 1] = "Callback";
})(ReceiverMessageType || (ReceiverMessageType = {}));
export var CommandType;
(function (CommandType) {
    CommandType[CommandType["Call"] = 0] = "Call";
    CommandType[CommandType["Set"] = 1] = "Set";
    CommandType[CommandType["Get"] = 2] = "Get";
    CommandType[CommandType["Construct"] = 3] = "Construct";
})(CommandType || (CommandType = {}));
export var ArgType;
(function (ArgType) {
    ArgType[ArgType["Primitive"] = 0] = "Primitive";
    ArgType[ArgType["Object"] = 1] = "Object";
    ArgType[ArgType["Callback"] = 2] = "Callback";
    ArgType[ArgType["ObjectProperty"] = 3] = "ObjectProperty";
    ArgType[ArgType["Function"] = 4] = "Function";
    ArgType[ArgType["Return"] = 5] = "Return";
})(ArgType || (ArgType = {}));
export class RemoteObject {
    _objectId;
    constructor(objectId) {
        this._objectId = objectId;
    }
}
export class RemoteProperty extends RemoteObject {
    _path;
    constructor(objectId, path) {
        super(objectId);
        this._path = path;
    }
}
export function CanStructuredClone(o) {
    const type = typeof o;
    return type === "undefined" || o === null || type === "boolean" || type === "number" || type === "string" || (o instanceof ArrayBuffer);
}
