"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { calTime } from "@/utils/allfunction";
type MapInfo = {
    address: string;
    ref_id: string;
    display: string;
    phoneNumber?: string;
};

type InputInfo = {
    input1: MapInfo | null;
    input2: MapInfo | null;
};

type Props = {
    setDetailCard: React.Dispatch<React.SetStateAction<boolean>>;
    inputInfo: InputInfo;
    distance: number;
    handleFindShipper: () => Promise<void>;
}

export default function DetailShip(props: Props) {
    const [weight, setWeight] = useState("");
    const [itemType, setItemType] = useState("");

    const weights = [
        "0-5kg",
        "5-10kg",
        "10-15kg",
        "15-20kg",
        "20-25kg",
        "25-30kg",
        "30-50kg",
    ];

    const itemTypes = ["Thực phẩm", "Quần áo", "Khác", "Tài liệu", "Dễ vỡ"];

    const onSubmit = async() => {
        await props.handleFindShipper();
        props.setDetailCard(false);
    }
    return (
        <div className="w-full mx-auto p-4 space-y-4">

            <Card>
                <CardContent className="space-y-4">
                    <button onClick={e => props.setDetailCard(false)}><ArrowLeft /></button>
                    <div>Người nhận</div>
                    <div>
                        <Input className="cursor-pointer" onClick={e => props.setDetailCard(false)} readOnly value={props.inputInfo.input2?.address === "Vị trí hiện tại của bạn" ? "Vị trí hiện tại của bạn" : props.inputInfo.input2?.display} id="address" placeholder="Địa chỉ người nhận" />
                    </div>
                    <div>
                        <Input placeholder="Thêm mô tả nhận hàng" />
                    </div>
                    <div>
                        <Input placeholder="Tên người nhận" required />
                    </div>
                    <div>
                        <Input value={props.inputInfo.input2?.phoneNumber} type="tel" placeholder="Số điện thoại" required />
                    </div>
                    <div className="flex lg:flex-row gap-4 flex-col">
                        <div className="lg:w-1/2">
                            <div>
                                <Label className="mb-2">Khối lượng</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {weights.map((w) => (
                                        <Button
                                            key={w}
                                            variant={weight === w ? "default" : "outline"}
                                            onClick={() => setWeight(w)}
                                        >
                                            {w}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div>
                                <Label className="mb-2">Loại hàng hóa</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {itemTypes.map((type) => (
                                        <Button
                                            key={type}
                                            variant={itemType === type ? "default" : "outline"}
                                            onClick={() => setItemType(type)}
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Quãng đường</Label>
                        <span>{(props.distance / 1000).toFixed(2)} km</span>
                    </div>
                    <div>
                        <Label>Thời gian dự kiến</Label>
                        <span>{calTime(props.distance)}</span>
                    </div>

                    <Button onClick={e=>onSubmit()} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        Tim ship
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
