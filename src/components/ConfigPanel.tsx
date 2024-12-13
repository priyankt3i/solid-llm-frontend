import { ChatConfig } from '../types';
import { config } from '../config';

interface ConfigPanelProps {
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
}

export default function ConfigPanel(props: ConfigPanelProps) {
  const handleNumberChange = (key: keyof ChatConfig, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      props.onConfigChange({
        ...props.config,
        [key]: numValue
      });
    }
  };

  return (
    <div class="w-64 bg-white p-4 rounded-lg shadow-lg space-y-4">
      <h2 class="text-lg font-semibold mb-4">Configuration</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={props.config.model}
            onChange={(e) => props.onConfigChange({
              ...props.config,
              model: e.currentTarget.value
            })}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {config.models.map((model) => (
              <option value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Max Tokens</label>
          <input
            type="number"
            value={props.config.maxTokens}
            onChange={(e) => handleNumberChange('maxTokens', e.currentTarget.value)}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
            max="4096"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Temperature</label>
          <input
            type="number"
            value={props.config.temperature}
            onChange={(e) => handleNumberChange('temperature', e.currentTarget.value)}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            max="2"
            step="0.1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Top P</label>
          <input
            type="number"
            value={props.config.topP}
            onChange={(e) => handleNumberChange('topP', e.currentTarget.value)}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            max="1"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
