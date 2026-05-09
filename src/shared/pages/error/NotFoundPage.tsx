import { Link, useNavigate } from "react-router-dom";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-8">
          <SearchX className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Không tìm thấy trang
        </h2>
        
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể trang đã bị xóa, đổi tên hoặc tạm thời không truy cập được.
        </p>
        
        <div className="mt-8 flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button asChild className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
