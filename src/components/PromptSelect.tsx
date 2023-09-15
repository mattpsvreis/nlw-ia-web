import { api } from '@/lib/axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { useState, useEffect } from 'react';

interface Prompt {
  id: string;
  title: string;
  template: string;
}

export function PromptSelect() {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  useEffect(() => {
    api.get('/prompts').then((response) => {
      setPrompts(response.data);
    });
  }, []);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder='Selecione um prompt...' />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => {
          return (
            <SelectItem
              key={prompt.id}
              value={prompt.id}
            >
              {prompt.title}
            </SelectItem>
          );
        })}
        <SelectItem
          value='extras'
          disabled
        >
          Em breve mais opções..
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
