import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";

export interface ConsultationRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseInterest: string;
  courseTier?: string;
  requestDate: string;
  requestTime: string;
  status: "Chờ xử lý" | "Chấp nhận" | "Từ chối";
}

interface ConsultationTableProps {
  data: ConsultationRequest[];
}

export function ConsultationTable({
  data,
}: ConsultationTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Chấp nhận":
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
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(consultation.status)}`}
                >
                  {getStatusLabel(consultation.status)}
                </Badge>
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
