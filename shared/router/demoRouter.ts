import { DemoImpl } from "../impl";
import { BaseRouterInstance, BaseWebsocketInstance, } from "../lib/decorator";

export class DemoRouterInstance extends BaseRouterInstance {
    base = "/api";
    prefix = "/demo";
    router = [
        {
            name: "queryDemo",
            path: "/list",
            method: "get",
            handler: Function
        },
    ]

    queryDemo: (query: DemoListQuery) => Promise<DemoListResponse>

    constructor(inject: Function, functions?: {
        queryDemo: (query: DemoListQuery) => Promise<DemoListResponse>,
    }){ super(); inject(this, functions); }
}

export class DemoWebsocketInstance extends BaseWebsocketInstance {
    methods = [
        {
            name: "queryDemo",
            type: "continuous",
            handler: Function
        }
    ];
    queryDemo: (query: DemoListQuery) => Promise<string>;
    constructor(inject: Function, functions?: {
        queryDemo: (query: DemoListQuery) => Promise<DemoListResponse>,
    }) { super(); inject(this, functions); }
}

export interface DemoListQuery {
    name: string;
}

export interface DemoListResponse {
    list: DemoImpl[];
}