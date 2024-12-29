import { Provider, IAgentRuntime, elizaLogger } from "@elizaos/core";

export const marketDataProvider: Provider = {
    get: async (runtime: IAgentRuntime, params: any) => {
        if (!runtime.fetch) {
            throw new Error("Fetch is not available in the runtime");
        }

        const response = await runtime.fetch(params.endpoint, {
            method: params.method || "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: params.body ? JSON.stringify(params.body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        elizaLogger.info('Market Data Provider Response:', data);
        return data;
    }
};