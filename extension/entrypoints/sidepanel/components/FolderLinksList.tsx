import React from 'react';
import { useAtomValue } from 'jotai';
import type { Link } from '../../../services/links';
import { folderLinksQueryAtomFamily } from '../atoms/links';
import { LinkCard } from './LinkCard';

interface FolderLinksListProps {
  folderId: string;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

export function FolderLinksList({ folderId, onEdit, onDelete }: FolderLinksListProps) {
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
