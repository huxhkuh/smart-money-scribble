import { useRef, useState } from "react";
import { Block } from "@/types/blocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export default function BlockRenderer({ block, isEditing, onUpdate }: BlockRendererProps) {
  const style: React.CSSProperties = {
    backgroundColor: block.style?.backgroundColor,
    background: block.style?.backgroundGradient || undefined,
    backgroundImage: block.style?.backgroundImage ? `url(${block.style.backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: block.style?.padding || "1rem",
    margin: block.style?.margin,
    borderRadius: block.style?.borderRadius || "0.75rem",
    border: block.style?.border,
    boxShadow: block.style?.shadow,
    textAlign: block.style?.textAlign || "right",
  };

  const updateContent = (newContent: any) => {
    onUpdate?.({ ...block, content: { ...block.content, ...newContent } });
  };

  switch (block.type) {
    case "text":
      return (
        <div style={style} className="leading-relaxed">
          {isEditing ? (
            <div
              contentEditable
              suppressContentEditableWarning
              className="outline-none min-h-[2rem] prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              onBlur={(e) => updateContent({ html: e.currentTarget.innerHTML })}
              dir="rtl"
            />
          ) : (
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-li:text-foreground"
              dangerouslySetInnerHTML={{ __html: block.content.html }}
            />
          )}
        </div>
      );

    case "heading": {
      const Tag = `h${block.content.level || 2}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = {
        1: "text-4xl md:text-5xl",
        2: "text-3xl md:text-4xl",
        3: "text-2xl md:text-3xl"
      };
      const decorations: Record<number, string> = {
        1: "pb-4 border-b-2 border-primary/20",
        2: "pb-2",
        3: "",
      };
      return (
        <div style={style} className={decorations[block.content.level || 2]}>
          {isEditing ? (
            <div
              contentEditable
              suppressContentEditableWarning
              className={`outline-none font-heading font-bold ${sizes[block.content.level || 2]} text-foreground`}
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              onBlur={(e) => updateContent({ html: e.currentTarget.innerHTML })}
              dir="rtl"
            />
          ) : (
            <Tag className={`font-heading font-bold ${sizes[block.content.level || 2]} text-foreground`}>
              <span dangerouslySetInnerHTML={{ __html: block.content.html }} />
            </Tag>
          )}
        </div>
      );
    }

    case "image": {
      const widthClass = block.content.width === "half" ? "w-1/2" : block.content.width === "third" ? "w-1/3" : "w-full";
      const alignClass = block.content.align === "center" ? "mx-auto" : block.content.align === "left" ? "ml-auto mr-0" : "";
      return (
        <div style={style}>
          {block.content.url ? (
            <figure className={`${widthClass} ${alignClass}`}>
              <img
                src={block.content.url}
                alt={block.content.alt || ""}
                className="rounded-xl w-full shadow-lg"
                loading="lazy"
              />
              {block.content.caption && (
                <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
                  {block.content.caption}
                </figcaption>
              )}
            </figure>
          ) : isEditing ? (
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center text-muted-foreground">
              הוסף תמונה מספריית המדיה
            </div>
          ) : null}
        </div>
      );
    }

    case "table":
      return (
        <div style={style} className="overflow-x-auto">
          <div className="rounded-xl border border-border overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {(block.content.headers || []).map((h: string, i: number) => (
                    <TableHead key={i} className="font-bold text-foreground py-3">
                      {isEditing ? (
                        <input
                          className="bg-transparent border-none outline-none w-full font-bold"
                          value={h}
                          onChange={(e) => {
                            const headers = [...block.content.headers];
                            headers[i] = e.target.value;
                            updateContent({ headers });
                          }}
                          dir="rtl"
                        />
                      ) : (
                        h
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(block.content.rows || []).map((row: string[], ri: number) => (
                  <TableRow key={ri} className="hover:bg-muted/30 transition-colors">
                    {row.map((cell, ci) => (
                      <TableCell key={ci} className="py-3">
                        {isEditing ? (
                          <input
                            className="bg-transparent border-none outline-none w-full"
                            value={cell}
                            onChange={(e) => {
                              const rows = block.content.rows.map((r: string[], idx: number) =>
                                idx === ri ? r.map((c: string, cIdx: number) => (cIdx === ci ? e.target.value : c)) : r
                              );
                              updateContent({ rows });
                            }}
                            dir="rtl"
                          />
                        ) : (
                          cell
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {isEditing && (
            <div className="flex gap-2 mt-2">
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => {
                  const newRow = block.content.headers.map(() => "");
                  updateContent({ rows: [...block.content.rows, newRow] });
                }}
              >
                + שורה
              </button>
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => {
                  updateContent({
                    headers: [...block.content.headers, `עמודה ${block.content.headers.length + 1}`],
                    rows: block.content.rows.map((r: string[]) => [...r, ""]),
                  });
                }}
              >
                + עמודה
              </button>
            </div>
          )}
        </div>
      );

    case "callout": {
      const icons: Record<string, any> = { info: Info, warning: AlertTriangle, success: CheckCircle, error: AlertCircle };
      const colors: Record<string, string> = {
        info: "bg-primary/5 border-primary/20",
        warning: "bg-yellow-50 border-yellow-300 dark:bg-yellow-950/20 dark:border-yellow-700",
        success: "bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-700",
        error: "bg-destructive/5 border-destructive/20",
      };
      const iconColors: Record<string, string> = {
        info: "text-primary",
        warning: "text-yellow-600 dark:text-yellow-400",
        success: "text-green-600 dark:text-green-400",
        error: "text-destructive",
      };
      const Icon = icons[block.content.type] || Info;
      return (
        <div
          className={`rounded-xl border-2 p-5 flex gap-4 ${colors[block.content.type] || colors.info}`}
          style={{ margin: block.style?.margin }}
        >
          <div className={`rounded-full p-2 h-fit ${iconColors[block.content.type] || iconColors.info}`}>
            <Icon className="h-5 w-5 shrink-0" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <>
                <input
                  className="bg-transparent border-none outline-none w-full font-bold text-lg mb-1 text-foreground"
                  value={block.content.title}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  placeholder="כותרת"
                  dir="rtl"
                />
                <textarea
                  className="bg-transparent border-none outline-none w-full resize-none text-foreground"
                  value={block.content.text}
                  onChange={(e) => updateContent({ text: e.target.value })}
                  placeholder="תוכן..."
                  dir="rtl"
                />
              </>
            ) : (
              <>
                {block.content.title && <p className="font-bold text-lg text-foreground mb-1">{block.content.title}</p>}
                <p className="text-foreground/80 leading-relaxed">{block.content.text}</p>
              </>
            )}
          </div>
        </div>
      );
    }

    case "cards": {
      const colClass: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" };
      const variantStyles: Record<string, string> = {
        default: "shadow-card hover:shadow-elevated transition-shadow duration-300",
        bordered: "border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300",
        gradient: "gradient-primary text-primary-foreground shadow-lg",
      };
      return (
        <div style={style}>
          <div className={`grid grid-cols-1 ${colClass[block.content.columns || 3]} gap-5`}>
            {(block.content.cards || []).map((card: any, i: number) => (
              <Card key={i} className={`${variantStyles[block.content.variant] || variantStyles.default} rounded-xl overflow-hidden`}>
                <CardHeader className="pb-2">
                  {card.icon && <span className="text-2xl mb-1">{card.icon}</span>}
                  <CardTitle className="text-lg font-heading">
                    {isEditing ? (
                      <input
                        className="bg-transparent border-none outline-none w-full"
                        value={card.title}
                        onChange={(e) => {
                          const cards = [...block.content.cards];
                          cards[i] = { ...cards[i], title: e.target.value };
                          updateContent({ cards });
                        }}
                        placeholder="כותרת כרטיס"
                        dir="rtl"
                      />
                    ) : (
                      card.title
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <textarea
                      className="bg-transparent border-none outline-none w-full resize-none text-sm"
                      value={card.text}
                      onChange={(e) => {
                        const cards = [...block.content.cards];
                        cards[i] = { ...cards[i], text: e.target.value };
                        updateContent({ cards });
                      }}
                      placeholder="תוכן..."
                      dir="rtl"
                    />
                  ) : (
                    <p className="text-sm opacity-80 leading-relaxed">{card.text}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {isEditing && (
            <button
              className="text-xs text-primary hover:underline mt-3"
              onClick={() => updateContent({ cards: [...block.content.cards, { title: "", text: "" }] })}
            >
              + כרטיס
            </button>
          )}
        </div>
      );
    }

    case "divider":
      return (
        <div className="py-4" style={{ margin: block.style?.margin }}>
          <hr className="border-t-2 border-border" />
        </div>
      );

    case "embed":
      return (
        <div style={style}>
          {isEditing ? (
            <input
              className="w-full border rounded-xl p-3 bg-background text-foreground"
              value={block.content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="הדבק קישור (YouTube, Twitter...)"
              dir="ltr"
            />
          ) : block.content.url ? (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={block.content.url}
                className="w-full rounded-xl"
                style={{ height: 400 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : null}
          {block.content.caption && !isEditing && (
            <p className="text-sm text-muted-foreground mt-2 text-center italic">{block.content.caption}</p>
          )}
        </div>
      );

    default:
      return <div className="text-muted-foreground p-4">בלוק לא מוכר: {block.type}</div>;
  }
}
