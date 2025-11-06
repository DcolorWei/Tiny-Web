import { AuthRouterInstance } from "../../shared/router/AuthRouter";
import { DemoRouterInstance } from "../../shared/router/DemoRouter";
import { inject } from "../lib/inject";

export const AuthRouter = new AuthRouterInstance(inject);
export const DemoRouter = new DemoRouterInstance(inject);
