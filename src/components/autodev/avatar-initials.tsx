'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarInitialsProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  level?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
} as const;

const levelColorMap: Record<string, string> = {
  principiante: 'bg-gray-700',
  intermedio: 'bg-blue-700',
  avanzado: 'bg-purple-700',
  admin: 'bg-red-700',
  moderador: 'bg-amber-700',
};

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function AvatarInitials({
  name,
  avatarUrl,
  size = 'md',
  level,
  className,
}: AvatarInitialsProps) {
  const initials = getInitials(name);
  const sizeClass = sizeMap[size];
  const levelColor = level ? levelColorMap[level] : 'bg-slate-700';

  return (
    <Avatar className={cn(sizeClass, className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback
        className={cn(
          'font-semibold text-white uppercase select-none',
          levelColor
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}