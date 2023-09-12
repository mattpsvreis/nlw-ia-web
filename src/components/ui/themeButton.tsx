import { useTheme } from '@/hooks/useTheme';
import { Button } from './button';
import { Moon, Sun } from 'lucide-react';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      title='Tema'
      variant='outline'
      className='flex w-10 p-0'
      onClick={toggleTheme}
    >
      {theme === 'light' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
    </Button>
  );
};

export default ThemeButton;
