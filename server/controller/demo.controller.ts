import { DemoImpl } from "../../shared/impl";
import { DemoListQuery, DemoListResponse, DemoRouterInstance, DemoWebsocketInstance } from "../../shared/router/demoRouter";
import { inject, injectws } from "../lib/inject";
import { getDemoByDemo, getDemoList } from "../service/demo.service";

async function queryDemo(query: DemoListQuery): Promise<DemoListResponse> {
    const list: Array<DemoImpl> = [];
    list.push(...await getDemoByDemo());
    const result: DemoListResponse = {
        list: list
    }
    return result;
}


export const demoController = new DemoRouterInstance(inject, { queryDemo });
export const demoWSController = new DemoWebsocketInstance(injectws, { queryDemo });