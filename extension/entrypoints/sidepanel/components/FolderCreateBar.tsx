import React from 'react';
import { Check, Folder, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface FolderCreateBarProps {
  isCreatingFolderInput: boolean;
  newFolderName: string;
  isCreatingFolder: boolean;
  onSubmitCreateFolder: (event: React.SubmitEvent<HTMLFormElement>) => void;
  onCancelCreateFolder: () => void;
  onStartCreateFolder: () => void;
  onChangeNewFolderName: (value: string) => void;
}

export function FolderCreateBar({
  isCreatingFolderInput,
  newFolderName,
  isCreatingFolder,
  onSubmitCreateFolder,
  onCancelCreateFolder,
  onStartCreateFolder,
  onChangeNewFolderName,
}: FolderCreateBarProps) {
  return (
    <div className="p-4 flex items-center justify-between gap-2">
      {isCreatingFolderInput ? (
        <form onSubmit={onSubmitCreateFolder} className="flex items-center gap-2 w-full">
          <div className="flex items-center gap-2 flex-1 h-9 px-2 rounded-md border bg-background">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <Input
              value={newFolderName}
              onChange={(event) => onChangeNewFolderName(event.target.value)}
              placeholder="Nome da pasta"
              className="h-8 border-0 px-0 focus-visible:ring-0"
              autoFocus
              disabled={isCreatingFolder}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={onCancelCreateFolder}
            disabled={isCreatingFolder}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9"
            disabled={isCreatingFolder || !newFolderName.trim()}
          >
            <Check className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <Button
          variant="outline"
          className="flex-1 justify-start gap-2 h-9 text-gray-600"
          onClick={onStartCreateFolder}
        >
          <Folder className="h-4 w-4" />
          Nova Pasta
        </Button>
      )}
    </div>
  );
}
