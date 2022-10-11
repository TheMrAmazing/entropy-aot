import { RemoteObject } from "../types";
import { Controller } from "./Controller";
export declare function objectProxy<T extends RemoteObject>(controller: Controller): ProxyHandler<T>;
