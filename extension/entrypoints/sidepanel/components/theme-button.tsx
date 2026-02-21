import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { DropdownMenuItem } from '../../../components/ui/dropdown-menu';
import { useTheme } from '../../../components/ui/theme-provider';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const label = isDark ? 'Light' : 'Dark';

  return (
    <DropdownMenuItem onSelect={() => setTheme(nextTheme)} className="gap-2">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {label}
    </DropdownMenuItem>
  );
}
