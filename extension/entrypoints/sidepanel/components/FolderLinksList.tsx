import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useAtomValue } from 'jotai';
import { folderLinksQueryAtomFamily } from '../atoms/links';
import { LinkCard } from './LinkCard';
import type { Link } from '../../../services/links';

interface FolderLinksListProps {
  folderId: string;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

function DraggableLink({ link, onEdit, onDelete }: { link: Link; onEdit: (link: Link) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `link-${link.id}`,
    data: { type: 'link', link },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? 'relative' : undefined,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <LinkCard
        title={link.title}
        url={link.url}
        description={link.description}
        faviconUrl={link.faviconUrl}
        onEdit={() => onEdit(link)}
        onDelete={() => onDelete(link.id)}
      />
    </div>
  );
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
        <DraggableLink
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
