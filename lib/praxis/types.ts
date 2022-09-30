import { Blob } from 'buffer'
import { Receiver } from './Receiver'

export type Primitive = undefined | null | boolean | number | string | Blob | ArrayBuffer

export type ObjectID = number
export type CallbackID = number
export type GetID = number
export type FlushID = number

export type PathType = (string | symbol)[]

export enum ControllerMessageType {
    Cleanup,
    Commands,
}

export abstract class Messenger {
    abstract postMessage(message: any): void
}

export interface MessageShim {
    new (reciever: Receiver, ...args: any[])
}

export type ControllerMessage = ControllerMessageCommands | ControllerMessageCleanup

export type ControllerMessageCommands = {
    type: ControllerMessageType.Commands,
    commands: Command[],
    flushId: FlushID 
} 
export type ControllerMessageCleanup = {
    type: ControllerMessageType.Cleanup,
    ids: ObjectID[]
}

export enum ReceiverMessageType {
    Done,
    Callback
}

export type ReceiverMessage = ReceiverMessageDone | ReceiverMessageCallback

export type Result = {
    getId: GetID,
    valueData: Arg
}
export type ReceiverMessageDone = {
    type: ReceiverMessageType.Done,
    flushId: FlushID,
    results: Result[]
}

export type ReceiverMessageCallback = {
    type: ReceiverMessageType.Callback
    id: CallbackID,
    args: Arg[]
}

export enum CommandType {
    Call,
    Set,
    Get,
    Construct
}

export enum ArgType {
    Primitive,
    Object,
    Callback,
    ObjectProperty,
}

export type Arg = {
    type: ArgType.Primitive,
    value: Primitive
} | {
    type: ArgType.Object,
    value: ObjectID
} | {
    type: ArgType.Callback,
    value: CallbackID
} | {
    type: ArgType.ObjectProperty,
    value: ObjectID,
    path: PathType
}

export type Command = CommandCall | CommandSet | CommandGet | CommandConstruct

export type CommandCall = {
    type: CommandType.Call,
    objectId: ObjectID,
    path: PathType,
    argsData: Arg[],
    returnId: ObjectID
}

export type CommandSet = {
    type: CommandType.Set,
    objectId: ObjectID,
    path: PathType,
    argsData: Arg
}

export type CommandGet = {
    type: CommandType.Get,
    objectId: ObjectID,
    path: PathType
    getId: GetID,
}

export type CommandConstruct = {
    type: CommandType.Construct,
    objectId: ObjectID,
    path: PathType,
    argsData: Arg[],
    returnId: ObjectID
}

export function CanStructuredClone(o: any) {
    const type = typeof o
    return type === "undefined" || o === null || type === "boolean" || type === "number" || type === "string" ||
            (o instanceof Blob) || (o instanceof ArrayBuffer) ||type === "object"
}
