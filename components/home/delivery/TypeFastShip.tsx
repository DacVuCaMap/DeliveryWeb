"use client";
import axios from "axios";
import { X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import './TypeFastShip.css'
import { fetchAutoCompleteVietMap, fetchPlaceVietMap, getNearShipper } from "@/utils/api";
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import Image from "next/image";
// Define types
type OpenCard = {
  bottomCard: boolean;
  fastShip: boolean;
};

type MapInfo = {
  address: string;
  ref_id: string;
  display: string;
};

type InputInfo = {
  input1: MapInfo | null;
  input2: MapInfo | null;
};

type Props = {
  setOpenCard: React.Dispatch<React.SetStateAction<OpenCard>>;
  openCard: OpenCard;
  setFastShip: React.Dispatch<React.SetStateAction<Location[]>>;
  userLocation: Location | null;
  distance: number;
  mapRef: any;
  fastShip: Location[];
  setNearShipper: React.Dispatch<React.SetStateAction<Location | null>>
};
type Location = {
  lat: number | null;
  lng: number | null;
}
type NearShipper = {
  avatar: any;
  distance: number;
  firstName: string;
  lastName: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  shipperId: number;
};
// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function TypeFastShip(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const y = useMotionValue(isOpen ? 200 : 500);
  const opacity = useTransform(y, [-50, 0], [1, 0.95]);
  const nearShipRef = useRef<any>([]);
  const [isFocused1, setFocused1] = useState(false);
  const [isFocused2, setFocused2] = useState(false);
  const defaultLoc: MapInfo = { address: "Vị trí hiện tại của bạn", display: "", ref_id: "" };
  const [suggestList, setSuggestList] = useState<MapInfo[]>([defaultLoc]);
  const [inputInfo, setInputInfo] = useState<InputInfo>({ input1: null, input2: null });
  const [listNearShipper, setListNearShipper] = useState<NearShipper[]>([]);
  const [searchShipCard, setSearchShipCard] = useState(false);
  // Debounce input values (1.5 seconds delay)
  const debouncedInput1 = useDebounce(inputInfo.input1?.address || "", 500);
  const debouncedInput2 = useDebounce(inputInfo.input2?.address || "", 500);

  // API key (replace with your actual Vietmap API key)
  const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_TOKEN;
  // Fetch suggestions from Vietmap API
  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      if (!query) {
        setSuggestList([]);
        return;
      }

      try {
        // const response = await axios.get(`https://maps.vietmap.vn/api/autocomplete/v3?apikey=${API_KEY}&text=${encodeURIComponent(query)}`)
        if (!props.userLocation || !props.userLocation.lat || !props.userLocation.lng) return;
        const response = await fetchAutoCompleteVietMap(query,props.userLocation?.lat,props.userLocation?.lng);
        if (response.data && Array.isArray(response.data)) {
          const listResponse = response.data.filter((item, index) => index < 3);
          const suggests: MapInfo[] = listResponse.map((item) => {
            return { address: item.address, ref_id: item.ref_id, display: item.display };
          })
          setSuggestList([defaultLoc, ...suggests])
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestList([]);
      }
    };

    // Call API for the relevant input
    if (isFocused1 && debouncedInput1) {
      fetchSuggestions(debouncedInput1);
    } else if (isFocused2 && debouncedInput2) {
      fetchSuggestions(debouncedInput2);
    } else {
      setSuggestList([defaultLoc]);
    }
  }, [debouncedInput1, debouncedInput2, isFocused1, isFocused2]);

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, key: keyof InputInfo) => {
    const value = e.target.value;
    setInputInfo((prev) => ({
      ...prev,
      [key]: prev[key] ? { ...prev[key], address: value } : { address: value, refId: "" },
    }));
  };

  // Handle suggestion selection
  const handleSelectSuggestion = async (suggestion: MapInfo, key: keyof InputInfo) => {
    setInputInfo((prev) => ({
      ...prev,
      [key]: suggestion,
    }));
    setSuggestList([]);
    if (key === "input1") {
      setFocused1(false);
      handleSetFastShip(suggestion, 0);
    }
    else {
      setFocused2(false);
      handleSetFastShip(suggestion, 1);
    }
  };

  const handleSetFastShip = async (item: MapInfo, ind: number) => {
    if (item.address === "Vị trí hiện tại của bạn" && props.userLocation) {
      const newLoc: Location = props.userLocation;
      props.setFastShip((prev) => {
        const newFastShip = [...prev];
        newFastShip[ind] = newLoc;
        return newFastShip;
      });
      return;
    }
    try {
      // const response = await axios.get(`https://maps.vietmap.vn/api/place/v3?apikey=${API_KEY}&refid=${encodeURIComponent(item.ref_id)}`)
      const response = await fetchPlaceVietMap(item.ref_id);
      console.log(response)
      if (response.data && response.data.lat && response.data.lng) {
        const newLoc: Location = { lat: response.data.lat, lng: response.data.lng };
        props.setFastShip((prev) => {
          const newFastShip = [...prev];
          newFastShip[ind] = newLoc;
          return newFastShip;
        });
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }
  const calTime = () => {
    const distanceKm = props.distance / 1000
    const averageSpeedKmH = 40

    const timeHours = distanceKm / averageSpeedKmH
    const hours = Math.floor(timeHours)
    const minutes = Math.round((timeHours - hours) * 60)

    if (hours === 0 && minutes === 0) {
      return 'ít hơn 1 phút'
    } else if (hours === 0) {
      return `${minutes} phút`
    } else if (minutes === 0) {
      return `${hours} giờ`
    } else {
      return `${hours} giờ ${minutes} phút`
    }
  }
  const handleFindShipper = async () => {
    if (!inputInfo.input1 || !inputInfo.input2 || !props.userLocation || !props.fastShip[0].lat || !props.fastShip[0].lng) return;
    const response = await getNearShipper(props.fastShip[0].lat, props.fastShip[0].lng, 0);
    console.log(response);
    if (response && response.value && response.success && Array.isArray(response.value)) {
      const newList: NearShipper[] = response.value.map((item: any) => {
        return {
          avatar: item.avatar,
          distance: item.distance,
          firstName: item.firstName,
          lastName: item.lastName,
          latitude: item.latitude,
          longitude: item.longitude,
          phoneNumber: item.phoneNumber,
          shipperId: item.shipperId
        };
      })

      setSearchShipCard(true);
      setListNearShipper(newList);
      setIsOpen(!isOpen);
      animate(y, isOpen ? 200 : 200, { // Sử dụng animate để tạo animation
        duration: 0.3,
        ease: 'easeInOut',
      });
    }

  }
  const setMarkerShip = (item: NearShipper) => {
    props.setNearShipper({ lat: item.latitude, lng: item.longitude });
  }


  return (
    <div className="absolute bottom-20 left-4 right-4 z-10">
      <div className={`relative bg-white/60 backdrop-blur-md shadow-md px-6 py-4 flex flex-col gap-4 ${searchShipCard ? "hidden" : ""}`}>
        <button
          onClick={() => props.setOpenCard({ ...props.openCard, fastShip: false })}
          className="absolute top-2 right-4"
        >
          <X />
        </button>
        <div className="flex lg:flex-row flex-col items-start gap-6">
          <div className="flex flex-col w-full">
            <span className="text-gray-500">Nhập địa chỉ nhận hàng</span>
            <input
              value={inputInfo.input1?.address || ""}
              onChange={(e) => handleInput(e, "input1")}
              onFocus={() => setFocused1(true)}
              onBlur={() => setTimeout(() => setFocused1(false), 100)}
              type="text"
              placeholder="Chọn địa chỉ nhận hàng"
              className="bg-gray-200 rounded-sm px-6 py-2 outline-none w-full"
            />
            {isFocused1 && (
              <div
                className={`bg-white border border-gray-300 rounded-md mt-2 w-full ${isFocused1 ? "animate-slideDown" : "animate-slideUp"
                  }`}
              >
                {suggestList.length > 0 ? (
                  suggestList.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col border-b"
                      onMouseDown={() => handleSelectSuggestion(suggestion, "input1")}
                    >
                      <span className="font-bold">{suggestion.address}</span>
                      <span className="text-xs text-gray-400">{suggestion.display}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Không có gợi ý</div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <span className="text-gray-500">Nhập địa chỉ giao hàng</span>
            <input
              value={inputInfo.input2?.address || ""}
              onChange={(e) => handleInput(e, "input2")}
              onFocus={() => setFocused2(true)}
              onBlur={() => setTimeout(() => setFocused2(false), 100)}
              type="text"
              placeholder="Chọn địa chỉ nhận hàng"
              className="bg-gray-200 rounded-sm px-6 py-2 outline-none w-full"
            />
            {isFocused2 && (
              <div
                className={`bg-white border border-gray-300 rounded-md mt-2 w-full ${isFocused2 ? "animate-slideDown" : "animate-slideUp"
                  }`}
              >
                {suggestList.length > 0 ? (
                  suggestList.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col border-b"
                      onMouseDown={() => handleSelectSuggestion(suggestion, "input2")}
                    >
                      <span className="font-bold">{suggestion.address}</span>
                      <span className="text-xs text-gray-400">{suggestion.display}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Không có gợi ý</div>
                )}
              </div>
            )}
          </div>
        </div>
        {inputInfo.input1 && inputInfo.input2 && (
          <div className="flex flex-row gap-4">
            <span>Quãng đường: {(props.distance / 1000).toFixed(2)}km</span>
            <span>Thời gian: {calTime()}</span>
          </div>
        )}
        <button onClick={e => handleFindShipper()} className="w-full bg-orange-500 rounded-xl text-white py-2">
          Tìm shipper ngay
        </button>
      </div>



      {searchShipCard && (
        <div className="bg-white/50 absolute bottom-[-50px] w-full min-h-[400px] pt-4 px-6 backdrop-blur-md">
          <button
            onClick={e=>setSearchShipCard(false)}
            className="absolute top-2 right-4"
          >
            <X />
          </button>
          <h2 className="text-lg font-semibold">Kết quả tìm kiếm</h2>
          <p className="text-gray-500">Danh sách shipper</p>
          <div className="mt-4 flex flex-col space-y-4">
            {listNearShipper.map((item: NearShipper) => (
              <div onClick={e => setMarkerShip(item)} key={item.shipperId} className="flex cursor-pointer items-center space-x-4 p-3 border-b border-gray-300 hover:shadow-md">
                {/* Avatar hình tròn */}
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {item.avatar ? (
                    <img src={item.avatar} alt={`${item.firstName} ${item.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    // <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                    //   {/* Có thể hiển thị chữ cái đầu hoặc icon mặc định nếu không có avatar */}
                    //   {item.firstName.charAt(0).toUpperCase()}
                    // </div>
                    <Image src={"/images/shipper1.png"} width={50} height={50} alt={""}></Image>
                  )}
                </div>

                {/* Thông tin shipper */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{`${item.firstName} ${item.lastName}`}</h3>
                  <p className="text-gray-500 text-sm">ID: {item.shipperId}</p>
                  <p className="text-blue-500 text-sm">Cách bạn: {item.distance.toFixed(2)} km</p>
                  <p className="text-gray-600 text-sm">SĐT: {item.phoneNumber}</p>
                  {/* Thêm các thông tin khác bạn muốn hiển thị */}
                </div>

                {/* Thao tác (nếu cần) */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}