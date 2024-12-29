import { elizaLogger, Client, IAgentRuntime, Plugin, Service, ServiceType } from "@elizaos/core";
import { marketDataProvider } from "./providers";

// export * as providers from "./providers";


export const analystPlugin: Plugin = {
    name: "analyst",
    description: "Plugin for making HTTP requests to external endpoints",
    services: [],
    actions: [],
    evaluators: [],
    providers: [marketDataProvider],
};

