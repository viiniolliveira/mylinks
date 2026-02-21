import React from 'react';

interface LinksAlertsProps {
  errorMessage?: string;
  foldersErrorMessage?: string;
  createError?: string;
  deleteError?: string;
  createFolderError?: string;
}

export function LinksAlerts({
  errorMessage,
  foldersErrorMessage,
  createError,
  deleteError,
  createFolderError,
}: LinksAlertsProps) {
  return (
    <>
      {errorMessage && (
        <div className="px-4 mb-3">
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {errorMessage}
          </div>
        </div>
      )}

      {foldersErrorMessage && (
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
    </>
  );
}
