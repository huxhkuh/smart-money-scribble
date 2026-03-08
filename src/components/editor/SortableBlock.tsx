import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/types/blocks";
import BlockRenderer from "./BlockRenderer";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, ChevronUp, ChevronDown, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortableBlockProps {
  block: Block;
  index: number;
  totalBlocks: number;
  onUpdate: (index: number, block: Block) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onStyleChange: (index: number, key: string, value: string) => void;
}

export default function SortableBlock({ block, index, totalBlocks, onUpdate, onRemove, onMove, onStyleChange }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative border border-transparent hover:border-primary/20 rounded-lg transition-colors">
      {/* Block controls */}
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 z-10">
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onMove(index, -1)} disabled={index === 0}>
          <ChevronUp className="h-3 w-3" />
        </Button>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onMove(index, 1)} disabled={index === totalBlocks - 1}>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Block actions */}
      <div className="absolute -left-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <Settings className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-3" align="start">
            <h4 className="font-medium text-sm">עיצוב הבלוק</h4>
            <div className="space-y-2">
              <Label className="text-xs">צבע רקע</Label>
              <Input type="color" value={block.style?.backgroundColor || "#ffffff"} onChange={(e) => onStyleChange(index, "backgroundColor", e.target.value)} className="h-8" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">ריפוד</Label>
              <Select value={block.style?.padding || "1rem"} onValueChange={(v) => onStyleChange(index, "padding", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5rem">קטן</SelectItem>
                  <SelectItem value="1rem">רגיל</SelectItem>
                  <SelectItem value="2rem">גדול</SelectItem>
                  <SelectItem value="3rem">ענק</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">עיגול פינות</Label>
              <Select value={block.style?.borderRadius || "0.5rem"} onValueChange={(v) => onStyleChange(index, "borderRadius", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">ללא</SelectItem>
                  <SelectItem value="0.5rem">קטן</SelectItem>
                  <SelectItem value="1rem">בינוני</SelectItem>
                  <SelectItem value="1.5rem">גדול</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">יישור טקסט</Label>
              <Select value={block.style?.textAlign || "right"} onValueChange={(v) => onStyleChange(index, "textAlign", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">ימין</SelectItem>
                  <SelectItem value="center">מרכז</SelectItem>
                  <SelectItem value="left">שמאל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => onRemove(index)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="pr-6 pl-6">
        <BlockRenderer block={block} isEditing onUpdate={(updated) => onUpdate(index, updated)} />
      </div>
    </div>
  );
}
