import { useCallback } from "react";
import { Block } from "@/types/blocks";
import BlockToolbar from "./BlockToolbar";
import SortableBlock from "./SortableBlock";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addBlock = useCallback(
    (block: Block) => onChange([...blocks, block]),
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
    (index: number) => onChange(blocks.filter((_, i) => i !== index)),
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newBlocks = [...blocks];
      const [moved] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, moved);
      onChange(newBlocks);
    },
    [blocks, onChange]
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block, index) => (
              <SortableBlock
                key={block.id}
                block={block}
                index={index}
                totalBlocks={blocks.length}
                onUpdate={updateBlock}
                onRemove={removeBlock}
                onMove={moveBlock}
                onStyleChange={updateBlockStyle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
