import { Receiver } from './Receiver'
export declare type Primitive = undefined | null | boolean | number | string | Blob | ArrayBuffer
export declare type ObjectID = number
export declare type CallbackID = number
export declare type GetID = number
export declare type FlushID = number
export declare type PathType = (string | symbol)[]

export declare abstract class Messenger {
    abstract postMessage(message: any): void
}

export interface MessageShim {
    new (reciever: Receiver, ...args: any[]): any
}

export declare type ControllerMessage = ControllerMessageCommands | ControllerMessageCleanup;

export declare type ControllerMessageCommands = {
    type: 1
    commands: Command[]
    flushId: FlushID
}

export declare type ControllerMessageCleanup = {
    type: 0
    ids: ObjectID[]
}


export declare type ReceiverMessage = ReceiverMessageDone | ReceiverMessageCallback

export declare type Result = {
    getId: GetID
    valueData: Arg
}

export declare type ReceiverMessageDone = {
    type: 0
    flushId: FlushID
    results: Result[]
}

export declare type ReceiverMessageCallback = {
    type: 1
    id: CallbackID
    args: Arg[]
}

export declare type Arg = {
    type: 0 //Primitive
    value: Primitive
} | {
    type: 1 //Object
    value: ObjectID
} | {
    type: 2 //Callback
    value: CallbackID
} | {
    type: 3 //ObjectProperty
    value: ObjectID
    path: PathType
} | {
    type: 4 //Function
    scope: Object
    func: string
} | {
    type: 5 //Return
    value: Object
    getId: GetID
}

export declare type Command = CommandCall | CommandSet | CommandGet | CommandConstruct;

export declare type CommandCall = {
    type: 0
    objectId: ObjectID
    path: PathType
    argsData: Arg[]
    returnId: ObjectID
};
export declare type CommandSet = {
    type: 1
    objectId: ObjectID
    path: PathType
    argsData: Arg
}

export declare type CommandGet = {
    type: 2
    objectId: ObjectID
    path: PathType
    getId: GetID
}

export declare type CommandConstruct = {
    type: 3
    objectId: ObjectID
    path: PathType
    argsData: Arg[]
    returnId: ObjectID
}

declare function CanStructuredClone(o: any): boolean