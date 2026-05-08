import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";

interface PublicCourseFilterProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  mode: string;
  onModeChange: (val: string) => void;
  onApply?: () => void;
  onReset?: () => void;
}

const CATEGORIES = [
  "Toán học",
  "Ngữ văn",
  "Vật lý",
  "Hóa học",
  "Tiếng Anh",
  "Lịch sử & Địa lý",
];

export function PublicCourseFilter({
  searchInput,
  onSearchChange,
  mode,
  onModeChange,
  onApply,
  onReset,
}: PublicCourseFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const togglePrice = (p: string) => {
    setSelectedPrices((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const apply = () => {
    if (onApply) onApply();
  };

  const reset = () => {
    setSelectedCategories([]);
    setSelectedLevel(undefined);
    setSelectedPrices([]);
    if (onReset) onReset();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tìm kiếm</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tên khóa học..."
            className="pl-9 bg-background/50"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hình thức học</label>
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          className="w-full rounded-md border border-border p-2 bg-background/50 text-sm"
        >
          <option value="ALL">Tất cả hình thức</option>
          <option value="1">Online</option>
          <option value="2">Offline</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Danh mục</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => toggleCategory(c)}
                className="accent-primary"
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Cấp độ</h3>
        <div className="flex flex-col gap-2">
          {["Lớp 10", "Lớp 11", "Lớp 12"].map((lvl) => (
            <label
              key={lvl}
              className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
            >
              <input
                type="radio"
                name="level"
                checked={selectedLevel === lvl}
                onChange={() => setSelectedLevel(lvl)}
                className="accent-primary"
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Học phí</h3>
        <div className="flex flex-col gap-2">
          {["Miễn phí", "Dưới 500k", "Trên 500k"].map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedPrices.includes(p)}
                onChange={() => togglePrice(p)}
                className="accent-primary"
              />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={apply}>
          Áp dụng
        </Button>
        <Button variant="outline" className="flex-1" onClick={reset}>
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
}
