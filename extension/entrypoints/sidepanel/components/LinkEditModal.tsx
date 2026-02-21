import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { foldersQueryAtom } from '../atoms/folders';
import { updateLinkMutationAtom } from '../atoms/links';
import { isLinkEditModalOpenAtom, selectedLinkAtom } from '../atoms/linkEditor';

export function LinkEditModal() {
  const [isOpen, setIsOpen] = useAtom(isLinkEditModalOpenAtom);
  const [selectedLink, setSelectedLink] = useAtom(selectedLinkAtom);
  const [{ mutateAsync: updateLink, isPending }] = useAtom(updateLinkMutationAtom);
  const [error, setError] = useState('');

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [folderId, setFolderId] = useState('');
  const { data: folders, isPending: isFoldersPending } = useAtomValue(foldersQueryAtom);

  useEffect(() => {
    if (!selectedLink) {
      setUrl('');
      setTitle('');
      setDescription('');
      setFaviconUrl('');
      setFolderId('');
      return;
    }

    setUrl(selectedLink.url || '');
    setTitle(selectedLink.title || '');
    setDescription(selectedLink.description || '');
    setFaviconUrl(selectedLink.faviconUrl || '');
    setFolderId(selectedLink.folderId || '');
  }, [selectedLink]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedLink(null);
      setError('');
    }
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!selectedLink) {
      setError('Selecione um link para editar');
      return;
    }

    const payload = {
      url: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      faviconUrl: faviconUrl.trim() || undefined,
      folderId: folderId.trim() || null,
    };

    if (!payload.url) {
      setError('URL e obrigatoria');
      return;
    }

    try {
      await updateLink({ id: selectedLink.id, data: payload });
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Falha ao atualizar link');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
          <DialogDescription>Atualize as informacoes do link.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium">URL</label>
            <Input value={url} onChange={(event) => setUrl(event.target.value)} required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Titulo</label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Descricao</label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Favicon URL</label>
            <Input
              value={faviconUrl}
              onChange={(event) => setFaviconUrl(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Pasta</label>
            <Select
              value={folderId || 'none'}
              onValueChange={(value) => setFolderId(value === 'none' ? '' : value)}
              disabled={isFoldersPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma pasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem pasta</SelectItem>
                {(folders ?? []).map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className='gap-2'>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar alteracoes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
