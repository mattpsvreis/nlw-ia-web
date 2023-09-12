import { Github } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import ThemeButton from './components/ui/themeButton';
import { ThemeProvider } from './lib/hooks/useTheme';

function App() {
  return (
    <ThemeProvider>
      <div className='min-h-screen flex flex-col'>
        <div className='px-6 py-3 flex items-center justify-between border-b'>
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

            <Button variant='outline'>
              <Github className='w-5 h-5 mr-2' />
              <span>Github</span>
            </Button>
          </div>
        </div>

        <main className='flex-1 p-6 flex gap-6'>
          <div className='flex flex-col flex-1 gap-4'>
            <div className='grid grid-rows-2 gap-4 flex-1'>
              <Textarea
                className='resize-none p-4 leading-relaxed'
                placeholder='Inclua o prompt para a IA...'
              />
              <Textarea
                placeholder='Resultado gerado pela IA...'
                readOnly
              />
            </div>
            <p className='text-sm text-muted-foreground'>
              Lembre-se: Você pode utilizar a variável <code className='text-violet-400'>{`{transcription}`}</code> no seu prompt para adicionar o conteúdo da
              transcrição do vídeo selecionado.
            </p>
          </div>

          <aside className='w-80 space-y-6'>
            <form className='space-y-6'>
              <label htmlFor='video'>Carregar vídeo</label>
              <input
                type='file'
                id='video'
                accept='video/mp4'
              />
            </form>
          </aside>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
