import React from 'react';
import type { Folder } from '../../../services/folders';
import type { Link } from '../../../services/links';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { FolderCard } from './FolderCard';
import { LinkCard } from './LinkCard';
import { LinksSkeleton } from './LinksSkeleton';
import { FolderLinksList } from './FolderLinksList';

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
}: LinksListProps) {
  const safeFolders = folders ?? [];
  const safeLinks = links ?? [];

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-1 pb-20">
        {isPending || isFoldersPending ? (
          <LinksSkeleton />
        ) : (
          <>
            {safeFolders.map((folder) => (
              <div key={folder.id} className="space-y-1">
                <FolderCard
                  title={folder.name}
                  count={folder.totalLinks}
                  isOpen={openFolderIds.includes(folder.id)}
                  onOpen={() => onToggleFolder(folder.id)}
                  onDelete={() => onOpenDeleteFolder(folder.id)}
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
              <LinkCard
                key={link.id}
                title={link.title}
                url={link.url}
                description={link.description}
                faviconUrl={link.faviconUrl}
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
  );
}
