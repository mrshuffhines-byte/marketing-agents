import OpenAI from 'openai';
import { Message, ToolDefinition, ToolCall, OpenAIResponse } from './types';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

export async function callOpenAIWithTools(
  systemPrompt: string,
  messages: Message[],
  tools: ToolDefinition[],
  model: string = 'gpt-4o'
): Promise<OpenAIResponse> {
  const formattedMessages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => {
      if (msg.role === 'tool') {
        return {
          role: 'tool' as const,
          content: msg.content || '',
          tool_call_id: msg.tool_call_id!
        };
      }
      if (msg.tool_calls) {
        return {
          role: 'assistant' as const,
          content: msg.content,
          tool_calls: msg.tool_calls.map(tc => ({
            id: tc.id,
            type: 'function' as const,
            function: tc.function
          }))
        };
      }
      return {
        role: msg.role as 'user' | 'assistant',
        content: msg.content || ''
      };
    })
  ];

  const response = await getOpenAI().chat.completions.create({
    model,
    messages: formattedMessages,
    tools: tools.length > 0 ? tools : undefined,
    tool_choice: tools.length > 0 ? 'auto' : undefined
  });

  const choice = response.choices[0];

  return {
    content: choice.message.content,
    toolCalls: choice.message.tool_calls?.map(tc => ({
      id: tc.id,
      type: tc.type,
      function: {
        name: tc.function.name,
        arguments: tc.function.arguments
      }
    })),
    finishReason: choice.finish_reason || 'stop'
  };
}

export async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  model: string = 'gpt-4o'
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  });

  return response.choices[0].message.content || '';
}
