import { DemoImpl } from "../../shared/impl";
import { DemoEntity } from "../../shared/types/Demo";
import Repository from "../lib/respository";
import { WebSocketServerService } from "../lib/webscoket";

const demoRepository = Repository.instance(DemoEntity);

export async function getDemoList(): Promise<DemoEntity[]> {
    return demoRepository.find();
}

export async function getDemoByDemo(): Promise<Array<DemoImpl>> {
    const demoResult: Array<DemoImpl> = demoRepository.find();
    return demoResult;
}

export async function saveReceivedDemo(items: Array<DemoImpl>): Promise<boolean> {
    const wsService = WebSocketServerService.getInstance();
    const result = demoRepository.insertMany(items);
    wsService.triggerEvent("queryDemo", JSON.stringify(items));
    return result;
}