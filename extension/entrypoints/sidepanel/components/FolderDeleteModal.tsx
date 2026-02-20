import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { deleteFolderMutationAtom } from '../atoms/folders';
import { isFolderDeleteModalOpenAtom, selectedFolderForDeleteAtom } from '../atoms/folderDelete';

export function FolderDeleteModal() {
  const [isOpen, setIsOpen] = useAtom(isFolderDeleteModalOpenAtom);
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderForDeleteAtom);
  const [{ mutateAsync: removeFolder, isPending }] = useAtom(deleteFolderMutationAtom);
  const [error, setError] = useState('');

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedFolder(null);
      setError('');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFolder) {
      setError('Selecione uma pasta para excluir');
      return;
    }

    setError('');

    try {
      await removeFolder(selectedFolder.id);
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Falha ao excluir pasta');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir pasta</DialogTitle>
          <DialogDescription>
            Deletar a pasta "{selectedFolder?.name || 'esta pasta'}" vai deletar todos os links dentro dela, quer realmente deletar a pasta?
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <DialogFooter className='flex gap-2'>
          <Button size='sm' type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button size='sm' type="button" variant="destructive" onClick={handleConfirmDelete} disabled={isPending}>
            {isPending ? 'Excluindo...' : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
