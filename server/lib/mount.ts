import { Express, Request, Response } from "express";
import { BaseRouterInstance, BaseWebsocketInstance, WSMessage } from "../../shared/lib/decorator";
import { Server } from "ws";
import { WebSocketServerService } from "./webscoket";

export function mounthttp(expressApp: Express, controllers: BaseRouterInstance[]) {
    const interfaceList: Array<{ base: string, prefix: string, path: string, method: string }> = [];
    for (const controller of controllers) {
        console.log(`Controller ${controller.prefix} is registering with ${controller.router.length} routes.`);
        const { base, prefix, router } = controller;
        for (const item of router) {
            const { path, method, handler } = item;
            if (interfaceList.some(item => item.prefix === prefix && item.path === path && item.method === method)) {
                throw new Error(`Duplicate route found: ${prefix}${path} with method ${method}`);
            } else {
                interfaceList.push({ base, prefix, path, method });
            }
            if (!handler || typeof handler !== "function") {
                throw new Error(`Handler method "${method}" for route ${prefix}${path} is not valid.`);
            }
            if (!(method === "get" || method === "post" || method === "put" || method === "delete")) {
                throw new Error(`Invalid method ${method} for route ${prefix}${path}. Supported methods are: get, post, put, delete.`);
            }
            expressApp[method](`${base}${prefix}${path}`, async (req: Request, res: Response) => {
                switch (method) {
                    case "get":
                        res.send(await handler(req.query));
                        break;
                    case "post":
                        res.send(await handler(req.body));
                        break;
                }
            });
        }
    }
}

export function mountws(wss: Server, controllers: BaseWebsocketInstance[]) {
    const wsService = WebSocketServerService.getInstance();

    const allMethods = controllers.flatMap(controller => controller.methods);
    if (new Set(allMethods.map(method => method.name)).size !== allMethods.length) {
        throw new Error("There are duplicate method names in the controller.");
    } else {
        allMethods.forEach(method => {
            console.log(`Websocket [${method.name}] is registering.`);
        });
    }
    wss.on('connection', ws => {
        const clientId = wsService.addClient(ws);
        console.log(`Client ${clientId} connected.`);
        ws.on('message', async message => {
            const msg: WSMessage = JSON.parse(message.toString());
            const { name, payload } = msg;
            const { handler, type } = allMethods.find(method => method.name === name)!;
            if (!handler) {
                const result = JSON.stringify({ success: false, error: "Method not found." });
                wsService.sendMessage(clientId, result);
            } else if (type === "single") {
                const result = JSON.stringify({ success: true, name, data: await handler(payload) });
                wsService.sendMessage(clientId, result);
            } else if (type === "continuous") {
                const result = JSON.stringify({ success: true, name, data: await handler(payload) });
                wsService.sendMessage(clientId, result);
                wsService.listenEvent(clientId, name, handler, payload);
            }
        });
    });
}