import { EntropyEntity } from './Entity';
import { DevItem } from './DevItem';
import { Owns, Unique } from './builtin/types';
import { Domain } from './Domain';
import { StoreItem } from './StoreItem';
export declare class Developer extends EntropyEntity {
    apiKey: Unique<string>;
    domain?: Domain;
    devItems: Owns<DevItem[]>;
    storeItems: StoreItem[];
    constructor();
}
