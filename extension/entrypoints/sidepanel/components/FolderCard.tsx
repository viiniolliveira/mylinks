import React from 'react';
import { ChevronRight, Folder, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface FolderCardProps {
  title: string;
  count?: number | null;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FolderCard({
  title,
  count,
  onOpen,
  onEdit,
  onDelete,
}: FolderCardProps) {
  return (
    <div className="group flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors">
      <div className="flex items-center gap-3 overflow-hidden" onClick={onOpen}>
        <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center text-amber-600">
          <Folder size={18} fill="currentColor" className="opacity-80" />
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate">{title}</span>
          <span className="text-xs text-muted-foreground">
            {typeof count === 'number' ? `${count} items` : 'Pasta'}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400"
          onClick={onOpen}
        >
          <ChevronRight size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
