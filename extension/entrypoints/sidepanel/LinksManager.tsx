import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Folder, Plus, Settings, Search, LogOut } from 'lucide-react';
import type { Link } from '../../services/links';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";
import { createLinkMutationAtom, deleteLinkMutationAtom, linksQueryAtom } from './atoms/links';
import { FolderCard } from './components/FolderCard';
import { LinkCard } from './components/LinkCard';
import { LinksSkeleton } from './components/LinksSkeleton';
import { LinkEditModal } from './components/LinkEditModal';
import { isLinkEditModalOpenAtom, selectedLinkAtom } from './atoms/linkEditor';

interface FolderItem {
  id: string;
  title: string;
  count?: number;
}

const folders: FolderItem[] = [
  { id: 'f-1', title: 'Trabalho', count: 3 },
  { id: 'f-2', title: 'Design Inspiration', count: 12 },
  { id: 'f-3', title: 'Leitura Tarde', count: 5 },
];

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

export default function LinksManager() {
  const { data: links, isPending, isError, error } = useAtomValue(linksQueryAtom);
  const [{ mutateAsync: createLink, isPending: isSaving }] = useAtom(createLinkMutationAtom);
  const [{ mutateAsync: removeLink, isPending: isDeleting }] = useAtom(deleteLinkMutationAtom);
  const [createError, setCreateError] = useState('');
  const [deleteError, setDeleteError] = useState('');
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
        <Button variant="outline" className="flex-1 justify-start gap-2 h-9 text-gray-600">
          <Folder className="h-4 w-4" />
          Nova Pasta
        </Button>
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

      {/* List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 pb-20">
          {isPending ? (
            <LinksSkeleton />
          ) : (
            <>
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  title={folder.title}
                  count={folder.count}
                />
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
              {folders.length === 0 && (links ?? []).length === 0 && (
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
    </div>
  );
}
