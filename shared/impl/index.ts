import { DemoEntity } from "../types/Demo";

export class DemoImpl implements Omit<DemoEntity, "create_time" | "update_time" | "delete_time"> {
    id: string;
    name: string;

    constructor(entity: DemoEntity) {
        this.id = entity.id;
        this.name = entity.name;
    }
}
