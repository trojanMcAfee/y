import { elizaLogger, Client, IAgentRuntime, Plugin, Service, ServiceType } from "@elizaos/core";
import { continueAction } from "./actions/continue.ts";
import { followRoomAction } from "./actions/followRoom.ts";
import { ignoreAction } from "./actions/ignore.ts";
import { muteRoomAction } from "./actions/muteRoom.ts";
import { noneAction } from "./actions/none.ts";
import { unfollowRoomAction } from "./actions/unfollowRoom.ts";
import { unmuteRoomAction } from "./actions/unmuteRoom.ts";
import { factEvaluator } from "./evaluators/fact.ts";
import { goalEvaluator } from "./evaluators/goal.ts";
import { boredomProvider } from "./providers/boredom.ts";
import { factsProvider } from "./providers/facts.ts";
import { timeProvider } from "./providers/time.ts";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export interface IDirectService extends Service {
    makeRequest(endpoint: string, method: string, body?: any): Promise<any>;
    isConnected(): boolean;
}

export class DirectService extends Service implements IDirectService {
    private connected: boolean = false;
    private baseUrl: string;

    constructor() {
        super(ServiceType.DIRECT);
    }

    async initialize(runtime: IAgentRuntime): Promise<void> {
        this.baseUrl = runtime.getSetting("DIRECT_SERVICE_URL") || "http://localhost:3000";
        this.connected = true;
        elizaLogger.success("Direct Service initialized");
    }

    async makeRequest(endpoint: string, method: string = "GET", body?: any): Promise<any> {
        if (!this.connected) {
            throw new Error("Direct Service is not connected");
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            elizaLogger.error("Direct Service request failed:", error);
            throw error;
        }
    }

    isConnected(): boolean {
        return this.connected;
    }

    getInstance(): IDirectService {
        return this;
    }
}

// Create a custom action to make requests
const makeRequestAction = {
    name: "make_request",
    description: "Make an HTTP request to a specified endpoint",
    parameters: {
        type: "object",
        properties: {
            endpoint: {
                type: "string",
                description: "The endpoint to make the request to",
            },
            method: {
                type: "string",
                enum: ["GET", "POST", "PUT", "DELETE"],
                default: "GET",
            },
            body: {
                type: "object",
                description: "The request body (optional)",
            },
        },
        required: ["endpoint"],
    },
    handler: async (runtime: IAgentRuntime, params: any) => {
        const directService = runtime.getService(ServiceType.DIRECT) as IDirectService;
        return await directService.makeRequest(params.endpoint, params.method, params.body);
    },
};

export const directPlugin: Plugin = {
    name: "direct",
    description: "Plugin for making HTTP requests to external endpoints",
    services: [new DirectService()],
    actions: [makeRequestAction],
    evaluators: [],
    providers: [],
};

export default directPlugin;
