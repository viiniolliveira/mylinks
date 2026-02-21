import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { updateFolderMutationAtom } from '../atoms/folders';
import { isFolderEditModalOpenAtom, selectedFolderForEditAtom } from '../atoms/folderEdit';

export function FolderEditModal() {
  const [isOpen, setIsOpen] = useAtom(isFolderEditModalOpenAtom);
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderForEditAtom);
  const [{ mutateAsync: updateFolder, isPending }] = useAtom(updateFolderMutationAtom);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && selectedFolder) {
      setName(selectedFolder.name);
      setError('');
    }
  }, [isOpen, selectedFolder]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedFolder(null);
      setError('');
      setName('');
    }
  };

  const handleConfirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFolder) {
      setError('Nenhuma pasta selecionada');
      return;
    }

    const newName = name.trim();
    if (!newName) {
      setError('O nome da pasta não pode estar vazio');
      return;
    }

    setError('');

    try {
      await updateFolder({ id: selectedFolder.id, payload: { name: newName } });
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Falha ao atualizar pasta');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleConfirmEdit}>
          <DialogHeader>
            <DialogTitle>Editar pasta</DialogTitle>
            <DialogDescription>
              Digite o novo nome para a pasta.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da pasta"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter className='flex gap-2'>
            <Button size='sm' type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button size='sm' type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
