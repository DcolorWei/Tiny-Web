import { DemoImpl } from "../impl";
import { BaseRequest, BaseResponse, BaseRouterInstance } from "../lib/decorator";

export class DemoRouterInstance extends BaseRouterInstance {
    base = "/api";
    prefix = "/demo";
    router = [
        {
            name: "queryDemo",
            path: "/list",
            method: "get",
            handler: Function,
        },
    ];

    queryDemo: (query: DemoListQuery) => Promise<DemoListResponse>;

    constructor(
        inject: Function,
        functions?: {
            queryDemo: (query: DemoListQuery) => Promise<DemoListResponse>;
        }
    ) {
        super();
        inject(this, functions);
    }
}

export interface DemoListQuery extends BaseRequest {
    name: string;
}

export interface DemoListResponse extends BaseResponse {
    data: {
        list: DemoImpl[];
    };
}
