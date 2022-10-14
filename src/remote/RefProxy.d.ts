/**@param {Controller} controller @param {ObjectID} objectId @param {PathType} path*/
export declare function refProxy(controller: any, objectId: any, path: any): {
    get: (target: any, key: string | symbol, receiver: any) => any;
};
