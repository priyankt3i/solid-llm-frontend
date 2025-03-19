import { Message, ChatConfig } from '../types';
import { config } from '../config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(config.api.geminiApiKey);
const model = genAI.getGenerativeModel({ model: config.defaultModel });

export async function* sendMessage(
  messages: Message[],
  chatConfig: ChatConfig
): AsyncGenerator<string> {
  try {
    const chat = model.startChat({
      history: messages.map(({ role, content }) => ({
        role: role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }],
      })),
      generationConfig: {
        maxOutputTokens: chatConfig.maxTokens,
        temperature: chatConfig.temperature,
        topP: chatConfig.topP,
      },
    });

    const result = await chat.sendMessageStream(messages[messages.length - 1].content);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}
