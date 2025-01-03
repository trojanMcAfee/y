import { Client, Content, IAgentRuntime, elizaLogger } from "@elizaos/core";

const embeddedTerm = 'Figure Charts (Point-and-Figure), Wave Charts';

const runCallback = async (runtime: IAgentRuntime) => {
    elizaLogger.log("running auto client...");

    const content: Content = {
        text: embeddedTerm,
        attachments: [],
        source: "auto",
        inReplyTo: undefined,
    };

    try {
        const response = await fetch(`http://localhost:${process.env.SERVER_PORT || 3000}/${runtime.agentId}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: content.text,
                userId: 'auto-user',
                roomId: 'auto-room',
                userName: 'AutoClient'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        elizaLogger.log('Auto message response:', data);
    } catch (error) {
        elizaLogger.error('Error sending auto message:', error);
    }
};

export class AutoClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;

        runCallback(runtime);

        // start a loop that runs every x seconds
        this.interval = setInterval(
            async () => {
                runCallback(runtime);
            },
            60 * 60 * 1000
        ); // 1 hour in milliseconds
    }
}

export const AutoClientInterface: Client = {
    start: async (runtime: IAgentRuntime) => {
        const client = new AutoClient(runtime);
        return client;
    },
    stop: async (_runtime: IAgentRuntime) => {
        console.warn("Direct client does not support stopping yet");
    },
};

export default AutoClientInterface;
