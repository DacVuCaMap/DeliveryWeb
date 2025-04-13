"use client";
import Checkbox from "@/components/temp/form/input/Checkbox";
import Input from "@/components/temp/form/input/InputField";
import Label from "@/components/temp/form/Label";
import { registerUser } from "@/utils/api";
import { ChevronLeft, Eye, EyeClosed, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  name: string;
}
type RoleRegister = {
  value: string, name: string, description: string, src: string
}

export default function SignUpForm() {
  const roleList: RoleRegister[] = [
    { value: "USER", name: "Người dùng", description: "Trải nghiệm mua bán khắp mọi nơi", src: "/snapgoimg/userAvt.png" },
    { value: "PARTNER", name: "Người bán", description: "Trở thành đối tác cùng snapgo.vn", src: "/snapgoimg/shipperAvt.png" },
    { value: "SHIPPER", name: "Người giao hàng", description: "Vận chuyển những đơn hàng của chúng tôi", src: "/snapgoimg/partnerAvt.png" }];
  const [role, setRole] = useState<RoleRegister | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    name: ""
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn chặn reload trang
    console.log(formData);
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const formPost: RegisterForm = { ...formData, name: `${formData.lastName} ${formData.firstName}` };
      const data = await registerUser(formPost);
      console.log(data)
      if (data && data.success) {
        toast.success("Đăng ký thành công!");
        return;
      }
      else if (data && data.status === 409) {
        toast.error("Email đã tồn tại!");
        return;
      }
      else if (data && !data.success) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleClickRole = (item: RoleRegister) => {
    setRole(item);
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar pb-10">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/home"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {/* <ChevronLeftIcon /> */}
          <ChevronLeft />
          Trở lại trang chủ
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng Ký
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Đăng nhập bằng Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-white transition-colors bg-[#1877F2] rounded-lg px-7 hover:bg-[#165EB8]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 12.0611C22 6.50451 17.5228 2 12 2C6.47715 2 2 6.50451 2 12.0611C2 17.0833 5.65684 21.2453 10.4375 22V14.9694H7.89844V12.0611H10.4375V9.84443C10.4375 7.32271 11.9305 5.93056 14.2146 5.93056C15.3087 5.93056 16.4531 6.125 16.4531 6.125V8.5625H15.1895C13.9512 8.5625 13.5625 9.33333 13.5625 10.1243V12.0611H16.3359L15.8926 14.9694H13.5625V22C18.3432 21.2453 22 17.0833 22 12.0611Z"
                    fill="white"
                  />
                </svg>
                Đăng nhập bằng Facebook
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>


            {role ? (
              <div>
                <div className="mb-10">
                  <span>Tài khoản</span>
                  <div className="flex flex-row items-center space-x-2 border-b hover:bg-gray-300 py-2 px-4">
                    <div className="w-14 h-14 relative rounded-full overflow-hidden">
                      <Image
                        src={`${role.src}`}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col ml-4 items-start">
                      <span className="text-lg font-bold">{role.name}</span>
                      <span className="text-sm text-gray-500">{role.description}</span>
                    </div>
                  </div>
                  <div onClick={e => setRole(null)} className="flex flex-row gap-1 justify-center hover:underline cursor-pointer py-2 text-gray-500"><span>Đổi </span><RefreshCw size={20} /> </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <Label>
                          First Name<span className="text-error-500">*</span>
                        </Label>
                        <Input required type="text" name="firstName" placeholder="Enter your first name" value={formData.firstName} onChange={handleChange} />
                      </div>
                      <div className="sm:col-span-1">
                        <Label>
                          Last Name<span className="text-error-500">*</span>
                        </Label>
                        <Input required type="text" name="lastName" placeholder="Enter your last name" value={formData.lastName} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <Label>
                        Email<span className="text-error-500">*</span>
                      </Label>
                      <Input required type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                      <Label>
                        Phone Number
                      </Label>
                      <Input required type="tel" name="phoneNumber" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} />
                    </div>
                    <div>
                      <Label>
                        Address
                      </Label>
                      <Input required type="text" name="address" placeholder="Enter your address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div>
                      <Label>
                        Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input required type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                          {showPassword ? <Eye /> : <EyeClosed />}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>
                        Confirm Password<span className="text-error-500">*</span>
                      </Label>
                      <Input required type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox className="w-5 h-5" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                      <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                        Bằng cách tạo một tài khoản có nghĩa là bạn đồng ý với {" "}
                        <span className="text-gray-800 dark:text-white/90">
                          Điều khoản và Điều kiện, Chính sách Bảo mật
                        </span>{" "}của chúng tôi
                      </p>
                    </div>
                    <div>
                      <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) :
              (
                <div className="flex flex-col mb-10">
                  <span className="text-gray-400 mb-2">Chọn vai trò tài khoản</span>
                  {roleList.map((item) => (
                    <button key={item.value} onClick={e => handleClickRole(item)} className="flex flex-row items-center space-x-2 border-b hover:bg-gray-300 py-2 px-4">
                      <div className="w-14 h-14 relative rounded-full overflow-hidden">
                        <Image
                          src={`${item.src}`}
                          alt="avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col ml-4 items-start">
                        <span className="text-lg font-bold">{item.name}</span>
                        <span className="text-sm text-gray-500">{item.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}


            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Đã có tài khoản?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
