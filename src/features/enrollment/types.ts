export interface Enrollment {
  courseId?: string;
  courseName: string;
  basePrice: number;
  courseType: number;
  imgUrl?: string | null;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
  academicYear?: number;
  enrollmentDate: string;
  status: number;
  progress?: number;
}
