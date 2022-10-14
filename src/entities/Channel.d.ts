import { EntropyEntity } from './Entity';
import { Widget } from './Widget';
import { Domain } from './Domain';
import { Owns } from './builtin/types';
export declare class Channel extends EntropyEntity {
    activeLayout?: Object;
    templateLayouts?: Object[];
    widgets: Owns<Widget[]>;
    domain?: Domain;
    constructor();
}
