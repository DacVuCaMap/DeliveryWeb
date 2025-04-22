"use client";
import FullScreenLoader from "@/components/FullScreenLoading";
import Checkbox from "@/components/temp/form/input/Checkbox";
import Input from "@/components/temp/form/input/InputField";
import Label from "@/components/temp/form/Label";
import { registerUser } from "@/utils/api";
import { ChevronLeft, Eye, EyeClosed, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmCode from "./ConfirmCode";
import AddressSign from "./AddressSign";
import { RegisterForm } from "@/entity/TypeObject";


type RoleRegister = {
  value: string, name: string, description: string, src: string
}

export default function SignUpForm() {
  const route = useRouter();
  const roleList: RoleRegister[] = [
    { value: "USER", name: "Người dùng", description: "Trải nghiệm mua bán khắp mọi nơi", src: "/snapgoimg/userAvt.png" },
    { value: "PARTNER", name: "Người bán", description: "Trở thành đối tác cùng snapgo.vn", src: "/snapgoimg/partnerAvt.png" },
    { value: "SHIPPER", name: "Người giao hàng", description: "Vận chuyển đơn hàng của chúng tôi", src: "/snapgoimg/shipperAvt.png" }];
  const [role, setRole] = useState<RoleRegister | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);
  const [isWaitCode, setIsWaitCode] = useState(false);

  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    name: "",
    roleName: "",
    citizenIdFront: null,
    citizenIdBack: null,
    lat: 0,
    lng: 0,
    storeName: ""
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    // Kiểm tra điều kiện đầu vào
    if (formData.password !== formData.confirmPassword || false) {
      toast.error("Mật khẩu nhập lại không giống nhau");
    } else if (!role) {
      toast.error("Chưa chọn kiểu tài khoản");
    } else {
      try {
        const formPost: RegisterForm = {
          ...formData,
          name: `${formData.lastName} ${formData.firstName}`,
          roleName: role.value,
        };
        const data = await registerUser(formPost);
        if (data?.success) {
          toast.success("Đăng ký thành công!");
          setIsWaitCode(true);
          setLoading(false);
          return;
        }
        if (data?.status === 409) {
          toast.error("Email đã tồn tại!");
        } else {
          toast.error(data?.message || "Đăng ký thất bại!");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Đã có lỗi xảy ra!");
      }
    }

    setLoading(false);
  };
  const handleClickRole = (item: RoleRegister) => {
    setRole(item);
  }
  const handleImageChange = (e: any, side: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      [side === "front" ? "citizenIdFront" : "citizenIdBack"]: file,
    }));

    if (side === "front") {
      setPreviewFront(previewUrl);
    } else {
      setPreviewBack(previewUrl);
    }
  };

  const updateAddressForPartner = (e: any, key: string) => {
    if (key === "location") {
      setFormData({ ...formData, lat: e.lat, lng: e.lng })

    }
    else  {
      setFormData({ ...formData, [key]: e });
    }
  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar pb-10">
      {isLoading && <FullScreenLoader text="Đang thực hiện đăng ký ...." />}
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
              Tạo tài khoản để sử dụng snapgo
            </p>
          </div>
          {isWaitCode ? (
            <div>
              <ConfirmCode email={formData.email} />
            </div>
          ) :
            <div>
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
                      <div className="flex flex-col ml-2 items-start ">
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
                            Họ<span className="text-error-500">*</span>
                          </Label>
                          <Input required type="text" name="lastName" placeholder="Enter your last name" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div className="sm:col-span-1">
                          <Label>
                            Tên<span className="text-error-500">*</span>
                          </Label>
                          <Input required type="text" name="firstName" placeholder="Enter your first name" value={formData.firstName} onChange={handleChange} />
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
                          Số điện thoại<span className="text-error-500">*</span>
                        </Label>
                        <Input required type="tel" name="phoneNumber" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} />
                      </div>
                      {role.value != "PARTNER" &&
                        <div>
                          <Label>
                            Địa chỉ<span className="text-error-500">*</span>
                          </Label>
                          <Input required type="text" name="address" placeholder="Enter your address" value={formData.address} onChange={handleChange} />
                        </div>
                      }
                      <div>
                        <Label>
                          Mật khẩu<span className="text-error-500">*</span>
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
                          Nhập lại mật khẩu<span className="text-error-500">*</span>
                        </Label>
                        <Input required type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                      </div>
                      {role.value != "USER" && (
                        <div>
                          <Label>
                            Ảnh căn cước công dân<span className="text-error-500">*</span>
                          </Label>
                          <span className="text-gray-400 text-xs">(đối với tài khoản giao hàng và người bán chúng tôi cần thu thập thêm CCCD để hợp tác 1 cách minh bạch)</span>
                          <div className="flex flex-col gap-4 mt-4">
                            <div>
                              <p className="text-sm mb-1 text-gray-500 dark:text-gray-400">Mặt trước</p>
                              <input
                                required
                                type="file"
                                name="citizenIdFront"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, "front")}
                                className="block w-full text-sm file:text-white file:bg-orange-500 file:hover:bg-orange-600 file:border-0 file:rounded-lg file:px-4 file:py-2 cursor-pointer bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                              />
                              {previewFront && (
                                <img
                                  src={previewFront}
                                  alt="Preview mặt trước"
                                  className="mt-2 w-1/2 h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm mb-1 text-gray-500 dark:text-gray-400">Mặt trước</p>
                              <input
                                required
                                type="file"
                                name="citizenIdFront"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, "back")}
                                className="block w-full text-sm file:text-white file:bg-orange-500 file:hover:bg-orange-600 file:border-0 file:rounded-lg file:px-4 file:py-2 cursor-pointer bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                              />
                              {previewBack && (
                                <img
                                  src={previewBack}
                                  alt="Preview mặt trước"
                                  className="mt-2 w-1/2 h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {role.value === "PARTNER" && <AddressSign updateAddressForPartner={updateAddressForPartner} formData={formData} />}

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
                        <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-orange-500 shadow-theme-xs hover:bg-orange-600">
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
                          <span className="lg:text-sm text-xs text-gray-500">{item.description}</span>
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

          }
        </div>
      </div>


    </div>
  );
}
