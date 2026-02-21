import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type { Link } from '../../services/links';
import { createLinkMutationAtom, deleteLinkMutationAtom, linksQueryAtom, updateLinkMutationAtom } from './atoms/links';
import { createFolderMutationAtom, foldersQueryAtom } from './atoms/folders';
import { isFolderDeleteModalOpenAtom, selectedFolderForDeleteAtom } from './atoms/folderDelete';
import { isFolderEditModalOpenAtom, selectedFolderForEditAtom } from './atoms/folderEdit';
import { LinksHeader } from './components/LinksHeader';
import { FolderCreateBar } from './components/FolderCreateBar';
import { LinksSearchBar } from './components/LinksSearchBar';
import { LinksAlerts } from './components/LinksAlerts';
import { LinksList } from './components/LinksList';
import { SaveCurrentLinkBar } from './components/SaveCurrentLinkBar';
import { LinkEditModal } from './components/LinkEditModal';
import { FolderDeleteModal } from './components/FolderDeleteModal';
import { FolderEditModal } from './components/FolderEditModal';
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
  const [{ mutateAsync: updateLink }] = useAtom(updateLinkMutationAtom);
  const [{ mutateAsync: createFolder, isPending: isCreatingFolder }] = useAtom(createFolderMutationAtom);
  const setFolderDeleteModalOpen = useSetAtom(isFolderDeleteModalOpenAtom);
  const setSelectedFolderForDelete = useSetAtom(selectedFolderForDeleteAtom);
  const setFolderEditModalOpen = useSetAtom(isFolderEditModalOpenAtom);
  const setSelectedFolderForEdit = useSetAtom(selectedFolderForEditAtom);
  const [createError, setCreateError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [createFolderError, setCreateFolderError] = useState('');
  const [isCreatingFolderInput, setIsCreatingFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openFolderIds, setOpenFolderIds] = useState<string[]>([]);
  const setEditModalOpen = useSetAtom(isLinkEditModalOpenAtom);
  const setSelectedLink = useSetAtom(selectedLinkAtom);
  const navigate = useNavigate();

  const handleChangeNewFolderName = (value: string) => {
    setNewFolderName(value);
  };

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

  const handleOpenEditFolder = (folderId: string) => {
    const folder = (folders ?? []).find((item) => item.id === folderId) || null;
    setSelectedFolderForEdit(folder);
    setFolderEditModalOpen(true);
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

  const handleMoveLink = async (linkId: string, folderId: string | null) => {
    try {
      await updateLink({ id: linkId, data: { folderId } });
    } catch (err) {
      console.error('Failed to move link', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background w-full max-w-100 mx-auto">
      <LinksHeader onLogout={handleLogout} />
      <FolderCreateBar
        isCreatingFolderInput={isCreatingFolderInput}
        newFolderName={newFolderName}
        isCreatingFolder={isCreatingFolder}
        onSubmitCreateFolder={handleCreateFolder}
        onCancelCreateFolder={handleCancelCreateFolder}
        onStartCreateFolder={handleStartCreateFolder}
        onChangeNewFolderName={handleChangeNewFolderName}
      />
      <LinksSearchBar />
      <LinksAlerts
        errorMessage={errorMessage}
        foldersErrorMessage={foldersErrorMessage}
        createError={createError}
        deleteError={deleteError}
        createFolderError={createFolderError}
      />
      <LinksList
        isPending={isPending}
        isFoldersPending={isFoldersPending}
        folders={folders}
        links={links}
        openFolderIds={openFolderIds}
        onToggleFolder={handleToggleFolder}
        onOpenDeleteFolder={handleOpenDeleteFolder}
        onEditLink={handleEditLink}
        onDeleteLink={handleDeleteLink}
        onEditFolder={(folder) => handleOpenEditFolder(folder.id)}
        onMoveLink={handleMoveLink}
      />
      <SaveCurrentLinkBar
        onSave={handleSaveCurrentLink}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      <LinkEditModal />
      <FolderDeleteModal />
      <FolderEditModal />
    </div>
  );
}
