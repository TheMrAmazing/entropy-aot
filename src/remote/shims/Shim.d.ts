import { Controller } from "../Controller.js";
import { Receiver } from "../Receiver.js";
import { ControllerMessage, ReceiverMessage } from "../types.js";

declare abstract class Shim {
	remoter: Controller | Receiver
	abstract postMessage(message: ControllerMessage | ReceiverMessage)
}