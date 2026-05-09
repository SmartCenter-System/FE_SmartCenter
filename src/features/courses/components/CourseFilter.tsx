import { Input } from "@/shared/components/ui/input";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import type { CourseType } from "../type";

interface CourseFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  format: CourseType | "ALL";
  onFormatChange: (val: CourseType | "ALL") => void;
}

export function CourseFilter({ search, onSearchChange, format, onFormatChange }: CourseFilterProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-5 bg-card border-b">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary font-bold" />
        <Input 
          placeholder="Tìm kiếm tên khóa học, mã ID..." 
          value={search} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30 h-11"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-full md:w-[200px]">
          <Select 
            value={String(format)} 
            onValueChange={(val) => onFormatChange(val === "ALL" ? "ALL" : (Number(val) as CourseType))}
          >
            <SelectTrigger className="bg-muted/30 border-none h-11 focus:ring-1 focus:ring-primary/30">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Hình thức học" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả hình thức</SelectItem>
              <SelectItem value="1">Học Online</SelectItem>
              <SelectItem value="2">Tại trung tâm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center border rounded-lg p-1 bg-muted/30 h-11">
          <button className="p-1.5 rounded-md bg-white shadow-sm text-primary">
            <List className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
