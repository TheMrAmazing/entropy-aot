/// <reference types="node" />
import { PathType, ObjectID, CallbackID, Command, GetID, FlushID, ControllerMessage, Arg, ReceiverMessage, ReceiverMessageDone, ReceiverMessageCallback } from '../types';
declare type Messenger = {
    postMessage(message: ControllerMessage): void;
};
declare type ResolveFunc = (value: unknown) => void;
declare type Resolve = {
    func: (value: unknown) => void;
    objectId: ObjectID;
    path: PathType;
};
export declare class Controller {
    commandQueue: Command[];
    finalizationRegistry: FinalizationRegistry<ObjectID>;
    finalizeIntervalMs: number;
    finalizeIdQueue: ObjectID[];
    finalizeTimerId: NodeJS.Timeout | undefined;
    nextGetId: GetID;
    nextFlushId: FlushID;
    nextCallbackId: CallbackID;
    callbackToId: Map<Function, CallbackID>;
    idToCallback: Map<CallbackID, Function>;
    pendingGetResolves: Map<GetID, Resolve | ResolveFunc>;
    pendingFlushResolves: Map<FlushID, ResolveFunc>;
    isPendingFlush: boolean;
    static ObjectSymbol: symbol;
    static TargetSymbol: symbol;
    messenger: Messenger;
    Remote: any;
    AddToQueue(command: Command): void;
    GetCallbackId(func: Function): number;
    WrapArg(arg: any): Arg;
    MakeReturn(getId: any, val: any): any;
    UnwrapArg(arg: Arg): any;
    Flush(): Promise<unknown>;
    OnMessage(data: ReceiverMessage): void;
    OnDone(data: ReceiverMessageDone): void;
    OnCallback(data: ReceiverMessageCallback): void;
    MakeObject(id: ObjectID): {
        (): void;
        _objectId: number;
    };
    MakeProperty(objectId: ObjectID, path: PathType): {
        (): void;
        _objectId: number;
        _path: PathType;
        _nextCache: Map<any, any>;
    };
    AddGet(objectId: any, path: any): Promise<unknown>;
}
export declare function fnArg(scope: Object, fn: Function): () => {
    func: string;
    scope: Object;
};
export {};
