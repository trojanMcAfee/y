import { elizaLogger, Client, IAgentRuntime, Plugin, Service, ServiceType } from "@elizaos/core";
import { marketDataProvider } from "./providers/marketData";


export { marketDataProvider } from "./providers/marketData";

export const analystPlugin: Plugin = {
    name: "analyst",
    description: "Plugin for getting the OHLC data of a market",
    services: [],
    actions: [],
    evaluators: [],
    providers: [marketDataProvider],
};

