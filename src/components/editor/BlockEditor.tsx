import { useState, useCallback } from "react";
import { Block } from "@/types/blocks";
import BlockRenderer from "./BlockRenderer";
import BlockToolbar from "./BlockToolbar";
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

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = useCallback(
    (block: Block) => {
      onChange([...blocks, block]);
    },
    [blocks, onChange]
  );

  const updateBlock = useCallback(
    (index: number, updated: Block) => {
      const newBlocks = [...blocks];
      newBlocks[index] = updated;
      onChange(newBlocks);
    },
    [blocks, onChange]
  );

  const removeBlock = useCallback(
    (index: number) => {
      onChange(blocks.filter((_, i) => i !== index));
    },
    [blocks, onChange]
  );

  const moveBlock = useCallback(
    (index: number, direction: -1 | 1) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= blocks.length) return;
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      onChange(newBlocks);
    },
    [blocks, onChange]
  );

  const updateBlockStyle = useCallback(
    (index: number, key: string, value: string) => {
      const block = blocks[index];
      const updatedBlock = {
        ...block,
        style: { ...block.style, [key]: value || undefined },
      };
      updateBlock(index, updatedBlock);
    },
    [blocks, updateBlock]
  );

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <BlockToolbar onAddBlock={addBlock} />

      <div className="p-4 space-y-3 min-h-[400px]">
        {blocks.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg mb-2">התחל לבנות את הפוסט שלך</p>
            <p className="text-sm">לחץ על אחד הכפתורים למעלה כדי להוסיף בלוק</p>
          </div>
        )}

        {blocks.map((block, index) => (
          <div key={block.id} className="group relative border border-transparent hover:border-primary/20 rounded-lg transition-colors">
            {/* Block controls */}
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 z-10">
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                <ChevronUp className="h-3 w-3" />
              </Button>
              <div className="cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>
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
                    <Input
                      type="color"
                      value={block.style?.backgroundColor || "#ffffff"}
                      onChange={(e) => updateBlockStyle(index, "backgroundColor", e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">ריפוד</Label>
                    <Select value={block.style?.padding || "1rem"} onValueChange={(v) => updateBlockStyle(index, "padding", v)}>
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
                    <Select value={block.style?.borderRadius || "0.5rem"} onValueChange={(v) => updateBlockStyle(index, "borderRadius", v)}>
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
                    <Select value={block.style?.textAlign || "right"} onValueChange={(v) => updateBlockStyle(index, "textAlign", v)}>
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
              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeBlock(index)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="pr-6 pl-6">
              <BlockRenderer block={block} isEditing onUpdate={(updated) => updateBlock(index, updated)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
