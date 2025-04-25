'use client'

import { useEffect, useRef, useState } from 'react'
import { AutoComplete } from 'antd'
import { Location, MapInfo, RegisterForm } from '@/entity/TypeObject'
import { fetchAutoCompleteVietMap, fetchPlaceVietMap } from '@/utils/api'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import './AddressSign.css'

type Props = {
    updateAddressForPartner: (e: any, key: string) => void
    formData: RegisterForm
}

export default function AddressSign(props: Props) {
    const [open, setOpen] = useState(false)
    const [addressSuggestions, setAddressSuggestion] = useState<MapInfo[]>([])
    const [inputValue, setInputValue] = useState(props.formData.address)
    const mapContainer = useRef<HTMLDivElement>(null)
    const mapRef = useRef<any>(null)
    const markerRef = useRef<any>(null)
    // Khởi tạo bản đồ NGAY từ đầu
    useEffect(() => {
        const vietmapgl = (window as any).vietmapgl
        if (!mapContainer.current || !vietmapgl || mapRef.current) return

        const defaultCenter: [number, number] = [105.8544441, 21.028511]

        mapRef.current = new vietmapgl.Map({
            container: mapContainer.current,
            style: process.env.NEXT_PUBLIC_API_URL + `/api/vietmap/style`,
            center: defaultCenter,
            zoom: 15,
        })
    }, [])
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (inputValue.trim().length > 1) {
                const response = await fetchAutoCompleteVietMap(inputValue)
                console.log(response)
                if (response.data && Array.isArray(response.data)) {
                    const listResponse = response.data.filter((item, index) => index < 5)
                    const suggests: MapInfo[] = listResponse.map((item) => {
                        return { address: item.address, ref_id: item.ref_id, display: item.display, phoneNumber: item.phoneNumber }
                    })
                    console.log('da set')
                    setAddressSuggestion(suggests)
                }
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [inputValue])

    const handleInputAddress = (value: string) => {
        setInputValue(value)
        setOpen(true)
    }

    // Handle address selection
    const handleSelect = async (value: string) => {
        const selectedAddress: MapInfo | undefined = addressSuggestions.find((item) => item.address === value)
        if (selectedAddress) {
            props.updateAddressForPartner(selectedAddress.display, 'address')
            try {
                const response = await fetchPlaceVietMap(selectedAddress.ref_id);
                if (response.data && response.data.lat && response.data.lng) {
                    const newLoc: Location = { lat: response.data.lat, lng: response.data.lng };
                    props.updateAddressForPartner(newLoc, "location");
                    // Update map location and marker
                    if (newLoc.lat && newLoc.lng && mapRef.current) {
                        mapRef.current.setCenter(newLoc)

                        // Update or create marker
                        if (markerRef.current) {
                            markerRef.current.setLngLat(newLoc)
                        } else {
                            const markerElement = document.createElement('div')
                            markerElement.innerHTML = `
                                <div style="
                                    background: #ff3e3e;
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    border: 3px solid #fff;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    transform: translateY(-50%);
                                ">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                </div>
                            `
                            markerRef.current = new (window as any).vietmapgl.Marker({ element: markerElement })
                                .setLngLat(newLoc)
                                .addTo(mapRef.current)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
            setInputValue(selectedAddress.display)
            setOpen(false)


        }
    }

    return (
        <div className="border-t pt-6 flex flex-col gap-4">
            <label>Thiết lập cửa hàng</label>
            <div className='space-y-2'>
                <Label>
                    Tên cửa hàng<span style={{ color: 'red' }}>*</span>
                </Label>
                {/* Áp dụng className cho Input */}
                <Input
                    required
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={props.formData.storeName}
                    onChange={e => props.updateAddressForPartner(e.target.value, "storeName")}
                    className="black-input-antd" // Thêm className này
                // style={{ backgroundColor: 'black', color: 'white' }} // Có thể xóa hoặc giữ lại
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>
                    Địa chỉ cửa hàng<span style={{ color: 'red' }}>*</span>
                </Label>
                {/* Áp dụng className cho AutoComplete */}
                <AutoComplete
                    value={inputValue}
                    open={open}
                    onSearch={handleInputAddress}
                    onSelect={handleSelect}
                    onBlur={() => setOpen(false)}
                    placeholder="Nhập địa chỉ"
                    options={addressSuggestions.map((item, index: number) => ({
                        key: item.ref_id,
                        value: item.address,
                        label: (
                            <div className="flex flex-col">
                                <span className="text-base font-medium">{item.address}</span>
                                <span className="text-xs text-gray-500">{item.display}</span>
                            </div>
                        ),
                    }))}
                    className="black-autocomplete-antd" // Thêm className này
                    style={{ width: '100%' }} // Giữ lại style về width nếu cần, bỏ màu ở đây
                />
                <div ref={mapContainer} className="w-full h-64 border" />
            </div>
        </div>
    )
}