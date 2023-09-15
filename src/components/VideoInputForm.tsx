import { FileVideo, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { ChangeEvent, useState, Fragment, useMemo, FormEvent, useRef } from 'react';
import { loadFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/axios';

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success' | 'error';

const uploadStatusMessages = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Uploading...',
  success: 'Sucesso!',
  error: 'Ocorreu um erro!',
};

export default function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Status>('waiting');

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    setVideoFile(files.item(0));
  }

  async function convertVideoToAudio(video: File) {
    console.log('Converting..');

    const ffmpeg = await loadFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video));

    // # DEBUG CODE
    // ffmpeg.on('log', (log) => {
    //   console.log(log);
    // });

    ffmpeg.on('progress', (progress) => {
      console.log('Conversion progress: ' + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec(['-i', 'input.mp4', '-map', '0:a', '-b:a', '20k', '-acodec', 'libmp3lame', 'output.mp3']);

    const audioFileData = await ffmpeg.readFile('output.mp3');
    const audioFileBlob = new Blob([audioFileData], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' });

    console.log('Converting finished.');

    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setUploadStatus('converting');

    const audioFile = await convertVideoToAudio(videoFile);

    setUploadStatus('uploading');

    const formData = new FormData();

    formData.append('file', audioFile);

    const response = await api.post('/videos', formData);

    const videoId = response.data.video.id;

    console.log('Generating transcription..');

    setUploadStatus('generating');

    await api.post(`/videos/${videoId}/transcription`, { prompt });

    console.log('Transcription generated.');

    setUploadStatus('success');
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form
      onSubmit={handleUploadVideo}
      className='space-y-6'
    >
      <label
        htmlFor='video'
        className='border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/30'
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className='pointer-events-none'
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
          ref={promptInputRef}
          id='transcriptionPrompt'
          className='h-20 leading-relaxed resize-none'
          placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,).'
          disabled={uploadStatus !== 'waiting'}
        />
      </div>

      <Button
        data-success={uploadStatus === 'success'}
        type='submit'
        className='w-full data-[success=true]:bg-emerald-600'
        disabled={uploadStatus !== 'waiting'}
      >
        {uploadStatus === 'waiting' ? (
          <Fragment>
            Processar vídeo
            <Upload className='w-4 h-4 ml-2' />
          </Fragment>
        ) : (
          uploadStatusMessages[uploadStatus]
        )}
      </Button>
    </form>
  );
}
