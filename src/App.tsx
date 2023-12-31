import { Github, Wand2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import ThemeButton from './components/ui/themeButton';
import { ThemeProvider } from './hooks/useTheme';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Slider } from './components/ui/slider';
import { useState } from 'react';
import VideoInputForm from './components/VideoInputForm';
import { PromptSelect } from './components/PromptSelect';
import { useCompletion } from 'ai/react';

function App() {
  const [temperature, setTemperature] = useState<number>(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return (
    <ThemeProvider>
      <div className='min-h-screen flex flex-col'>
        <div className='px-6 py-3 flex items-center justify-between border-b shadow-md'>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl font-bold'>upload.ai</h1>
            <Separator
              orientation='vertical'
              className='h-6'
            />
            <ThemeButton />
          </div>

          <div className='flex items-center gap-3'>
            <span className='text-sm text-muted-foreground'>Desenvolvido com 💜 no NLW IA da Rocketseat</span>
            <Separator
              orientation='vertical'
              className='h-6'
            />

            <Button
              variant='outline'
              asChild
            >
              <a
                href='https://github.com/mattpsvreis/nlw-ia-web'
                target='_blank'
                rel='noreferrer'
              >
                <Github className='w-5 h-5 mr-2' />
                <span>Github</span>
              </a>
            </Button>
          </div>
        </div>

        <main className='flex-1 p-6 flex gap-6'>
          <div className='flex flex-col flex-1 gap-4'>
            <div className='grid grid-rows-2 gap-4 flex-1'>
              <Textarea
                className='resize-none p-4 leading-relaxed'
                placeholder='Inclua o prompt para a IA...'
                value={input}
                onChange={handleInputChange}
              />
              <Textarea
                className='resize-none p-4 leading-relaxed'
                placeholder='Resultado gerado pela IA...'
                value={completion}
                readOnly
              />
            </div>
          </div>

          <aside className='w-80 space-y-6'>
            <VideoInputForm onVideoUploaded={setVideoId} />

            <Separator />

            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              <div className='space-y-2'>
                <Label>Prompt</Label>
                <PromptSelect onPromptSelected={setInput} />
              </div>

              <div className='space-y-2'>
                <Label>Modelo</Label>
                <Select
                  defaultValue='gpt3.5'
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='gpt3.5'>GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>
                <span className='block text-xs text-muted-foreground italic'>Você poderá customizar essa opção em breve.</span>
              </div>

              <Separator />

              <div className='space-y-4'>
                <Label className='flex items-center justify-between'>
                  <span>Temperatura</span>
                  <span className='text-muted-foreground'>{temperature}</span>
                </Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <span className='block text-xs text-muted-foreground italic'>
                  Valores mais altos tendem a deixar o resultado mais criativo porém menos precisos.
                </span>
              </div>

              <Separator />

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading}
              >
                Executar
                <Wand2 className='w-4 h-4 ml-2' />
              </Button>
            </form>
          </aside>
        </main>

        <footer className='flex-1 px-6 pb-6 flex gap-6 items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Lembre-se: Você pode utilizar a variável <code className='text-violet-400'>{`{transcription}`}</code> no seu prompt para adicionar o conteúdo da
            transcrição do vídeo selecionado.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
