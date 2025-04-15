import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function ConfirmCode({ email }: { email: string }) {
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const handleOtp = (e: any) => {
        e.preventDefault();
        console.log(otp);
        router.push("/signin");
    }
    return (
        <div>
            <form onSubmit={handleOtp}>
                <div className="flex flex-col justify-center items-center space-y-4 py-10">
                    <div className='flex flex-col justify-between items-center'>
                        <span className='text-gray-600'>Nhập mã OTP đã được gửi tới email </span>
                        <span><strong>{email}</strong></span>
                    </div>
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div>
                        <Button className="w-full" size="sm">
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
