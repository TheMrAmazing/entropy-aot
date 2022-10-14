import { Room } from './Room';
import { Channel } from './Channel';
import { EntropyEntity } from './Entity';
import { StoreItem } from './StoreItem';
import { Owns } from './builtin/types';
export declare class Widget extends EntropyEntity {
    config?: Object;
    storeItemId: string;
    storeItem: StoreItem;
    rooms: Owns<Room[]>;
    channel: Channel;
    channelId: string;
    constructor();
}
