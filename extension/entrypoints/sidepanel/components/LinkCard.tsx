import React from 'react';
import { Link as LinkIcon, MoreVertical, Pencil } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface LinkCardProps {
  title?: string | null;
  url: string;
  description?: string | null;
  faviconUrl?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function LinkCard({
  title,
  url,
  description,
  faviconUrl,
  onEdit,
  onDelete,
}: LinkCardProps) {
  const displayTitle = title?.trim() || url;
  const displaySubtitle = description?.trim() || url;

  const handleOpen = () => {
    const targetUrl = ensureUrl(url);
    if (!targetUrl) return;

    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: targetUrl });
      return;
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group w-full flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
      onClick={handleOpen}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden max-w-full">
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded object-cover bg-gray-100"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            <LinkIcon size={16} />
          </div>
        )}

        <div className="flex min-w-0 flex-col overflow-hidden max-w-full">
          <span className="text-sm font-medium truncate">{displayTitle}</span>
          <span className="text-xs text-muted-foreground truncate max-w-60">{displaySubtitle}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.();
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
            className="text-destructive"
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ensureUrl(value: string) {
  const trimmed = value?.trim();
  if (!trimmed) return '';

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}
