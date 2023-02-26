declare enum StreamDataType {
    MASTER_PLAYLIST = "master-playlist",
    MEDIA_PLAYLIST = "media-playlist",
    FRAG = "frag",
    FRAG_INIT = "frag-init"
}
export interface StreamData {
    type: StreamDataType;
    url: string;
    timestamp: number;
    data: Uint8Array;
}
export interface ConnectionCreateData {
    connectionId: string;
    isInitiating: boolean;
}
export interface ConnectionDestroyData {
    connectionId: string;
}
export interface ConnectionHandshakeData {
    connectionId: string;
    payload: RTCSessionDescriptionInit | RTCIceCandidateInit;
}
export interface ConnectionState extends ConnectionCreateData {
    type: 'rtcPeerConnection';
    rtcPeerConnection: RTCPeerConnection;
    connectionState: RTCPeerConnectionState;
}
export interface ChannelState extends ConnectionCreateData {
    type: 'rtcDataChannel';
    rtcDataChannel: RTCDataChannel;
    readyState: RTCDataChannelState;
}
export declare type ConnectionStateData = ConnectionState | ChannelState;
export interface FileChunk {
    file: number;
    byteOffset: number;
    totalByteLength: number;
    part: number;
    parts: number;
    data: Uint8Array;
}
export interface FileChunkAccumulator {
    data: Uint8Array;
    partsRemaining: number;
}
export interface TangleConfig {
    webrtcIceTransportPolicy: RTCIceTransportPolicy;
    webrtcBundlePolicy: RTCBundlePolicy;
    webrtcMuxPolicy: RTCRtcpMuxPolicy;
    webrtcIceServers: RTCIceServer[];
    webrtcBufferedAmountLow: number;
    webrtcFileChunkByteLength: number;
    webrtcOrdered: boolean;
    webrtcMaxRetransmits: number;
}
export declare enum Events {
    CONNECTION_CREATE = "connection-create",
    CONNECTION_DESTROY = "connection-destroy",
    CONNECTION_HANDSHAKE_IN = "connection-handshake-in",
    CONNECTION_HANDSHAKE_OUT = "connection-handshake-out",
    CONNECTION_OPEN = "connection-open",
    CONNECTION_CLOSED = "connection-closed",
    STREAM_DATA_IN = "stream-data-in"
}
export declare class ConnectionCreateEvent extends Event {
    data: ConnectionCreateData;
    constructor(data: ConnectionCreateData);
}
export declare class ConnectionDestroyEvent extends Event {
    data: ConnectionDestroyData;
    constructor(data: ConnectionDestroyData);
}
export declare class ConnectionHandshakeInEvent extends Event {
    data: ConnectionHandshakeData;
    constructor(data: ConnectionHandshakeData);
}
export declare class ConnectionHandshakeOutEvent extends Event {
    data: ConnectionHandshakeData;
    constructor(data: ConnectionHandshakeData);
}
export declare class ConnectionOpenEvent extends Event {
    data: ConnectionStateData;
    constructor(data: ConnectionStateData);
}
export declare class ConnectionClosedEvent extends Event {
    data: ConnectionStateData;
    constructor(data: ConnectionStateData);
}
export declare class StreamDataInEvent extends Event {
    data: StreamData;
    constructor(data: StreamData);
}
export declare class StreamDataOutEvent extends Event {
    data: StreamData;
    constructor(data: StreamData);
}
export declare const EventFactory: {
    [x: number]: (data: StreamData) => StreamDataOutEvent;
    "connection-create": (data: ConnectionCreateData) => ConnectionCreateEvent;
    "connection-destroy": (data: ConnectionDestroyData) => ConnectionDestroyEvent;
    "connection-handshake-in": (data: ConnectionHandshakeData) => ConnectionHandshakeInEvent;
    "connection-handshake-out": (data: ConnectionHandshakeData) => ConnectionHandshakeOutEvent;
    "connection-open": (data: ConnectionStateData) => ConnectionOpenEvent;
    "connection-closed": (data: ConnectionStateData) => ConnectionClosedEvent;
    "stream-data-in": (data: StreamData) => StreamDataInEvent;
};
export {};
