import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LinkCard } from './LinkCard';
import type { Link } from '../../../services/links';

interface DraggableLinkCardProps {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
}

export function DraggableLinkCard({ link, onEdit, onDelete }: DraggableLinkCardProps) {
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
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
