import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import type { CourseFormat } from "../type";

interface CourseFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  format: CourseFormat | "ALL";
  onFormatChange: (val: CourseFormat | "ALL") => void;
}

export function CourseFilter({ search, onSearchChange, format, onFormatChange }: CourseFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-full sm:w-72">
        <Input placeholder="Tìm kiếm tên khóa học..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <div className="w-full sm:w-48">
        <Select value={format} onValueChange={(val) => onFormatChange(val as CourseFormat | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Hình thức học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả hình thức</SelectItem>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
