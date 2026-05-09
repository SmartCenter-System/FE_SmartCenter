
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface InfoStudentFormProps {
	fullName: string;
	email: string;
	phone: string;
	onFullNameChange: (value: string) => void;
	onEmailChange: (value: string) => void;
	onPhoneChange: (value: string) => void;
}

export default function InfoStudentForm({
	fullName,
	email,
	phone,
	onFullNameChange,
	onEmailChange,
	onPhoneChange,
}: InfoStudentFormProps) {
	return (
		<Card className="border-none shadow-sm">
			<CardHeader>
				<CardTitle className="text-xl">Thông tin học viên</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="fullName">Họ và tên</Label>
						<Input
							id="fullName"
							placeholder="VD: Nguyễn Văn A"
							value={fullName}
							onChange={(e) => onFullNameChange(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Số điện thoại</Label>
						<Input
							id="phone"
							placeholder="Chưa cập nhật"
							value={phone}
							onChange={(e) => onPhoneChange(e.target.value)}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Email nhận tài khoản học</Label>
					<Input
						id="email"
						type="email"
						placeholder="VD: email@example.com"
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
					/>
				</div>

				
			</CardContent>
		</Card>
	);
}
