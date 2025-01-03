import { Provider, IAgentRuntime, elizaLogger, Memory, State } from "@elizaos/core";

export const marketDataProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory, state: State) => {
        if (!runtime.fetch) {
            throw new Error("Fetch is not available in the runtime");
        }

        const params = {
            endpoint: "https://api.kraken.com/0/public/OHLC?pair=EURUSD&interval=1440",
            method: "GET",
            body: false
        };

        let response: Response;

        try {
            response = await runtime.fetch(params.endpoint, {
                method: params.method || "GET",
            headers: {
                "Content-Type": "application/json",
            },
                body: params.body ? JSON.stringify(params.body) : undefined,
            });
        } catch (error) {
            elizaLogger.error('Error fetching market data:', error);
            throw error;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()).result.ZEURZUSD.map((item: any) => [
            item[0],
            item[5] //vwap price
        ]);

        elizaLogger.log('Market Data Provider Response:', data);

        return JSON.stringify(data);
    }
};