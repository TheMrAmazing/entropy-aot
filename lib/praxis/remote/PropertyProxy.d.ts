import { RemoteProperty } from "../types";
import { Controller } from "./Controller";
export declare function propertyProxy<T extends RemoteProperty>(controller: Controller): ProxyHandler<T>;
