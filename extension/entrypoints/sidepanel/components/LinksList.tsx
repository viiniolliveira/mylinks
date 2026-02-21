import React, { useState } from 'react';
import type { Folder } from '../../../services/folders';
import type { Link } from '../../../services/links';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { FolderCard } from './FolderCard';
import { LinkCard } from './LinkCard';
import { LinksSkeleton } from './LinksSkeleton';
import { FolderLinksList } from './FolderLinksList';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { DraggableLinkCard } from './DraggableLinkCard';
import { DroppableFolderCard } from './DroppableFolderCard';

interface LinksListProps {
  isPending: boolean;
  isFoldersPending: boolean;
  folders?: Folder[];
  links?: Link[];
  openFolderIds: string[];
  onToggleFolder: (id: string) => void;
  onOpenDeleteFolder: (id: string) => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (id: string) => void;
  onEditFolder: (folder: Folder) => void;
  onMoveLink: (linkId: string, folderId: string | null) => void;
}

export function LinksList({
  isPending,
  isFoldersPending,
  folders,
  links,
  openFolderIds,
  onToggleFolder,
  onOpenDeleteFolder,
  onEditLink,
  onDeleteLink,
  onEditFolder,
  onMoveLink,
}: LinksListProps) {
  const safeFolders = folders ?? [];
  const safeLinks = links ?? [];
  const [activeLink, setActiveLink] = useState<Link | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'link') {
      setActiveLink(active.data.current.link as Link);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current?.type === 'link') {
      const linkId = (active.data.current.link as Link).id;
      const folderId = over.id.toString().replace('folder-', '');
      
      const link = active.data.current.link as Link;
      if (link.folderId !== folderId) {
          onMoveLink(linkId, folderId);
      }
    }
    setActiveLink(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 pb-20">
          {isPending || isFoldersPending ? (
            <LinksSkeleton />
          ) : (
            <>
              {safeFolders.map((folder) => (
                <div key={folder.id} className="space-y-1">
                  <DroppableFolderCard
                    folder={folder}
                    isOpen={openFolderIds.includes(folder.id)}
                    onOpen={() => onToggleFolder(folder.id)}
                    onDelete={() => onOpenDeleteFolder(folder.id)}
                    onEdit={() => onEditFolder(folder)}
                  />
                  {openFolderIds.includes(folder.id) && (
                    <FolderLinksList
                      folderId={folder.id}
                      onEdit={onEditLink}
                      onDelete={onDeleteLink}
                    />
                  )}
                </div>
              ))}
              {safeLinks.map((link) => (
                <DraggableLinkCard
                  key={link.id}
                  link={link}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link.id)}
                />
              ))}
              {safeFolders.length === 0 && safeLinks.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum link encontrado.
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
       <DragOverlay>
        {activeLink ? (
           <div className="opacity-80 bg-background rounded-lg shadow-lg border p-1">
            <LinkCard
              title={activeLink.title}
              url={activeLink.url}
              description={activeLink.description}
              faviconUrl={activeLink.faviconUrl}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
