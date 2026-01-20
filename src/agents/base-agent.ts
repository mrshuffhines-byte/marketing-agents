import { loadSkills } from '../lib/skill-loader';
import { callOpenAIWithTools } from '../lib/openai';
import { ProgressTracker } from '../lib/progress-tracker';
import { AgentConfig, AgentResult, Message, ToolDefinition } from '../lib/types';

export abstract class BaseAgent {
  protected name: string;
  protected description: string;
  protected systemPrompt: string;
  protected tools: ToolDefinition[];
  protected conversationHistory: Message[];
  protected progressTracker: ProgressTracker;

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.description = config.description;
    this.tools = config.tools;
    this.conversationHistory = [];
    this.progressTracker = new ProgressTracker();
    this.systemPrompt = this.buildSystemPrompt(config.skillPaths);
  }

  protected buildSystemPrompt(skillPaths: string[]): string {
    const skillContents = loadSkills(skillPaths);

    return `You are ${this.name}, ${this.description}.

## Your Skills and Knowledge

${skillContents}

## Response Guidelines
- Be specific and actionable
- Use your tools when external data or actions are needed
- Explain your reasoning briefly
- Format output as JSON when returning structured data`;
  }

  abstract run(input: any): Promise<AgentResult>;

  protected async executeWithTools(
    userMessage: string,
    maxIterations: number = 5
  ): Promise<AgentResult> {
    this.conversationHistory.push({ role: 'user', content: userMessage });
    const toolCallsExecuted: string[] = [];
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;
      this.progressTracker.update(`${this.name}: Iteration ${iterations}/${maxIterations}`);

      const response = await callOpenAIWithTools(
        this.systemPrompt,
        this.conversationHistory,
        this.tools
      );

      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const toolCall of response.toolCalls) {
          this.progressTracker.update(`${this.name}: Executing tool: ${toolCall.function.name}`);

          const toolResult = await this.executeToolCall(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );

          toolCallsExecuted.push(toolCall.function.name);

          this.conversationHistory.push({
            role: 'assistant',
            content: null,
            tool_calls: [toolCall]
          });
          this.conversationHistory.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }
      } else {
        return {
          success: true,
          output: response.content,
          toolCallsExecuted,
          reasoning: response.content || undefined
        };
      }
    }

    return {
      success: false,
      output: null,
      toolCallsExecuted,
      error: 'Max iterations reached without completion'
    };
  }

  protected abstract executeToolCall(
    toolName: string,
    args: Record<string, any>
  ): Promise<any>;

  getProgressTracker(): ProgressTracker {
    return this.progressTracker;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}
