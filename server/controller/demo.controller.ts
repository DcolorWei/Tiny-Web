import { DemoImpl } from "../../shared/impl";
import { DemoListQuery, DemoListResponse, DemoRouterInstance } from "../../shared/router/demoRouter";
import { inject, injectws } from "../lib/inject";
import { getDemoByDemo } from "../service/demo.service";

async function queryDemo(query: DemoListQuery): Promise<DemoListResponse> {
    const list: Array<DemoImpl> = [];
    list.push(...(await getDemoByDemo()));
    const result: DemoListResponse = {
        success: true,
        data: { list },
    };
    return result;
}

export const demoController = new DemoRouterInstance(inject, { queryDemo });
