import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface SearchInputProps {
  wrapperClass?: string;
  inputProps?: React.ComponentProps<typeof Input>;
}


export const SearchInput = ({wrapperClass, inputProps}: SearchInputProps) => {
  return (
    <div className={`relative flex-1 ${wrapperClass}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
          placeholder="Search tags..." 
          className="pl-9 bg-background"
          {...inputProps}
      />
  </div>
  )
};