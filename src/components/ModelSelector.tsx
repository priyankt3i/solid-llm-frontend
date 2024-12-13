import { config } from '../config';

export default function ModelSelector(props: { 
  selectedModel: string;
  onModelChange: (model: string) => void;
}) {
  return (
    <div class="absolute top-4 right-4">
      <select
        value={props.selectedModel}
        onChange={(e) => props.onModelChange(e.currentTarget.value)}
        class="p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {config.models.map((model) => (
          <option value={model}>{model}</option>
        ))}
      </select>
    </div>
  );
}
