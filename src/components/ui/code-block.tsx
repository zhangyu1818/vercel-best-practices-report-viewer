import { useEffect, useState, useTransition, memo } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { cn } from "@/lib/utils";

// Singleton to reuse the highlighter instance
let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["dark-plus", "light-plus"],
      langs: ["tsx", "typescript", "javascript", "jsx", "json", "html", "css"],
    });
  }
  return highlighterPromise;
}

interface CodeBlockProps {
  code: string;
  lang?: string;
  isDark?: boolean;
  className?: string;
}

export const CodeBlock = memo(function CodeBlock({
  code,
  lang = "tsx",
  isDark = false,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const highlighter = await getHighlighter();
        if (!mounted) return;

        const theme = isDark ? "dark-plus" : "light-plus";
        const result = highlighter.codeToHtml(code, {
          lang,
          theme,
        });

        if (mounted) {
          startTransition(() => {
            setHtml(result);
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (mounted) setIsLoading(false);
      }
    }

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, lang, isDark]);

  if (isLoading) {
    return (
      <div className={cn("font-mono text-sm p-4 opacity-50", className)}>
        <pre className="whitespace-pre-wrap break-all">{code}</pre>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "[&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:p-4 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:whitespace-pre-wrap [&>pre]:break-all",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
