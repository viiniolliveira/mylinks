import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Check, Folder, LogOut, Plus, Search, Settings, X } from 'lucide-react';
import type { Link } from '../../services/links';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";
import { createLinkMutationAtom, deleteLinkMutationAtom, folderLinksQueryAtomFamily, linksQueryAtom } from './atoms/links';
import { createFolderMutationAtom, foldersQueryAtom } from './atoms/folders';
import { isFolderDeleteModalOpenAtom, selectedFolderForDeleteAtom } from './atoms/folderDelete';
import { FolderCard } from './components/FolderCard';
import { LinkCard } from './components/LinkCard';
import { LinksSkeleton } from './components/LinksSkeleton';
import { LinkEditModal } from './components/LinkEditModal';
import { FolderDeleteModal } from './components/FolderDeleteModal';
import { isLinkEditModalOpenAtom, selectedLinkAtom } from './atoms/linkEditor';

interface PageMetadata {
  url: string;
  title?: string;
  description?: string;
  faviconUrl?: string;
}

async function queryActiveTab() {
  return new Promise<chrome.tabs.Tab | undefined>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

async function fetchPageMetadata(tabId: number) {
  return new Promise<PageMetadata | null>((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'getPageMetadata' }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response as PageMetadata);
    });
  });
}

interface FolderLinksListProps {
  folderId: string;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

function FolderLinksList({ folderId, onEdit, onDelete }: FolderLinksListProps) {
  const {
    data: folderLinks,
    isPending,
    isError,
    error,
  } = useAtomValue(folderLinksQueryAtomFamily(folderId));

  if (isPending) {
    return (
      <div className="ml-10 py-1 text-xs text-muted-foreground">
        Carregando links...
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : 'Falha ao carregar links';
    return (
      <div className="ml-10 py-1 text-xs text-destructive">
        {message}
      </div>
    );
  }

  if (!folderLinks || folderLinks.length === 0) {
    return (
      <div className="ml-10 py-1 text-xs text-muted-foreground">
        Nenhum link nesta pasta.
      </div>
    );
  }

  return (
    <div className="ml-6 space-y-1">
      {folderLinks.map((link) => (
        <LinkCard
          key={link.id}
          title={link.title}
          url={link.url}
          description={link.description}
          faviconUrl={link.faviconUrl}
          onEdit={() => onEdit(link)}
          onDelete={() => onDelete(link.id)}
        />
      ))}
    </div>
  );
}

export default function LinksManager() {
  const { data: links, isPending, isError, error } = useAtomValue(linksQueryAtom);
  const {
    data: folders,
    isPending: isFoldersPending,
    isError: isFoldersError,
    error: foldersError,
  } = useAtomValue(foldersQueryAtom);
  const [{ mutateAsync: createLink, isPending: isSaving }] = useAtom(createLinkMutationAtom);
  const [{ mutateAsync: removeLink, isPending: isDeleting }] = useAtom(deleteLinkMutationAtom);
  const [{ mutateAsync: createFolder, isPending: isCreatingFolder }] = useAtom(createFolderMutationAtom);
  const setFolderDeleteModalOpen = useSetAtom(isFolderDeleteModalOpenAtom);
  const setSelectedFolderForDelete = useSetAtom(selectedFolderForDeleteAtom);
  const [createError, setCreateError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [createFolderError, setCreateFolderError] = useState('');
  const [isCreatingFolderInput, setIsCreatingFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openFolderIds, setOpenFolderIds] = useState<string[]>([]);
  const setEditModalOpen = useSetAtom(isLinkEditModalOpenAtom);
  const setSelectedLink = useSetAtom(selectedLinkAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Falha ao carregar links'
    : '';

  const foldersErrorMessage = isFoldersError
    ? foldersError instanceof Error
      ? foldersError.message
      : 'Falha ao carregar pastas'
    : '';

  const handleSaveCurrentLink = async () => {
    setCreateError('');
    setDeleteError('');

    try {
      const tab = await queryActiveTab();

      if (!tab?.id) {
        throw new Error('Nenhuma aba ativa encontrada');
      }

      const fallback: PageMetadata = {
        url: tab.url || '',
        title: tab.title || '',
        description: '',
        faviconUrl: tab.favIconUrl || '',
      };

      const pageData = await fetchPageMetadata(tab.id);

      const payload = {
        url: pageData?.url || fallback.url,
        title: pageData?.title || fallback.title,
        description: pageData?.description || undefined,
        faviconUrl: pageData?.faviconUrl || fallback.faviconUrl || undefined,
      };

      if (!payload.url) {
        throw new Error('URL da pagina nao encontrada');
      }

      await createLink(payload);
    } catch (err) {
      if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError('Falha ao salvar link');
      }
    }
  };

  const handleDeleteLink = async (id: string) => {
    setDeleteError('');

    try {
      await removeLink(id);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('Falha ao excluir link');
      }
    }
  };

  const handleEditLink = (link: Link) => {
    if (!link) return;
    setSelectedLink(link);
    setEditModalOpen(true);
  };

  const handleOpenDeleteFolder = (folderId: string) => {
    const folder = (folders ?? []).find((item) => item.id === folderId) || null;
    setSelectedFolderForDelete(folder);
    setFolderDeleteModalOpen(true);
  };

  const handleStartCreateFolder = () => {
    setIsCreatingFolderInput(true);
    setNewFolderName('');
    setCreateFolderError('');
  };

  const handleCancelCreateFolder = () => {
    setIsCreatingFolderInput(false);
    setNewFolderName('');
    setCreateFolderError('');
  };

  const handleToggleFolder = (id: string) => {
    setOpenFolderIds((prev) =>
      prev.includes(id) ? prev.filter((folderId) => folderId !== id) : [...prev, id]
    );
  };

  const handleCreateFolder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateFolderError('');

    const name = newFolderName.trim();

    if (!name) {
      setCreateFolderError('Nome da pasta e obrigatorio');
      return;
    }

    try {
      await createFolder({ name });
      setIsCreatingFolderInput(false);
      setNewFolderName('');
    } catch (err) {
      if (err instanceof Error) {
        setCreateFolderError(err.message);
      } else {
        setCreateFolderError('Falha ao criar pasta');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background w-full max-w-100 mx-auto">
      {/* Header */}
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Actions */}
      <div className="p-4 flex items-center justify-between gap-2">
        {isCreatingFolderInput ? (
          <form onSubmit={handleCreateFolder} className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-2 flex-1 h-9 px-2 rounded-md border bg-background">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <Input
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
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
              onClick={handleCancelCreateFolder}
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
            onClick={handleStartCreateFolder}
          >
            <Folder className="h-4 w-4" />
            Nova Pasta
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-9 h-9 bg-secondary border-none" 
          />
        </div>
      </div>

      {isError && (
        <div className="px-4 mb-3">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {errorMessage}
          </div>
        </div>
      )}

      {isFoldersError && (
        <div className="px-4 mb-3">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {foldersErrorMessage}
          </div>
        </div>
      )}

      {createError && (
        <div className="px-4 mb-3">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {createError}
          </div>
        </div>
      )}

      {deleteError && (
        <div className="px-4 mb-3">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {deleteError}
          </div>
        </div>
      )}


      {createFolderError && (
        <div className="px-4 mb-3">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {createFolderError}
          </div>
        </div>
      )}

      {/* List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 pb-20">
          {isPending || isFoldersPending ? (
            <LinksSkeleton />
          ) : (
            <>
              {(folders ?? []).map((folder) => (
                <div key={folder.id} className="space-y-1">
                  <FolderCard
                    title={folder.name}
                    count={folder.totalLinks}
                    isOpen={openFolderIds.includes(folder.id)}
                    onOpen={() => handleToggleFolder(folder.id)}
                    onDelete={() => handleOpenDeleteFolder(folder.id)}
                  />
                  {openFolderIds.includes(folder.id) && (
                    <FolderLinksList
                      folderId={folder.id}
                      onEdit={handleEditLink}
                      onDelete={handleDeleteLink}
                    />
                  )}
                </div>
              ))}
              {(links ?? []).map((link) => (
                <LinkCard
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  description={link.description}
                  faviconUrl={link.faviconUrl}
                  onEdit={() => handleEditLink(link)}
                  onDelete={() => handleDeleteLink(link.id)}
                />
              ))}
              {(folders ?? []).length === 0 && (links ?? []).length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum link encontrado.
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer Button */}
      <div className="p-4 border-t bg-background  bottom-0 w-full">
        <Button
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleSaveCurrentLink}
          disabled={isSaving || isDeleting}
        >
          <Plus size={18} />
          {isSaving ? 'Salvando...' : 'Salvar link atual'}
        </Button>
      </div>

      <LinkEditModal />
      <FolderDeleteModal />
    </div>
  );
}
