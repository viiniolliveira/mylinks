import React from 'react';
import { LogOut, Settings } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { ThemeButton } from './theme-button';

interface LinksHeaderProps {
  onLogout: () => void;
}

export function LinksHeader({ onLogout }: LinksHeaderProps) {
  return (
    <header className="px-4 py-3 border-b flex justify-between items-center bg-background z-10">
      <h1 className="text-xl font-semibold">Meus Links</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <ThemeButton />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
