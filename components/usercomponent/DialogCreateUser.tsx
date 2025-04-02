"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { dataRole } from "@/lib/dataAdmin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type RegisterForm = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    phoneNumber: string;
    address: string;
    role: string;
}

// Định nghĩa key là một trong các thuộc tính của RegisterForm
type RegisterFormKey = keyof RegisterForm;

type KeyForm = {
    key: RegisterFormKey; // Sử dụng RegisterFormKey thay vì string
    label: string;
    type: string
};

const RegisterDialog: React.FC = () => {
    const [formData, setFormData] = useState<RegisterForm>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
        role: "USER"
    });

    const keyForm: KeyForm[] = [
        { key: "firstName", label: "Họ", type: "text" },
        { key: "lastName", label: "Tên", type: "text" },
        { key: "email", label: "Email", type: "email" },
        { key: "password", label: "Mật khẩu", type: "password" },
        { key: "phoneNumber", label: "Số dt", type: "text" },
        { key: "address", label: "Địa chỉ", type: "text" },
        { key: "role", label: "Vai trò", type: "text" }
    ];
    const roleKey = dataRole;
    const handleChange = (key: RegisterFormKey, value: any) => {
        setFormData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Plus /> Tạo tài khoản</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản</DialogTitle>
                    <DialogDescription>
                        Tạo và quản lí tài khoản cho người dùng trong hệ thống.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {keyForm.map((item, index) => {
                            if (item.key != "role") {
                                return (
                                    <div key={index} className="grid grid-cols-4 items-center gap-2">
                                        <Label htmlFor={item.key} className="text-right">
                                            {item.label}
                                        </Label>
                                        <Input
                                            required
                                            id={item.key}
                                            type={item.type}
                                            value={formData[item.key]}
                                            onChange={e => handleChange(item.key, e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index} className="grid grid-cols-4 items-center gap-2 ">
                                        <Label htmlFor="framework">{item.label}</Label>
                                        <Select value={formData.role} onValueChange={e => handleChange(item.key, e)}>
                                            <SelectTrigger id="framework">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {roleKey.map((childItem, childIndex) => (
                                                    <SelectItem key={childIndex} value={childItem.value}>{childItem.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    );
};

export default RegisterDialog;