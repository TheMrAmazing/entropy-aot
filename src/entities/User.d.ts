import { EntropyEntity } from './Entity';
import { GlobalRole } from './GlobalRole';
import { DomainRole } from './DomainRole';
import { Domain } from './Domain';
import { Message } from './Message';
import { Owns, Unique } from './builtin/types';
export declare class User extends EntropyEntity {
    email: Unique<string>;
    password: string;
    name: string;
    domainRoles: DomainRole[];
    globalRoles: Owns<GlobalRole[]>;
    verified: boolean;
    image: string;
    domain?: Owns<Domain>;
    domainId?: string;
    messages?: Message[];
    constructor();
}
