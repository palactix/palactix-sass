import { Card } from "@/components/ui/card";

export const AccountLoader = ({count}: {count?: number}) => {
  const loaderCount = count || 3;
  const accountPlaceholderData = new Array(loaderCount).fill(null);
  return accountPlaceholderData.map((_, index) => LoaderCard(index));
}



const LoaderCard = (index: number) => {
  return (
    <Card
      key={index}
      className={`p-4 cursor-pointer transition-all border-2 border-border hover:border-primary/50`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
            <div className="animate-pulse bg-muted w-full h-full" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background bg-background flex items-center justify-center">
            <div className="animate-pulse bg-muted w-3 h-3 rounded-full" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate animate-pulse"></p>
          <p className="text-xs text-muted-foreground animate-pulse"></p>
        </div>
      </div>
    </Card>  
   )
  }