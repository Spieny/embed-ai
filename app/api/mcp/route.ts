import { google } from '@ai-sdk/google';
import { experimental_createMCPClient as createMCPClient, smoothStream, streamText } from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // custom transport, in this case using HTTP:
  // Fetch MCP Server
  const fetchTransport = new StreamableHTTPClientTransport(
    new URL('https://remote.mcpservers.org/fetch/mcp'),
  );
  const fetchClient = await createMCPClient({
    transport: fetchTransport
  });

  const fetchTools = await fetchClient.tools();

  // Sequential Thinking MCP Server
  const sequentialThinkingTransport = new StreamableHTTPClientTransport(
    new URL('https://remote.mcpservers.org/sequentialthinking/mcp'),
  );
  const sequentialThinkingClient = await createMCPClient({
    transport: sequentialThinkingTransport,
  });

  const sequentialThinkingTools = await sequentialThinkingClient.tools();

  // EdgeOne Pages MCP Server
  const edgeOneTransport = new StreamableHTTPClientTransport(
    new URL('https://mcp-on-edge.edgeone.site/mcp-server'),
  );
  const edgeOneClient = await createMCPClient({
    transport: edgeOneTransport,
  });

  const edgeOneTools = await edgeOneClient.tools();

  // example prompt to test the agent capabilities:
  // i'm trying to build a news portal web that contains at least a home page, a page for showing news for each categories, and a page detail of the news. this news portal is for the province government.

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: `
        You are an agent specialized in web content fetch and HTML generation.
        You are capable of providing web content fetching capabilities, which means you can retrieve and process content from web pages, converting HTML to markdown for easier consumption.
        You are also capable of generating and deploying HTML content to EdgeOne Pages and obtaining an accessible public URL.
        You are allowed to ask for more information about the requirements for the web by using your sequential thinking.
    `,
    messages,
    maxSteps: 10,
    experimental_transform: smoothStream(),
    tools: {
        ...fetchTools,
        ...sequentialThinkingTools,
        ...edgeOneTools
    },
    onFinish: async () => {
        await edgeOneClient.close();
    },
    onError: async () => {
        await edgeOneClient.close();
    }
  });

  return result.toDataStreamResponse();
}
