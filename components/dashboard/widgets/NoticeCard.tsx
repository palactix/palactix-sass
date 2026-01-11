interface NoticeCardProps {
  children: React.ReactNode;
}

export function NoticeCard({ children }: NoticeCardProps) {
  return (
    <div className="text-center py-6 px-4 bg-muted/30 rounded-lg border border-dashed">
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
