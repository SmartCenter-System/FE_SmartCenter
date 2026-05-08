import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search,
  Lock, 
  Unlock, 
  MoreHorizontal, 
  ShieldAlert, 
  UserPlus 
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { userService, type UserRole, type UserStatus, type User } from "@/features/users/services";

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");

  // Dialog States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfirmLockOpen, setIsConfirmLockOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form States for Create
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("STAFF");

  // Queries & Mutations
  const { data, isLoading } = useQuery({
    queryKey: ["users", { search, roleFilter, statusFilter }],
    queryFn: () => userService.getUsers({
      search,
      role: roleFilter,
      status: statusFilter
    })
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: UserStatus }) => userService.toggleUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Cập nhật trạng thái tài khoản thành công!");
      setIsConfirmLockOpen(false);
    }
  });

  const createUserMutation = useMutation({
    mutationFn: () => userService.createInternalUser({ fullName: newFullName, email: newEmail, role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Tạo tài khoản nội bộ thành công!");
      setIsCreateDialogOpen(false);
      setNewFullName("");
      setNewEmail("");
    }
  });

  // Helpers
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return <Badge className="bg-red-500">Admin</Badge>;
      case "STAFF": return <Badge className="bg-orange-500">Staff</Badge>;
      case "LECTURER": return <Badge className="bg-purple-500">Lecturer</Badge>;
      case "STUDENT": return <Badge className="bg-blue-500">Student</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    return status === "ACTIVE" 
      ? <Badge variant="default" className="bg-green-500 hover:bg-green-600">Hoạt động</Badge>
      : <Badge variant="destructive">Đã Khóa</Badge>;
  };

  // Handlers
  const handleLockUnlockClick = (user: User) => {
    setSelectedUser(user);
    setIsConfirmLockOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    toggleStatusMutation.mutate({ id: selectedUser.id, status: newStatus });
  };

  const handleCreateUser = () => {
    if (!newFullName || !newEmail) {
      toast.error("Vui lòng điền đầy đủ Tên và Email!");
      return;
    }
    createUserMutation.mutate();
  };

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h1>
          <p className="text-muted-foreground mt-1">
            Quản trị viên, Nhân viên, Giảng viên và Học viên hệ thống.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Thêm tài khoản nội bộ
        </Button>
      </div>

      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm theo Tên hoặc Email..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="w-[180px]">
              <Select value={roleFilter} onValueChange={(val: any) => setRoleFilter(val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="LECTURER">Lecturer</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="LOCKED">Đã Khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tài khoản</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="hidden md:table-cell">Ngày tham gia</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Không tìm thấy người dùng nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} 
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.fullName}</span>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {}}>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className={user.status === "ACTIVE" ? "text-red-600 focus:text-red-600 focus:bg-red-50" : "text-green-600 focus:text-green-600 focus:bg-green-50"}
                          onClick={() => handleLockUnlockClick(user)}
                        >
                          {user.status === "ACTIVE" ? (
                            <><Lock className="mr-2 h-4 w-4" /> Khóa tài khoản</>
                          ) : (
                            <><Unlock className="mr-2 h-4 w-4" /> Mở khóa tài khoản</>
                          )}
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

      {/* Dialog Thêm Tài Khoản Nội Bộ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản nội bộ</DialogTitle>
            <DialogDescription>
              Tạo tài khoản cho Giảng viên hoặc Nhân viên tư vấn mới. Hệ thống sẽ gửi email chứa mật khẩu đăng nhập tạm thời.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Họ và Tên</Label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={newFullName} 
                onChange={e => setNewFullName(e.target.value)}
                placeholder="Nguyễn Văn A" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input 
                id="email" 
                type="email"
                className="col-span-3" 
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)}
                placeholder="email@smartcenter.edu.vn" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Vai trò</Label>
              <div className="col-span-3">
                <Select value={newRole} onValueChange={(v: UserRole) => setNewRole(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Nhân viên (Staff)</SelectItem>
                    <SelectItem value="LECTURER">Giảng viên (Lecturer)</SelectItem>
                    <SelectItem value="ADMIN">Quản trị viên (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateUser} disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? "Đang xử lý..." : "Tạo tài khoản"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác nhận Khóa Tài khoản */}
      <Dialog open={isConfirmLockOpen} onOpenChange={setIsConfirmLockOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" /> 
              {selectedUser?.status === "ACTIVE" ? "Cảnh báo Khóa tài khoản" : "Xác nhận Mở khóa"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedUser?.status === "ACTIVE" ? (
              <p>
                Bạn có chắc chắn muốn khóa tài khoản <strong>{selectedUser?.email}</strong>? 
                Người dùng này sẽ bị đăng xuất ngay lập tức và không thể truy cập vào hệ thống.
              </p>
            ) : (
              <p>
                Xác nhận mở khóa cho tài khoản <strong>{selectedUser?.email}</strong>?
                Người dùng sẽ có thể đăng nhập lại bình thường.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmLockOpen(false)}>Hủy bỏ</Button>
            <Button 
              variant={selectedUser?.status === "ACTIVE" ? "destructive" : "default"} 
              onClick={confirmToggleStatus}
              disabled={toggleStatusMutation.isPending}
            >
              {toggleStatusMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
