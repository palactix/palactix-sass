import { ReactNode } from "react";

interface BlogContentProps {
  content: ReactNode;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <article
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10
        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
        prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-foreground prose-strong:font-bold
        prose-em:text-foreground prose-em:italic
        prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
        prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
        prose-li:text-foreground prose-li:my-2 prose-li:leading-relaxed
        prose-table:w-full prose-table:border-collapse
        prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left
        prose-td:border prose-td:border-border prose-td:p-2
        prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6
        prose-hr:border-border prose-hr:my-8"
    >
      {content}
    </article>
  );
}