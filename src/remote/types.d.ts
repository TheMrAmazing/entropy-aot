import { Receiver } from './Receiver';
export declare type Primitive = undefined | null | boolean | number | string | Blob | ArrayBuffer;
export declare type ObjectID = number;
export declare type CallbackID = number;
export declare type GetID = number;
export declare type FlushID = number;
export declare type PathType = (string | symbol)[];
export declare enum ControllerMessageType {
    Cleanup = 0,
    Commands = 1
}
export declare abstract class Messenger {
    abstract postMessage(message: any): void;
}
export interface MessageShim {
    new (reciever: Receiver, ...args: any[]): any;
}
export declare type ControllerMessage = ControllerMessageCommands | ControllerMessageCleanup;
export declare type ControllerMessageCommands = {
    type: ControllerMessageType.Commands;
    commands: Command[];
    flushId: FlushID;
};
export declare type ControllerMessageCleanup = {
    type: ControllerMessageType.Cleanup;
    ids: ObjectID[];
};
export declare enum ReceiverMessageType {
    Done = 0,
    Callback = 1
}
export declare type ReceiverMessage = ReceiverMessageDone | ReceiverMessageCallback;
export declare type Result = {
    getId: GetID;
    valueData: Arg;
};
export declare type ReceiverMessageDone = {
    type: ReceiverMessageType.Done;
    flushId: FlushID;
    results: Result[];
};
export declare type ReceiverMessageCallback = {
    type: ReceiverMessageType.Callback;
    id: CallbackID;
    args: Arg[];
};
export declare enum CommandType {
    Call = 0,
    Set = 1,
    Get = 2,
    Construct = 3
}
export declare enum ArgType {
    Primitive = 0,
    Object = 1,
    Callback = 2,
    ObjectProperty = 3,
    Function = 4,
    Return = 5
}
export declare type Arg = {
    type: ArgType.Primitive;
    value: Primitive;
} | {
    type: ArgType.Object;
    value: ObjectID;
} | {
    type: ArgType.Callback;
    value: CallbackID;
} | {
    type: ArgType.ObjectProperty;
    value: ObjectID;
    path: PathType;
} | {
    type: ArgType.Function;
    scope: Object;
    func: string;
} | {
    type: ArgType.Return;
    value: Object;
    getId: GetID;
};
export declare type Command = CommandCall | CommandSet | CommandGet | CommandConstruct;
export declare type CommandCall = {
    type: CommandType.Call;
    objectId: ObjectID;
    path: PathType;
    argsData: Arg[];
    returnId: ObjectID;
};
export declare type CommandSet = {
    type: CommandType.Set;
    objectId: ObjectID;
    path: PathType;
    argsData: Arg;
};
export declare type CommandGet = {
    type: CommandType.Get;
    objectId: ObjectID;
    path: PathType;
    getId: GetID;
};
export declare type CommandConstruct = {
    type: CommandType.Construct;
    objectId: ObjectID;
    path: PathType;
    argsData: Arg[];
    returnId: ObjectID;
};
export declare class RemoteObject {
    _objectId: ObjectID;
    constructor(objectId: ObjectID);
}
export declare class RemoteProperty extends RemoteObject {
    _path: PathType;
    constructor(objectId: ObjectID, path: PathType);
}
export declare function CanStructuredClone(o: any): boolean;
