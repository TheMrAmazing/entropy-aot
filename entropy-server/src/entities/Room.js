import { EntropyEntity } from './Entity';
export class Room extends EntropyEntity {
    name;
    messages;
    readScopes;
    writeScopes;
    deleteScopes;
    widget;
    constructor() {
        super();
    }
}
