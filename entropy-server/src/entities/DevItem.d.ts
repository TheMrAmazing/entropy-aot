import { Owns, Unique } from './builtin/types';
import { Developer } from './Developer';
import { EntropyEntity } from './Entity';
import { StoreItem } from './StoreItem';
declare enum ItemStatus {
    Pending = "pending",
    Published = "published",
    Approved = "approved"
}
export declare class DevItem extends EntropyEntity {
    location?: Unique<string>;
    name: string;
    status: ItemStatus;
    developer: Developer;
    developerId: string;
    storeItem?: Owns<StoreItem>;
    storeItemId?: string;
    config?: Object;
    constructor();
}
export {};
