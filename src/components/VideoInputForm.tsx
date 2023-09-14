import { FileVideo, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { ChangeEvent, useState, Fragment, useMemo } from 'react';

export default function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    setVideoFile(files.item(0));
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className='space-y-6'>
      <label
        htmlFor='video'
        className='relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/30'
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className='pointer-events-none absolute inset-0'
          />
        ) : (
          <Fragment>
            <FileVideo className='w-4 h-4' />
            Selecione um vídeo
          </Fragment>
        )}
      </label>
      <input
        type='file'
        id='video'
        accept='video/mp4'
        className='sr-only'
        onChange={handleFileSelected}
      />

      <Separator />

      <div className='space-y-2'>
        <Label htmlFor='transcriptionPrompt'>Prompt de transcrição</Label>
        <Textarea
          id='transcriptionPrompt'
          className='h-20 leading-relaxed resize-none'
          placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,).'
        />
      </div>

      <Button
        type='submit'
        className='w-full'
      >
        Processar vídeo
        <Upload className='w-4 h-4 ml-2' />
      </Button>
    </form>
  );
}
