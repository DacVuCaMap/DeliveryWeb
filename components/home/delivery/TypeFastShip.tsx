"use client";
import axios from "axios";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import './TypeFastShip.css'
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
  userLocation:Location | null;
};
type Location = {
  lat: number | null;
  lng: number | null;
}
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
  const [isFocused1, setFocused1] = useState(false);
  const [isFocused2, setFocused2] = useState(false);
  const defaultLoc: MapInfo = { address: "Vị trí hiện tại của bạn", display: "", ref_id: "" };
  const [suggestList, setSuggestList] = useState<MapInfo[]>([defaultLoc]);
  const [inputInfo, setInputInfo] = useState<InputInfo>({ input1: null, input2: null });

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
        const response = await axios.get(`https://maps.vietmap.vn/api/autocomplete/v3?apikey=${API_KEY}&text=${encodeURIComponent(query)}`)
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
      const newLoc : Location = props.userLocation;
      props.setFastShip((prev) => {
        const newFastShip = [...prev];
        newFastShip[ind] = newLoc;
        return newFastShip;
      });
      return;
    }
    try {
      const response = await axios.get(`https://maps.vietmap.vn/api/place/v3?apikey=${API_KEY}&refid=${encodeURIComponent(item.ref_id)}`)
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
  return (
    <div className="absolute bottom-20 left-4 right-4 z-10">
      <div className="relative bg-white/60 backdrop-blur-md shadow-md px-6 py-4 flex flex-col gap-4">
        <button
          onClick={() => props.setOpenCard({ ...props.openCard, fastShip: false })}
          className="absolute top-2 right-4"
        >
          <X />
        </button>
        <div className="flex lg:flex-row flex-col items-start gap-6">
          <div className="flex flex-col w-full">
            <span className="text-gray-500">Bạn hãy nhập địa chỉ đơn hàng bắt đầu</span>
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
            <span className="text-gray-500">Bạn hãy nhập địa chỉ đơn hàng kết thúc</span>
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
        <button className="w-full bg-orange-500 rounded-xl text-white py-2">
          Tìm shipper ngay
        </button>
      </div>
    </div>
  );
}