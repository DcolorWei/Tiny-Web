import { DemoRouterInstance, DemoWebsocketInstance } from "../../shared/router/demoRouter";
import { inject, injectws } from "../lib/inject";

export const DemoRouter = new DemoRouterInstance(inject);
export const DemoWebsocket = new DemoWebsocketInstance(injectws);