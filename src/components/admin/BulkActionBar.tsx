
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BulkAction {
  value: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface BulkActionBarProps {
  selectedItems: string[];
  actions: BulkAction[];
  onAction: (action: string) => void;
  isProcessing?: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedItems,
  actions,
  onAction,
  isProcessing = false
}) => {
  const [selectedAction, setSelectedAction] = React.useState<string>('');

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-muted rounded-md mb-4">
      <div className="text-sm font-medium">
        {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Select
          value={selectedAction}
          onValueChange={setSelectedAction}
          disabled={isProcessing}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={() => {
            if (selectedAction) {
              onAction(selectedAction);
              setSelectedAction('');
            }
          }}
          disabled={!selectedAction || isProcessing}
          variant={actions.find(a => a.value === selectedAction)?.variant || 'default'}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;
