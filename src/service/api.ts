import OpenAI from 'openai';
import { Message, ChatConfig } from '../types';
import { config } from '../config';

const openai = new OpenAI({
  baseURL: config.api.baseUrl,
  apiKey: config.api.apiKey,
  dangerouslyAllowBrowser: true
});

export async function* sendMessage(
  messages: Message[],
  chatConfig: ChatConfig
): AsyncGenerator<string> {
  try {
    const stream = await openai.chat.completions.create({
      model: chatConfig.model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
      max_tokens: chatConfig.maxTokens,
      temperature: chatConfig.temperature,
      top_p: chatConfig.topP
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content;
      }
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}
