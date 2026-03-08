import { BlockType, createBlock, Block } from "@/types/blocks";
import { Button } from "@/components/ui/button";
import {
  Type,
  Heading,
  ImageIcon,
  Columns,
  TableIcon,
  AlertCircle,
  LayoutGrid,
  Minus,
  Code,
} from "lucide-react";

interface BlockToolbarProps {
  onAddBlock: (block: Block) => void;
}

const blockOptions: { type: BlockType; label: string; icon: any }[] = [
  { type: "heading", label: "כותרת", icon: Heading },
  { type: "text", label: "טקסט", icon: Type },
  { type: "image", label: "תמונה", icon: ImageIcon },
  { type: "columns", label: "טורים", icon: Columns },
  { type: "table", label: "טבלה", icon: TableIcon },
  { type: "callout", label: "הדגשה", icon: AlertCircle },
  { type: "cards", label: "כרטיסים", icon: LayoutGrid },
  { type: "divider", label: "קו מפריד", icon: Minus },
  { type: "embed", label: "Embed", icon: Code },
];

export default function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  return (
    <div className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b p-3 flex flex-wrap gap-2">
      <span className="text-sm font-medium text-muted-foreground self-center ml-2">הוסף בלוק:</span>
      {blockOptions.map((opt) => (
        <Button
          key={opt.type}
          variant="outline"
          size="sm"
          onClick={() => onAddBlock(createBlock(opt.type))}
          className="gap-1.5"
        >
          <opt.icon className="h-4 w-4" />
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
