import { createSignal, createEffect, For, Show } from 'solid-js';
import { Message, ChatState, ChatConfig } from '../types';
import { config } from '../config';
import { sendMessage } from '../service/api';
import ConfigPanel from './ConfigPanel';
import MarkdownIt from 'markdown-it';

const defaultConfig: ChatConfig = {
  maxTokens: 2048,
  temperature: 0.7,
  topP: 1,
  model: config.defaultModel,
};

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

export default function Chat() {
  const [state, setState] = createSignal<ChatState>({
    messages: [],
    isLoading: false,
    config: defaultConfig
  });
  
  const [input, setInput] = createSignal('');
  const [showConfig, setShowConfig] = createSignal(window.innerWidth > 1024);
  const [editingMessageIndex, setEditingMessageIndex] = createSignal<number | null>(null);

  createEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setShowConfig(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const handleMessageCopy = async (content: string, buttonElement: HTMLButtonElement) => {
    try {
      await navigator.clipboard.writeText(content);
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Copied!';
      setTimeout(() => {
        buttonElement.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = (index: number) => {
    setEditingMessageIndex(index);
  };

  const handleEditSubmit = async (index: number, newContent: string) => {
    if (!newContent.trim()) return;

    // Update the message
    setState(prev => ({
      ...prev,
      messages: prev.messages.map((msg, i) => 
        i === index ? { ...msg, content: newContent } : msg
      )
    }));

    setEditingMessageIndex(null);

    // Get all messages up to and including the edited message
    const messagesUpToEdit = state().messages.slice(0, index + 1);
    
    // Remove all subsequent messages
    setState(prev => ({
      ...prev,
      messages: messagesUpToEdit,
      isLoading: true
    }));

    try {
      const stream = await sendMessage([...messagesUpToEdit], state().config);
      let content = '';
      
      // Create new assistant message
      const assistantMessage: Message = { role: 'assistant', content: '' };
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
      
      for await (const chunk of stream) {
        content += chunk;
        setState(prev => ({
          ...prev,
          messages: prev.messages.map((msg, i) => 
            i === prev.messages.length - 1 
              ? { ...msg, content } 
              : msg
          )
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const userInput = input().trim();
    if (!userInput) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: userInput };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));
    setInput('');

    try {
      const stream = await sendMessage([...state().messages], state().config);
      let content = '';
      
      // Create assistant message when we get the stream
      const assistantMessage: Message = { role: 'assistant', content: '' };
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
      
      for await (const chunk of stream) {
        content += chunk;
        setState(prev => ({
          ...prev,
          messages: prev.messages.map((msg, i) => 
            i === prev.messages.length - 1 
              ? { ...msg, content } 
              : msg
          )
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      messages: []
    }));
  };

  const handleConfigChange = (newConfig: ChatConfig) => {
    setState(prev => ({
      ...prev,
      config: newConfig
    }));
  };

  const toggleConfig = () => {
    setShowConfig(!showConfig());
  };

  return (
    <div class="relative min-h-screen">
      {/* Fixed Settings Button */}
      <button
        onClick={toggleConfig}
        class="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 lg:hidden"
        aria-label="Toggle Settings"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09A1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {/* Main Layout */}
      <div class="fixed inset-0 flex">
        {/* Centered Chat Container */}
        <div class="absolute inset-0 flex justify-center">
          <div class="w-full max-w-3xl h-full flex flex-col p-4">
            <div class="flex-1 overflow-y-auto space-y-4 mb-4">
              <For each={state().messages}>
                {(message, index) => (
                  <div
                    class={`p-4 rounded-lg relative group ${
                      message.role === 'user' 
                        ? 'bg-blue-100 ml-12' 
                        : 'bg-gray-100 mr-12'
                    }`}
                  >
                    <div class="font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <Show
                      when={editingMessageIndex() === index()}
                      fallback={<div class="whitespace-pre-wrap" innerHTML={md.render(message.content).replace(/(```[\s\S]*?```)/g, '<div class="code-block">$1</div>')}></div>}
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const textarea = e.currentTarget.querySelector('textarea');
                          if (textarea) {
                            handleEditSubmit(index(), textarea.value);
                          }
                        }}
                        class="flex flex-col gap-2"
                      >
                        <textarea
                          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={message.content}
                          rows={3}
                        />
                        <div class="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingMessageIndex(null)}
                            class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </Show>

                    {/* Action Buttons */}
                    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => handleMessageCopy(message.content, e.currentTarget)}
                        class="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        Copy
                      </button>
                      <Show when={message.role === 'user' && editingMessageIndex() !== index()}>
                        <button
                          onClick={() => handleEdit(index())}
                          class="px-2 py-1 text-xs bg-blue-200 rounded hover:bg-blue-300 transition-colors"
                        >
                          Edit
                        </button>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
              <Show when={state().isLoading}>
                <div class="bg-gray-100 p-4 rounded-lg mr-12">
                  <div class="font-medium mb-1">Assistant</div>
                  <div class="animate-pulse">...</div>
                </div>
              </Show>
            </div>
            
            {/* Input Area with responsive layout */}
            <div class="flex flex-col gap-2">
              <form onSubmit={handleSubmit} class="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={input()}
                  onInput={(e) => setInput(e.currentTarget.value)}
                  class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  disabled={state().isLoading}
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap"
                >
                  Send
                </button>
              </form>
              <button
                onClick={handleClear}
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>

        {/* Config Panel - Fixed on right side */}
        <div 
          class={`fixed right-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 z-40 ${
            showConfig() ? 'translate-x-0' : 'translate-x-full'
          } lg:block lg:fixed lg:right-0`}
        >
          <ConfigPanel
            config={state().config}
            onConfigChange={handleConfigChange}
          />
        </div>
      </div>
    </div>
  );
}
