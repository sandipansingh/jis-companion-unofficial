import { Text } from 'react-native';

interface LegalTextProps {
  children: string;
  variant?: 'body' | 'description' | 'bullet';
}

export function LegalText({ children, variant = 'body' }: LegalTextProps) {
  const baseClasses =
    'text-[15px] leading-[22px] text-ink-800 dark:text-ink-200 font-sans';
  const bulletClasses = 'pl-1.5';

  return (
    <Text className={`${baseClasses} ${variant === 'bullet' ? bulletClasses : ''}`}>
      {children}
    </Text>
  );
}
