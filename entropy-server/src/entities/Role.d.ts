import { EntropyEntity } from './Entity';
export declare class Role extends EntropyEntity {
    allows: string[];
    blocks: string[];
    rank: number;
    name: string;
    graphic?: string;
    constructor();
}
