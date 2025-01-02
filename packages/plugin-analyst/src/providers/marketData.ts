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

        const data = (await response.json()).result.EURUSD.map((item: any) => ({
            timestamp: new Date(item[0] * 1000).toISOString(),
            price: item[5] // VWAP price
        }));

        elizaLogger.log('Market Data Provider Response:', data);

        state.responseData = {
            text: 'responseData from market data provider',
            url: params.endpoint,
            marketData: data,
            timestamp: new Date().toISOString()
        };
        return data;
    }
};