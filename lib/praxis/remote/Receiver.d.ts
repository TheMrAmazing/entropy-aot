import { PathType, MessageShim, Messenger, ObjectID, Result, CallbackID, Command, ControllerMessage, Arg, ControllerMessageCommands, ControllerMessageCleanup, CommandCall, CommandConstruct, CommandSet, CommandGet } from '../types';
export declare class Receiver {
    messenger: Messenger;
    idMap: Map<ObjectID, any>;
    nextObjectId: ObjectID;
    remoteFile: string;
    constructor(remoteFile: string, Shim: MessageShim, ...args: any[]);
    IdToObject(id: ObjectID): any;
    ObjectToId(object: any): number;
    IdToObjectProperty(id: ObjectID, path: PathType): any;
    sanitize(obj: any): Promise<boolean>;
    WrapArg(arg: any): Promise<Arg>;
    GetCallbackShim(id: CallbackID): (...args: any[]) => void;
    makeFunction(scope: Object, func: string): any;
    UnwrapArg(arg: Arg): any;
    OnMessage(data: ControllerMessage): Promise<void>;
    OnCommandsMessage(data: ControllerMessageCommands): Promise<void>;
    OnCleanupMessage(data: ControllerMessageCleanup): void;
    RunCommand(command: Command, getResults: Result[]): Promise<void>;
    Call(command: CommandCall): void;
    Construct(command: CommandConstruct): void;
    Set(command: CommandSet): void;
    Get(command: CommandGet, getResults: Result[]): Promise<void>;
}
