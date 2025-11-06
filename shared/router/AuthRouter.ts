import { BaseRequest, BaseResponse, BaseRouterInstance } from "../lib/decorator";

export class AuthRouterInstance extends BaseRouterInstance {
    base = "/api";
    prefix = "/auth";
    router = [
        {
            name: "login",
            path: "/login",
            method: "post",
            handler: Function,
        },
        {
            name: "register",
            path: "/register",
            method: "post",
            handler: Function,
        },
    ];

    alive: (request: AliveRequest) => Promise<AliveResponse>;
    login: (request: AuthBody) => Promise<LoginResult>;
    register: (request: AuthBody) => Promise<RegisterResult>;

    constructor(
        inject: Function,
        functions?: {
            alive: (request: AliveRequest) => Promise<AliveResponse>;
            login: (request: AuthBody) => Promise<LoginResult>;
            register: (request: AuthBody) => Promise<RegisterResult>;
        }
    ) {
        super();
        inject(this, functions);
    }
}

export interface AuthBody {
    name?: string;
    email?: string;
    password?: string;
}

export interface AliveRequest extends BaseRequest {}

export interface AliveResponse extends BaseResponse {}

export interface LoginResult extends BaseResponse {
    data?: {
        token: string;
    };
}

export interface RegisterResult extends BaseResponse {}
