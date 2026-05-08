import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import type { CourseType } from "../type";

interface CourseFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  format: CourseType | "ALL";
  onFormatChange: (val: CourseType | "ALL") => void;
  onApply?: (filters: { categories: string[]; level?: string; prices: string[] }) => void;
}

const CATEGORIES = [
  "Toán học",
  "Ngữ văn",
  "Vật lý",
  "Hóa học",
  "Tiếng Anh",
  "Lịch sử & Địa lý",
];

export function CourseFilter({ search, onSearchChange, format, onFormatChange, onApply }: CourseFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const togglePrice = (p: string) => {
    setSelectedPrices((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const apply = () => {
    if (onApply) onApply({ categories: selectedCategories, level: selectedLevel, prices: selectedPrices });
  };

  return (
    <div className="w-full max-w-xs bg-card p-4 rounded-lg shadow-sm border border-border">
      <div className="space-y-3">
        <div>
          <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hình thức</label>
          <select
            value={String(format)}
            onChange={(e) => onFormatChange(e.target.value === "ALL" ? "ALL" : (Number(e.target.value) as CourseType))}
            className="w-full rounded-md border border-border p-2 bg-background"
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
              <label key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggleCategory(c)}
                  className="accent-primary"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Cấp độ</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {['Lớp 10', 'Lớp 11', 'Lớp 12'].map((lvl) => (
              <label key={lvl} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="level"
                  checked={selectedLevel === lvl}
                  onChange={() => setSelectedLevel(lvl)}
                  className="accent-primary"
                />
                <span className="text-sm text-muted-foreground">{lvl}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Học phí</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {['Miễn phí', 'Dưới 500k', 'Trên 500k'].map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedPrices.includes(p)} onChange={() => togglePrice(p)} className="accent-primary" />
                <span className="text-sm text-muted-foreground">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button className="w-full" onClick={apply}>
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}
