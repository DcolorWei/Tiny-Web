import { DemoEntity } from "../types/Demo";

export interface DemoImpl extends Pick<DemoEntity, "name"> { }
