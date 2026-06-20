"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, User, GraduationCap, Plus, Trash2, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/types";

type Message = { role: "user" | "assistant"; content: string };

type ChatSummary = { id: string; title: string; updatedAt: string };

type MentorLabels = {
  title: string;
  subtitle: string;
  welcome: string;
  placeholder: string;
  send: string;
  thinking: string;
  error: string;
  limitError: string;
  newChat: string;
  history: string;
  noChats: string;
  deleteChat: string;
  topics: {
    grammar: string;
    ielts: string;
    vocabulary: string;
    tenses: string;
  };
  topicPrompts: {
    grammar: string;
    ielts: string;
    vocabulary: string;
    tenses: string;
  };
};

type Props = {
  labels: MentorLabels;
  locale: Locale;
};

function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return "";

  let parts: (string | React.JSX.Element)[] = [text];

  // 1. Parse links: [text](url)
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const result: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        result.push(part.substring(lastIndex, match.index));
      }
      result.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline font-medium hover:text-primary/80 transition-colors"
        >
          {match[1]}
        </a>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    return result;
  });

  // 2. Parse inline code: `code`
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const regex = /`([^`]+)`/g;
    const result: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        result.push(part.substring(lastIndex, match.index));
      }
      result.push(
        <code
          key={`code-${match.index}`}
          className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs border border-primary/10 font-semibold"
        >
          {match[1]}
        </code>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    return result;
  });

  // 3. Parse bold: **text**
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const regex = /\*\*([^*]+)\*\*/g;
    const result: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        result.push(part.substring(lastIndex, match.index));
      }
      result.push(
        <strong key={`bold-${match.index}`} className="font-bold text-foreground">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    return result;
  });

  // 4. Parse italic: *text*
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const regex = /\*([^*]+)\*/g;
    const result: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        result.push(part.substring(lastIndex, match.index));
      }
      result.push(
        <em key={`em-${match.index}`} className="italic">
          {match[1]}
        </em>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    return result;
  });

  return <>{parts}</>;
}

function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  
  let currentBlockType: "paragraph" | "code" | "ul" | "ol" | "table" | null = null;
  let codeLines: string[] = [];
  let codeLang = "";
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let paragraphLines: string[] = [];

  const flushParagraph = (key: string | number) => {
    if (paragraphLines.length > 0) {
      blocks.push(
        <p key={`p-${key}`} className="mb-2 last:mb-0">
          {renderInlineMarkdown(paragraphLines.join("\n"))}
        </p>
      );
      paragraphLines = [];
    }
  };

  const flushList = (key: string | number) => {
    if (currentBlockType === "ul" && listItems.length > 0) {
      blocks.push(
        <ul key={`ul-${key}`} className="mb-3 list-disc pl-5 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    } else if (currentBlockType === "ol" && listItems.length > 0) {
      blocks.push(
        <ol key={`ol-${key}`} className="mb-3 list-decimal pl-5 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      listItems = [];
    }
  };

  const flushTable = (key: string | number) => {
    if (tableRows.length > 0) {
      const cleanRows = tableRows.filter(
        (row) => !row.every((cell) => cell.trim().match(/^-+$/))
      );

      if (cleanRows.length > 0) {
        const hasHeader = tableRows.length > 1 && tableRows[1].every(cell => cell.trim().match(/^-+$/));
        const headerRow = hasHeader ? cleanRows[0] : null;
        const bodyRows = hasHeader ? cleanRows.slice(1) : cleanRows;

        blocks.push(
          <div key={`table-wrapper-${key}`} className="my-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-left text-sm">
              {headerRow && (
                <thead className="bg-muted text-muted-foreground font-semibold">
                  <tr className="border-b border-border">
                    {headerRow.map((cell, idx) => (
                      <th key={idx} className="px-4 py-2">
                        {renderInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-border">
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/40 transition-colors odd:bg-card even:bg-muted/10">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-2">
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableRows = [];
    }
  };

  const flushCode = (key: string | number) => {
    if (codeLines.length > 0) {
      blocks.push(
        <div key={`code-${key}`} className="my-3 overflow-hidden rounded-lg border border-border">
          {codeLang && (
            <div className="bg-muted px-4 py-1.5 text-xs font-mono text-muted-foreground border-b border-border flex justify-between items-center">
              <span>{codeLang}</span>
            </div>
          )}
          <pre className="bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      codeLines = [];
      codeLang = "";
    }
  };

  const flushAll = (key: string | number) => {
    flushParagraph(key);
    flushList(key);
    flushTable(key);
    flushCode(key);
    currentBlockType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("```")) {
      if (currentBlockType === "code") {
        flushCode(i);
        currentBlockType = null;
      } else {
        flushAll(i);
        currentBlockType = "code";
        codeLang = trimmedLine.slice(3).trim();
      }
      continue;
    }

    if (currentBlockType === "code") {
      codeLines.push(line);
      continue;
    }

    if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|")) {
      if (currentBlockType !== "table") {
        flushAll(i);
        currentBlockType = "table";
      }
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      continue;
    }

    const ulMatch = line.match(/^(\s*)([-*])\s+(.*)/);
    if (ulMatch) {
      if (currentBlockType !== "ul") {
        flushAll(i);
        currentBlockType = "ul";
      }
      listItems.push(ulMatch[3]);
      continue;
    }

    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (currentBlockType !== "ol") {
        flushAll(i);
        currentBlockType = "ol";
      }
      listItems.push(olMatch[3]);
      continue;
    }

    if (trimmedLine.startsWith(">")) {
      flushAll(i);
      const content = line.replace(/^\s*>\s?/, "");
      blocks.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/2 pl-4 py-2 italic text-muted-foreground my-3 rounded-r-md">
          {renderInlineMarkdown(content)}
        </blockquote>
      );
      continue;
    }

    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      flushAll(i);
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const headerClasses = cn(
        "font-heading font-bold text-foreground mt-4 mb-2 tracking-tight",
        level === 1 && "text-xl border-b border-border pb-1",
        level === 2 && "text-lg",
        level === 3 && "text-base",
        level >= 4 && "text-sm"
      );
      const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements;
      blocks.push(
        <HeadingTag key={`h-${i}`} className={headerClasses}>
          {renderInlineMarkdown(content)}
        </HeadingTag>
      );
      continue;
    }

    if (trimmedLine === "") {
      flushAll(i);
      continue;
    }

    if (currentBlockType !== "paragraph" && currentBlockType !== null) {
      flushAll(i);
    }
    currentBlockType = "paragraph";
    paragraphLines.push(line);
  }

  flushAll(lines.length);

  return <div className="space-y-2">{blocks}</div>;
}

export function MentorChat({ labels, locale }: Props) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshChats = useCallback(async () => {
    const res = await fetch("/api/mentor/chats");
    if (!res.ok) return [];
    const data = await res.json();
    const list = (data.chats ?? []) as ChatSummary[];
    setChats(list);
    return list;
  }, []);

  const loadChat = useCallback(async (chatId: string) => {
    const res = await fetch(`/api/mentor/chats/${chatId}`);
    if (!res.ok) return;
    const data = await res.json();
    setActiveChatId(chatId);
    setMessages(
      (data.messages ?? []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    );
    setNotice(null);
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingChats(true);
      const list = await refreshChats();
      if (list.length > 0) await loadChat(list[0].id);
      setLoadingChats(false);
    })();
  }, [refreshChats, loadChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function startNewChat() {
    setActiveChatId(null);
    setMessages([]);
    setNotice(null);
    setError(null);
    setInput("");
  }

  async function deleteChat(chatId: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/mentor/chats/${chatId}`, { method: "DELETE" });
    const list = await refreshChats();
    if (activeChatId === chatId) {
      if (list.length > 0) await loadChat(list[0].id);
      else startNewChat();
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setNotice(null);
    setInput("");
    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
          history: messages,
          chatId: activeChatId ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 429 ? labels.limitError : labels.error);
        setMessages(messages);
        return;
      }
      if (data.chatId) setActiveChatId(data.chatId);
      if (data.notice) setNotice(String(data.notice));
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      await refreshChats();
    } catch {
      setError(labels.error);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  const topicKeys = ["grammar", "ielts", "vocabulary", "tenses"] as const;

  const sidebar = (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-background",
        sidebarOpen ? "w-52 xl:w-56" : "w-0 overflow-hidden border-r-0",
        "max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:z-20 max-lg:shadow-xl",
        !sidebarOpen && "max-lg:hidden"
      )}
    >
      <div className="flex items-center gap-2 border-b border-border p-3">
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={startNewChat}>
          <Plus className="h-4 w-4" />
          {labels.newChat}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>
      <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {labels.history}
      </p>
      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {loadingChats && (
          <p className="px-2 py-4 text-xs text-muted-foreground">{labels.thinking}</p>
        )}
        {!loadingChats && chats.length === 0 && (
          <p className="px-2 py-4 text-xs text-muted-foreground">{labels.noChats}</p>
        )}
        {chats.map((chat) => (
          <div
            key={chat.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              loadChat(chat.id);
              setSidebarOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                loadChat(chat.id);
                setSidebarOpen(false);
              }
            }}
            className={cn(
              "group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              activeChatId === chat.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="line-clamp-2 flex-1">{chat.title}</span>
            <button
              type="button"
              title={labels.deleteChat}
              onClick={(e) => deleteChat(chat.id, e)}
              className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <div className="relative flex h-full min-h-0 w-full">
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {sidebar}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-start gap-3 border-b border-border bg-background px-3 py-3 lg:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl font-bold">{labels.title}</h1>
            <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col bg-card">
          <div className="mx-auto w-full max-w-none flex-1 space-y-5 overflow-y-auto px-3 py-4 lg:px-5 lg:py-5 xl:px-6">
            {messages.length === 0 && (
              <div className="space-y-4 py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <p className="mx-auto max-w-2xl text-sm text-muted-foreground">{labels.welcome}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {topicKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => sendMessage(labels.topicPrompts[key])}
                      className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {labels.topics[key]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user" ? "bg-primary/20" : "bg-emerald-500/20"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3 text-sm leading-relaxed lg:text-base",
                    msg.role === "user"
                      ? "max-w-[82%] bg-primary text-primary-foreground"
                      : "min-w-0 max-w-[96%] flex-1 bg-muted text-foreground xl:max-w-[98%]"
                  )}
                >
                  {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                  <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  {labels.thinking}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {notice && (
            <p className="mx-3 mb-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400 lg:mx-5">
              {notice}
            </p>
          )}
          {error && <p className="px-3 text-xs text-destructive lg:px-5">{error}</p>}

          <form
            className="flex shrink-0 gap-3 border-t border-border bg-background px-3 py-3 lg:px-5 lg:py-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={labels.placeholder}
              disabled={loading}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-primary focus:ring-2 disabled:opacity-50 lg:text-base"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{labels.send}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
