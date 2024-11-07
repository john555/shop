import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function ValidatedInput({ name, ...props }: ValidatedInputProps) {
  const { register, trigger } = useFormContext();
  return <Input {...register(name)} {...props} onBlur={() => trigger(name)} />;
}
