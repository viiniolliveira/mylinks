import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FolderCard } from './FolderCard';
import type { Folder } from '../../../services/folders';

interface DroppableFolderCardProps {
  folder: Folder;
  isOpen: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function DroppableFolderCard({
  folder,
  isOpen,
  onOpen,
  onEdit,
  onDelete,
}: DroppableFolderCardProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: { type: 'folder', folder },
  });

  const style: React.CSSProperties = {
    opacity: isOver ? 0.7 : 1,
    border: isOver ? '2px dashed var(--primary)' : '2px solid transparent',
    borderRadius: '0.5rem',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FolderCard
        title={folder.name}
        count={folder.totalLinks}
        isOpen={isOpen}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
