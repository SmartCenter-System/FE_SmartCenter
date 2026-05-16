import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export interface ConsultationRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseInterest: string;
  courseTier?: string;
  requestDate: string;
  requestTime: string;
  status: "Chờ xử lý" | "Đang tư vấn" | "Đã tư vấn" | "Từ chối";
}

interface ConsultationTableProps {
  data: ConsultationRequest[];
  processingId?: string | null;
  onStatusChange?: (consultation: ConsultationRequest, status: ConsultationRequest["status"]) => void;
}

export function ConsultationTable({
  data,
  processingId,
  onStatusChange,
}: ConsultationTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Đang tư vấn":
        return "bg-blue-100 text-blue-800";
      case "Đã tư vấn":
        return "bg-green-100 text-green-800";
      case "Từ chối":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status;
  };

  const canChangeStatus = (status: ConsultationRequest["status"]) =>
    status === "Chờ xử lý" || status === "Đang tư vấn";

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            <TableHead className="font-semibold text-foreground">
              HỌC VIÊN
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              MÔN HỌC QUAN TÂM
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              NGÀY YÊU CẦU
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              TRẠNG THÁI
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((consultation) => (
            <TableRow key={consultation.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  {consultation.studentAvatar ? (
                    <img
                      src={consultation.studentAvatar}
                      alt={consultation.studentName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {consultation.studentName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {consultation.studentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {consultation.studentEmail}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">
                    {consultation.courseInterest}
                  </p>
                  {consultation.courseTier && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {consultation.courseTier}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="text-foreground font-medium">
                    {consultation.requestDate}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {consultation.requestTime}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {canChangeStatus(consultation.status) && onStatusChange ? (
                  <Select
                    value={consultation.status}
                    disabled={processingId === consultation.id}
                    onValueChange={(status: ConsultationRequest["status"]) =>
                      onStatusChange(consultation, status)
                    }
                  >
                    <SelectTrigger className="h-9 w-[150px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chờ xử lý" className="text-xs text-yellow-700">
                        Chờ xử lý
                      </SelectItem>
                      <SelectItem value="Đang tư vấn" className="text-xs text-blue-700">
                        Đang tư vấn
                      </SelectItem>
                      <SelectItem value="Đã tư vấn" className="text-xs text-green-700">
                        Đã tư vấn
                      </SelectItem>
                      <SelectItem value="Từ chối" className="text-xs text-red-700">
                        Từ chối
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(consultation.status)}`}
                  >
                    {getStatusLabel(consultation.status)}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Không có yêu cầu tư vấn</p>
        </div>
      )}
    </div>
  );
}
