import React from "react";
import { Loader2 } from "lucide-react"; // icon spinner từ lucide-react (ShadCN UI)

interface FullScreenLoaderProps {
  text?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 bg-orange-500 text-white p-6 rounded-2xl shadow-xl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-base font-medium">{text}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;