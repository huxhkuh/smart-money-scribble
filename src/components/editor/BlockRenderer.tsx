import { Block } from "@/types/blocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

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
    borderRadius: block.style?.borderRadius || "0.5rem",
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
        <div style={style}>
          {isEditing ? (
            <div
              contentEditable
              suppressContentEditableWarning
              className="outline-none min-h-[2rem] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              onBlur={(e) => updateContent({ html: e.currentTarget.innerHTML })}
              dir="rtl"
            />
          ) : (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: block.content.html }} />
          )}
        </div>
      );

    case "heading": {
      const Tag = `h${block.content.level || 2}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = { 1: "text-4xl", 2: "text-3xl", 3: "text-2xl" };
      return (
        <div style={style}>
          {isEditing ? (
            <div
              contentEditable
              suppressContentEditableWarning
              className={`outline-none font-heading font-bold ${sizes[block.content.level || 2]}`}
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              onBlur={(e) => updateContent({ html: e.currentTarget.innerHTML })}
              dir="rtl"
            />
          ) : (
            <Tag className={`font-heading font-bold ${sizes[block.content.level || 2]}`}>
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
              <img src={block.content.url} alt={block.content.alt || ""} className="rounded-lg w-full" />
              {block.content.caption && (
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">{block.content.caption}</figcaption>
              )}
            </figure>
          ) : isEditing ? (
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center text-muted-foreground">
              הוסף תמונה מספריית המדיה
            </div>
          ) : null}
        </div>
      );
    }

    case "table":
      return (
        <div style={style}>
          <Table>
            <TableHeader>
              <TableRow>
                {(block.content.headers || []).map((h: string, i: number) => (
                  <TableHead key={i}>
                    {isEditing ? (
                      <input
                        className="bg-transparent border-none outline-none w-full font-medium"
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
                <TableRow key={ri}>
                  {row.map((cell, ci) => (
                    <TableCell key={ci}>
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
        info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-200",
        success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200",
        error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200",
      };
      const Icon = icons[block.content.type] || Info;
      return (
        <div className={`rounded-lg border p-4 flex gap-3 ${colors[block.content.type] || colors.info}`} style={{ margin: block.style?.margin }}>
          <Icon className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="flex-1">
            {isEditing ? (
              <>
                <input
                  className="bg-transparent border-none outline-none w-full font-bold text-lg mb-1"
                  value={block.content.title}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  placeholder="כותרת"
                  dir="rtl"
                />
                <textarea
                  className="bg-transparent border-none outline-none w-full resize-none"
                  value={block.content.text}
                  onChange={(e) => updateContent({ text: e.target.value })}
                  placeholder="תוכן..."
                  dir="rtl"
                />
              </>
            ) : (
              <>
                {block.content.title && <p className="font-bold text-lg">{block.content.title}</p>}
                <p>{block.content.text}</p>
              </>
            )}
          </div>
        </div>
      );
    }

    case "cards": {
      const colClass: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
      return (
        <div style={style}>
          <div className={`grid grid-cols-1 md:${colClass[block.content.columns || 3]} gap-4`}>
            {(block.content.cards || []).map((card: any, i: number) => (
              <Card key={i} className={block.content.variant === "gradient" ? "gradient-primary text-primary-foreground" : "shadow-card"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
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
                    <p className="text-sm opacity-90">{card.text}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {isEditing && (
            <button
              className="text-xs text-primary hover:underline mt-2"
              onClick={() => updateContent({ cards: [...block.content.cards, { title: "", text: "" }] })}
            >
              + כרטיס
            </button>
          )}
        </div>
      );
    }

    case "divider":
      return <hr className="border-t-2 border-border my-4" style={{ margin: block.style?.margin }} />;

    case "embed":
      return (
        <div style={style}>
          {isEditing ? (
            <input
              className="w-full border rounded-lg p-3 bg-background"
              value={block.content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="הדבק קישור (YouTube, Twitter...)"
              dir="ltr"
            />
          ) : block.content.url ? (
            <iframe src={block.content.url} className="w-full rounded-lg" style={{ height: 400 }} allowFullScreen />
          ) : null}
        </div>
      );

    default:
      return <div className="text-muted-foreground p-4">בלוק לא מוכר: {block.type}</div>;
  }
}
