import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { 
  Search,
  Lock, 
  Unlock, 
  MoreHorizontal, 
  ShieldAlert, 
  UserPlus,
  RotateCw,
  Trash2,
  Loader2,
  Eye,
  Users,
  GraduationCap,
  UserCheck,
  UserCog
} from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/shared/components/ui/pagination";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { userService, type UserRole, type UserStatus, type User } from "@/features/users/services";

interface CreateUserFormValues {
  fullName: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  bio?: string;
  expertise?: string;
}

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  
  // UI States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfirmLockOpen, setIsConfirmLockOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search/Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");

  // Pagination states
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  const { userId: currentUserId, accessToken } = useAuthStore();

  // react-hook-form for creation
  const createForm = useForm<CreateUserFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      role: "STAFF",
      password: "",
      phone: "",
      bio: "",
      expertise: "",
    }
  });

  // 1. Lấy toàn bộ danh sách để đảm bảo dữ liệu thống kê và bảng luôn khớp nhau
  const { data: allUsersData, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["users", "admin-list"],
    queryFn: () => userService.getUsers({ limit: 1000 }),
    enabled: !!accessToken,
  });

  const allUsers = allUsersData?.data || [];

  // 2. Logic Lọc và Phân trang tại FE để khắc phục lỗi Filter của BE
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = !search || 
      user.fullName.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalFiltered = filteredUsers.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  
  // Dữ liệu hiển thị trên trang hiện tại
  const paginatedUsers = filteredUsers.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const stats = [
    { 
      label: "Tổng người dùng", 
      value: allUsersData?.total || allUsers.length, 
      icon: Users, 
      color: "bg-blue-500", 
      loading: !allUsersData 
    },
    { 
      label: "Học viên", 
      value: allUsers.filter(u => u.role === "STUDENT").length, 
      icon: GraduationCap, 
      color: "bg-green-500", 
      loading: !allUsersData 
    },
    { 
      label: "Giảng viên", 
      value: allUsers.filter(u => u.role === "LECTURER").length, 
      icon: UserCheck, 
      color: "bg-purple-500", 
      loading: !allUsersData 
    },
    { 
      label: "Nhân viên", 
      value: allUsers.filter(u => u.role === "STAFF").length, 
      icon: UserCog, 
      color: "bg-orange-500", 
      loading: !allUsersData 
    },
  ];



  // 1.5 Fetch Full User Detail when selected
  const { data: fullUserData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["users", "detail", selectedUser?.id],
    queryFn: () => selectedUser ? userService.getById(selectedUser.id) : null,
    enabled: isDetailOpen && !!selectedUser?.id, // Chỉ gọi khi modal mở và có ID
  });

  const displayUser = fullUserData || selectedUser;

  // 2. Mutations
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: UserStatus }) => 
      userService.toggleUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Đã cập nhật trạng thái");
      setIsConfirmLockOpen(false);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Đã xóa người dùng");
      setIsConfirmDeleteOpen(false);
    }
  });

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => userService.createInternalUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Tạo tài khoản thành công");
      setIsCreateDialogOpen(false);
      createForm.reset();
    }
  });

  const onSubmitCreate = (data: CreateUserFormValues) => {
    createUserMutation.mutate(data);
  };

  const confirmToggleStatus = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    toggleStatusMutation.mutate({ id: selectedUser.id, status: newStatus });
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  const statusBadge = (status: UserStatus) => {
    return status === "ACTIVE" 
      ? <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors border-none">Đang hoạt động</Badge>
      : <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors border-none">Bị khóa</Badge>;
  };

  const roleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return <Badge className="bg-purple-600 border-none">Admin</Badge>;
      case "LECTURER": return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Giảng viên</Badge>;
      case "STAFF": return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Nhân viên</Badge>;
      default: return <Badge variant="outline" className="text-gray-600 border-gray-200">Học sinh</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h1>
          <p className="text-muted-foreground mt-1">Danh sách tất cả tài khoản trong hệ thống và các công cụ quản trị.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              refetch();
              queryClient.invalidateQueries({ queryKey: ["users"] });
            }} 
            className="rounded-xl border-2 hover:bg-muted transition-all"
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="rounded-xl bg-primary hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Tạo tài khoản
          </Button>
        </div>
      </div>

      {/* Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm bg-card hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                {s.loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="text-3xl font-bold">{s.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-2xl ${s.color} bg-opacity-10 text-${s.color.split('-')[1]}-600`}>
                <s.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background p-4 rounded-2xl border-2 border-muted/50 shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            className="pl-10 h-11 rounded-xl border-none bg-muted/30 focus-visible:ring-primary transition-all" 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(1);
            }}
          />
        </div>
        <Select value={roleFilter} onValueChange={(val) => {
          setRoleFilter(val as UserRole | "ALL");
          setPageIndex(1);
        }}>
          <SelectTrigger className="h-11 rounded-xl border-none bg-muted/30">
            <SelectValue placeholder="Tất cả vai trò" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tất cả vai trò</SelectItem>
            <SelectItem value="STUDENT">Học sinh</SelectItem>
            <SelectItem value="LECTURER">Giảng viên</SelectItem>
            <SelectItem value="STAFF">Nhân viên</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(val) => {
          setStatusFilter(val as UserStatus | "ALL");
          setPageIndex(1);
        }}>
          <SelectTrigger className="h-11 rounded-xl border-none bg-muted/30">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
            <SelectItem value="LOCKED">Bị khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border-2 border-muted/50 overflow-hidden bg-background shadow-xl shadow-primary/5 transition-all hover:border-primary/20">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[300px] font-bold">Thành viên</TableHead>
              <TableHead className="font-bold">Vai trò</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="font-bold">Ngày tạo</TableHead>
              <TableHead className="text-right font-bold pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse border-muted/30">
                  <TableCell><div className="h-12 w-full bg-muted rounded-lg" /></TableCell>
                  <TableCell><div className="h-6 w-20 bg-muted rounded-full" /></TableCell>
                  <TableCell><div className="h-6 w-24 bg-muted rounded-full" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted rounded-lg" /></TableCell>
                  <TableCell><div className="h-8 w-8 bg-muted rounded-full ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <ShieldAlert className="h-12 w-12 opacity-20" />
                    <p className="text-lg font-medium">Không tìm thấy người dùng nào</p>
                    <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user: User) => (
                <TableRow key={user.id} className="group hover:bg-muted/30 transition-all border-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.fullName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">{user.fullName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{roleBadge(user.role)}</TableCell>
                  <TableCell>{statusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl border-muted/50">
                        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 uppercase font-bold tracking-wider">Tài khoản</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="rounded-lg gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-muted/50" />
                        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 uppercase font-bold tracking-wider">Hành động</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className={`rounded-lg gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary ${user.status === "ACTIVE" ? "text-red-600 focus:text-red-600" : "text-green-600 focus:text-green-600"}`}
                          disabled={user.id === currentUserId}
                          onClick={() => {
                            if (user.id === currentUserId) return;
                            setSelectedUser(user);
                            setIsConfirmLockOpen(true);
                          }}
                        >
                          {user.status === "ACTIVE" ? <><Lock className="h-4 w-4" /> Khóa tài khoản</> : <><Unlock className="h-4 w-4" /> Mở khóa tài khoản</>}
                          {user.id === currentUserId && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded ml-auto">Bạn</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-lg gap-2 text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
                          disabled={user.id === currentUserId}
                          onClick={() => {
                            if (user.id === currentUserId) return;
                            setSelectedUser(user);
                            setIsConfirmDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Xóa tài khoản
                          {user.id === currentUserId && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded ml-auto">Bạn</span>}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination UI */}
      {!isLoading && totalFiltered > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2">
          <p className="text-sm text-muted-foreground">
            Hiển thị <b>{paginatedUsers.length}</b> trong tổng số <b>{totalFiltered}</b> người dùng
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                  className={pageIndex === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  text="Trước"
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                // Only show current, first, last, and neighbors
                if (p === 1 || p === totalPages || (p >= pageIndex - 1 && p <= pageIndex + 1)) {
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink 
                        onClick={() => setPageIndex(p)} 
                        isActive={pageIndex === p}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (p === pageIndex - 2 || p === pageIndex + 2) {
                  return <PaginationEllipsis key={p} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                  className={pageIndex === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  text="Sau"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary/10 px-6 py-8">
            <DialogTitle className="text-2xl font-bold text-primary">Tạo tài khoản mới</DialogTitle>
            <DialogDescription className="text-primary/70 mt-1">Cấp tài khoản nội bộ cho Giảng viên hoặc Nhân viên.</DialogDescription>
          </div>
          <form onSubmit={createForm.handleSubmit(onSubmitCreate)}>
            <div className="grid gap-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-bold ml-1">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    {...createForm.register("fullName")}
                    placeholder="Nguyễn Văn A" 
                    className="rounded-xl border-2 focus-visible:ring-primary h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-bold ml-1">Vai trò</Label>
                  <Select 
                    value={createForm.watch("role")} 
                    onValueChange={(val) => createForm.setValue("role", val as UserRole)}
                  >
                    <SelectTrigger className="rounded-xl border-2 h-11">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="STAFF">Nhân viên</SelectItem>
                      <SelectItem value="LECTURER">Giảng viên</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold ml-1">Email</Label>
                <Input 
                  id="email" 
                  {...createForm.register("email")}
                  type="email" 
                  placeholder="name@example.com" 
                  className="rounded-xl border-2 focus-visible:ring-primary h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold ml-1">Mật khẩu ban đầu</Label>
                <Input 
                  id="password" 
                  {...createForm.register("password")}
                  type="password" 
                  placeholder="••••••••" 
                  className="rounded-xl border-2 focus-visible:ring-primary h-11"
                />
                <p className="text-[10px] text-muted-foreground ml-1">* Mật khẩu mặc định nếu để trống: 123456aA@</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold ml-1">Số điện thoại</Label>
                <Input 
                  id="phone" 
                  {...createForm.register("phone")}
                  placeholder="0123 456 789" 
                  className="rounded-xl border-2 h-11"
                />
              </div>
            </div>
            <DialogFooter className="p-6 bg-muted/30">
              <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">Hủy</Button>
              <Button 
                type="submit" 
                disabled={createUserMutation.isPending}
                className="rounded-xl px-8 bg-primary hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận tạo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lock Confirmation Dialog */}
      <Dialog open={isConfirmLockOpen} onOpenChange={setIsConfirmLockOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 border-none shadow-2xl">
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`p-4 rounded-full ${selectedUser?.status === "ACTIVE" ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {selectedUser?.status === "ACTIVE" ? <Lock className="h-8 w-8" /> : <Unlock className="h-8 w-8" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {selectedUser?.status === "ACTIVE" ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Bạn đang chuẩn bị {selectedUser?.status === "ACTIVE" ? "khóa" : "mở khóa"} tài khoản của <b>{selectedUser?.fullName}</b>.
                {selectedUser?.status === "ACTIVE" && " Người dùng này sẽ không thể đăng nhập vào hệ thống."}
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsConfirmLockOpen(false)} className="rounded-xl border-2">Quay lại</Button>
            <Button 
              variant={selectedUser?.status === "ACTIVE" ? "destructive" : "default"} 
              onClick={confirmToggleStatus}
              disabled={toggleStatusMutation.isPending}
              className="rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {toggleStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 border-none shadow-2xl">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-red-100 text-red-600">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Xóa tài khoản vĩnh viễn?</DialogTitle>
              <DialogDescription className="mt-2">
                Hành động này <b>không thể hoàn tác</b>. Mọi dữ liệu liên quan đến <b>{selectedUser?.fullName}</b> sẽ bị xóa khỏi hệ thống.
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)} className="rounded-xl border-2">Quay lại</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
              className="rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {deleteUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="relative h-32 bg-gradient-to-r from-primary to-primary-foreground">
            <div className="absolute -bottom-12 left-8 p-1 bg-background rounded-full">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={selectedUser?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {selectedUser?.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
            <div className="px-8 pt-16 pb-8 space-y-6">
            {isLoadingDetail ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 gap-4 bg-muted/30 p-4 rounded-2xl">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{displayUser?.fullName}</h3>
                    <p className="text-muted-foreground">{displayUser?.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {displayUser && roleBadge(displayUser.role)}
                    {displayUser && statusBadge(displayUser.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-sm bg-muted/30 p-4 rounded-2xl">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono">{displayUser?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span>{displayUser?.phone || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chuyên môn:</span>
                    <span>{displayUser?.expertise || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tham gia:</span>
                    <span>{displayUser && new Date(displayUser.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {displayUser?.bio && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Giới thiệu</h4>
                    <p className="text-sm italic text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-xl">
                      "{displayUser.bio}"
                    </p>
                  </div>
                )}
              </>
            )}

            <Button className="w-full rounded-xl h-11 border-2" variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng chi tiết
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
