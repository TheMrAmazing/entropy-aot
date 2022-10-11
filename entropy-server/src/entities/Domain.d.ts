import { EntropyEntity } from './Entity';
import { DomainRole } from './DomainRole';
import { User } from './User';
import { Developer } from './Developer';
import { Channel } from './Channel';
import { Unique, Owns } from './builtin/types';
export declare class Domain extends EntropyEntity {
    handle: Unique<string>;
    developerId?: string;
    developer?: Owns<Developer>;
    channelId?: string;
    channel?: Owns<Channel>;
    everyoneScopes?: string[];
    anonScopes?: string[];
    roles: Owns<DomainRole[]>;
    user: User;
    constructor();
}
