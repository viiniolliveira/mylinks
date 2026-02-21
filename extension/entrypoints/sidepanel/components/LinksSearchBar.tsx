import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function LinksSearchBar() {
  return (
    <div className="px-4 mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          className="pl-9 h-9 bg-secondary border-none"
        />
      </div>
    </div>
  );
}
