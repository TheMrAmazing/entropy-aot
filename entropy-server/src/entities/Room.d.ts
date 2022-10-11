import { EntropyEntity } from './Entity';
import { Message } from './Message';
import { Widget } from './Widget';
import { Owns } from './builtin/types';
export declare class Room extends EntropyEntity {
    name: string;
    messages: Owns<Message[]>;
    readScopes: string[];
    writeScopes: string[];
    deleteScopes: string[];
    widget: Widget;
    constructor();
}
