import { decode, encode } from 'cbor-x';
import { Events, EventFactory } from './types';
import { createWebsocket } from './ReconnectingWS';
let filesCounter = 0;
function encodeStreamData(data, byteLength) {
    let segmentCbor = encode(data);
    let dataChunks = split(segmentCbor, byteLength);
    let buffers = [];
    let byteOffset = 0;
    let file = filesCounter++;
    for (let i = 0; i < dataChunks.length; i++) {
        let dataChunk = dataChunks[i];
        let chunkCbor = encode({
            totalByteLength: segmentCbor.byteLength,
            byteOffset,
            file,
            part: i,
            parts: dataChunks.length,
            data: dataChunk
        });
        buffers.push(chunkCbor);
        byteOffset += dataChunk.byteLength;
    }
    return buffers;
}
function split(buffer, bytes) {
    let n = Math.ceil(buffer.byteLength / bytes);
    let segments = Array(n);
    let buffered = 0;
    for (let i = 0; i < n; i++) {
        segments[i] = new Uint8Array(buffer.slice(buffered, buffered + bytes));
        buffered += bytes;
    }
    return segments;
}
export function createConnection(connectionId, wsURL, isInitiating = false) {
    return new Promise(async (resolve, reject) => {
        let ws = await createWebsocket(wsURL);
        let connection = new WebRTCConnection(connectionId, isInitiating);
        ws.send(encode({
            type: 'intro',
            connectionId,
            isInitiating
        }));
        ws.onmessage = async (e) => {
            let data = decode(new Uint8Array(await e.data.arrayBuffer()));
            connection.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_HANDSHAKE_IN](data));
        };
        connection.internalEvents.addEventListener(Events.CONNECTION_HANDSHAKE_OUT, (e) => {
            ws.send(encode(e.data));
        });
        connection.internalEvents.addEventListener(Events.CONNECTION_OPEN, () => {
            resolve(connection);
        });
    });
}
class WebRTCConnection extends EventTarget {
    onmessage;
    onclose;
    connectionId;
    isInitiating;
    rtcPeerConnection;
    pendingCandidates;
    rtcDataChannel;
    buffers;
    accumulators;
    sentSnapshot;
    config = {
        webrtcIceTransportPolicy: 'all',
        webrtcBundlePolicy: 'max-bundle',
        webrtcMuxPolicy: 'require',
        webrtcIceServers: [{
                urls: [
                    'stun:stun.l.google.com:19302?transport=udp',
                    'stun:turn2.l.google.com?transport=udp'
                ]
            }],
        webrtcBufferedAmountLow: 15_000_000,
        webrtcFileChunkByteLength: 14_000,
        webrtcOrdered: true,
        webrtcMaxRetransmits: 3,
    };
    internalEvents = new EventTarget();
    constructor(connectionId, isInitiating = false) {
        super();
        this.internalEvents.addEventListener(Events.CONNECTION_HANDSHAKE_IN, (e) => this.onConnectionHandshakeIn(e.data));
        this.internalEvents.addEventListener(Events.STREAM_DATA_IN, (e) => this.onStreamDataIn(e.data));
        let rtcPeerConnection = new RTCPeerConnection({
            iceTransportPolicy: this.config.webrtcIceTransportPolicy,
            bundlePolicy: this.config.webrtcBundlePolicy,
            rtcpMuxPolicy: this.config.webrtcMuxPolicy,
            iceServers: this.config.webrtcIceServers,
        });
        this.connectionId = connectionId;
        this.isInitiating = isInitiating;
        this.pendingCandidates = [];
        this.accumulators = new Map();
        this.buffers = [];
        this.rtcPeerConnection = rtcPeerConnection;
        this.sentSnapshot = false;
        rtcPeerConnection.onconnectionstatechange = event => this.onConnectionStateChange(event);
        rtcPeerConnection.onicecandidate = event => this.onIceCandidate(event);
        rtcPeerConnection.ondatachannel = event => this.onDataChannel(event);
        rtcPeerConnection.onnegotiationneeded = event => this.onNegotiationNeeded(event);
        if (isInitiating) {
            let label = Math.random().toString().slice(2, 12);
            let rtcDataChannel = rtcPeerConnection.createDataChannel(label, {
                ordered: this.config.webrtcOrdered,
                maxRetransmits: this.config.webrtcMaxRetransmits
            });
            this.setupChannel(rtcDataChannel);
        }
    }
    onIceCandidate(event) {
        if (event.candidate) {
            this.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_HANDSHAKE_OUT]({
                connectionId: this.connectionId,
                payload: event.candidate.toJSON()
            }));
        }
    }
    onDataChannel(event) {
        this.setupChannel(event.channel);
    }
    async onNegotiationNeeded(_event) {
        try {
            let offer = await this.rtcPeerConnection.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
                iceRestart: true
            });
            await this.rtcPeerConnection.setLocalDescription(offer);
            this.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_HANDSHAKE_OUT]({
                connectionId: this.connectionId,
                //@ts-ignore
                payload: offer.toJSON()
            }));
        }
        catch (error) {
            console.error(error);
        }
    }
    setupChannel(rtcDataChannel) {
        this.rtcDataChannel = rtcDataChannel;
        this.rtcDataChannel.binaryType = 'arraybuffer';
        this.rtcDataChannel.bufferedAmountLowThreshold = this.config.webrtcBufferedAmountLow;
        this.rtcDataChannel.onbufferedamountlow = event => this.onBufferedAmountLow(event);
        this.rtcDataChannel.onclose = event => this.onClose(event);
        this.rtcDataChannel.onopen = event => this.onOpen(event);
        this.rtcDataChannel.onerror = event => this.onError(event);
        this.rtcDataChannel.onmessage = event => this.onDataChannelMessage(event);
    }
    onError(event) {
        if (event instanceof RTCErrorEvent) {
            let error = event.error;
            console.error(error);
        }
    }
    onBufferedAmountLow(_event) {
        this.processBuffers(this.buffers);
    }
    processBuffers(buffers) {
        if (this.rtcDataChannel?.readyState === 'open') {
            while (buffers.length > 0
                && this.rtcDataChannel.bufferedAmount + buffers[0].byteLength < this.config.webrtcBufferedAmountLow) {
                let data = buffers.shift();
                this.rtcDataChannel.send(data);
            }
        }
    }
    onClose(_event) {
        if (this.rtcDataChannel) {
            this.accumulators.clear();
            this.buffers = [];
            this.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_CLOSED]({
                type: 'rtcDataChannel',
                connectionId: this.connectionId,
                isInitiating: this.isInitiating,
                rtcDataChannel: this.rtcDataChannel,
                readyState: this.rtcDataChannel.readyState
            }));
        }
    }
    onConnectionClosed(data) {
        this.dispatchEvent(new MessageEvent('close', data));
        if (this.onclose) {
            this.onclose(new MessageEvent('close', data));
        }
    }
    onOpen(_event) {
        let rtcDataChannel = this.rtcDataChannel;
        this.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_OPEN]({
            type: 'rtcDataChannel',
            connectionId: this.connectionId,
            isInitiating: this.isInitiating,
            rtcDataChannel,
            readyState: rtcDataChannel.readyState
        }));
    }
    onDataChannelMessage(event) {
        try {
            let chunk = decode(new Uint8Array(event.data));
            let accumulator = this.accumulators.get(chunk.file);
            if (accumulator) {
                accumulator.partsRemaining -= 1;
                accumulator.data.set(chunk.data, chunk.byteOffset);
                if (accumulator.partsRemaining <= 0) {
                    try {
                        filesCounter = Math.max(filesCounter, chunk.file);
                        let hls = decode(accumulator.data);
                        this.internalEvents.dispatchEvent(EventFactory[Events.STREAM_DATA_IN](hls));
                        this.accumulators.delete(chunk.file);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
            else {
                if (chunk.parts > 1) {
                    filesCounter = Math.max(filesCounter, chunk.file);
                    let data = new Uint8Array(chunk.totalByteLength);
                    data.set(chunk.data, chunk.byteOffset);
                    this.accumulators.set(chunk.file, {
                        data,
                        partsRemaining: chunk.parts - 1
                    });
                }
                else {
                    let data = new Uint8Array(chunk.data);
                    let hls = decode(data);
                    this.internalEvents.dispatchEvent(EventFactory[Events.STREAM_DATA_IN](hls));
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    onStreamDataIn(data) {
        this.dispatchEvent(new MessageEvent('message', { data }));
        if (this.onmessage) {
            this.onmessage(new MessageEvent('message', { data }));
        }
    }
    onConnectionStateChange(_event) {
        if (this.rtcPeerConnection.connectionState === 'connected' && this.isInitiating) {
        }
        else if (this.rtcPeerConnection.connectionState === 'closed'
            || this.rtcPeerConnection.connectionState === 'disconnected'
            || this.rtcPeerConnection.connectionState === 'failed') {
            this.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_CLOSED]({
                type: 'rtcPeerConnection',
                connectionId: this.connectionId,
                isInitiating: this.isInitiating,
                rtcPeerConnection: this.rtcPeerConnection,
                connectionState: this.rtcPeerConnection.connectionState
            }));
            this.rtcPeerConnection.onconnectionstatechange = null;
        }
    }
    async onConnectionHandshakeIn(data) {
        try {
            let payload = data.payload;
            if (payload.sdp) {
                await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(payload));
                this.pendingCandidates.forEach(candidate => {
                    this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                });
                this.pendingCandidates.splice(0, this.pendingCandidates.length);
                if (this.rtcPeerConnection.remoteDescription?.type === 'offer') {
                    let answer = await this.rtcPeerConnection.createAnswer();
                    await this.rtcPeerConnection.setLocalDescription(answer);
                    this.internalEvents.dispatchEvent(EventFactory[Events.CONNECTION_HANDSHAKE_OUT]({
                        connectionId: data.connectionId,
                        //@ts-ignore
                        payload: answer.toJSON()
                    }));
                }
            }
            else {
                if (this.rtcPeerConnection.remoteDescription && this.rtcPeerConnection.remoteDescription.type) {
                    this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(payload));
                }
                else {
                    this.pendingCandidates.push(new RTCIceCandidate(payload));
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    send(data) {
        let buffers = encodeStreamData(data, this.config.webrtcFileChunkByteLength);
        if (this.rtcDataChannel) {
            let _buffers = this.buffers;
            Array.prototype.push.apply(_buffers, buffers);
            this.processBuffers(_buffers);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViUlRDQ29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9XZWJSVEMvV2ViUlRDQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN2QyxPQUFPLEVBQXFGLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxTQUFTLENBQUE7QUFDaEksT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGtCQUFrQixDQUFBO0FBRWhELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQTtBQUVwQixTQUFTLGdCQUFnQixDQUFDLElBQVMsRUFBRSxVQUFrQjtJQUNuRCxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDOUIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUMvQyxJQUFJLE9BQU8sR0FBa0IsRUFBRSxDQUFBO0lBQy9CLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQTtJQUNsQixJQUFJLElBQUksR0FBRyxZQUFZLEVBQUUsQ0FBQTtJQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDN0IsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ25CLGVBQWUsRUFBRSxXQUFXLENBQUMsVUFBVTtZQUN2QyxVQUFVO1lBQ1YsSUFBSTtZQUNKLElBQUksRUFBRSxDQUFDO1lBQ1AsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNO1lBQ3hCLElBQUksRUFBRSxTQUFTO1NBQ0wsQ0FBQyxDQUFBO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN2QixVQUFVLElB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