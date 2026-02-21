import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface SaveCurrentLinkBarProps {
  onSave: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function SaveCurrentLinkBar({ onSave, isSaving, isDeleting }: SaveCurrentLinkBarProps) {
  return (
    <div className="p-4 border-t bg-background bottom-0 w-full">
      <Button
        className="w-full gap-2 bg-primary hover:bg-primary/80 text-primary-foreground"
        onClick={onSave}
        disabled={isSaving || isDeleting}
      >
        <Plus size={18} />
        {isSaving ? 'Salvando...' : 'Salvar link atual'}
      </Button>
    </div>
  );
}
