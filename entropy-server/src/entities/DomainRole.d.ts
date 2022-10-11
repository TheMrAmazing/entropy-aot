import { Domain } from './Domain';
import { User } from './User';
import { Role } from './Role';
import { Cascade } from './builtin/types';
export declare class DomainRole extends Role {
    domainId?: string;
    domain: Domain;
    users: Cascade<User[]>;
    userIds?: string[];
    canAssign: DomainRole[];
    domainRoleIds?: string[];
    constructor();
}
