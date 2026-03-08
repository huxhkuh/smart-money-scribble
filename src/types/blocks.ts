export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "columns"
  | "table"
  | "callout"
  | "cards"
  | "divider"
  | "embed"
  | "video"
  | "code"
  | "quote";

export interface BlockStyle {
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  shadow?: string;
  textAlign?: "right" | "center" | "left";
}

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  style?: BlockStyle;
}

export interface TextBlockContent {
  html: string;
  level?: 1 | 2 | 3; // for headings
}

export interface ImageBlockContent {
  url: string;
  alt: string;
  caption?: string;
  width?: "full" | "half" | "third";
  align?: "right" | "center" | "left";
}

export interface ColumnsBlockContent {
  columns: { blocks: Block[] }[];
}

export interface TableBlockContent {
  headers: string[];
  rows: string[][];
}

export interface CalloutBlockContent {
  type: "info" | "warning" | "success" | "error";
  title: string;
  text: string;
  icon?: string;
}

export interface CardItem {
  icon?: string;
  title: string;
  text: string;
}

export interface CardsBlockContent {
  cards: CardItem[];
  columns: 2 | 3 | 4;
  variant: "default" | "bordered" | "gradient";
}

export interface EmbedBlockContent {
  url: string;
  caption?: string;
}

export interface VideoBlockContent {
  url: string;
  caption?: string;
}

export interface CodeBlockContent {
  code: string;
  language: string;
}

export interface QuoteBlockContent {
  text: string;
  author?: string;
}

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "text":
      return { id, type, content: { html: "" } };
    case "heading":
      return { id, type, content: { html: "", level: 2 } };
    case "image":
      return { id, type, content: { url: "", alt: "", width: "full" } };
    case "columns":
      return { id, type, content: { columns: [{ blocks: [] }, { blocks: [] }] } };
    case "table":
      return { id, type, content: { headers: ["עמודה 1", "עמודה 2", "עמודה 3"], rows: [["", "", ""]] } };
    case "callout":
      return { id, type, content: { type: "info", title: "", text: "" } };
    case "cards":
      return { id, type, content: { cards: [{ title: "", text: "" }], columns: 3, variant: "default" } };
    case "divider":
      return { id, type, content: {} };
    case "embed":
      return { id, type, content: { url: "" } };
    case "video":
      return { id, type, content: { url: "", caption: "" } };
    case "code":
      return { id, type, content: { code: "", language: "javascript" } };
    case "quote":
      return { id, type, content: { text: "", author: "" } };
    default:
      return { id, type: "text", content: { html: "" } };
  }
}
