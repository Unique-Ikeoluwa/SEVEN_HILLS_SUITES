"use client";
import { RiArrowDropDownLine, RiFacebookCircleFill } from "react-icons/ri";
import { FaXTwitter, FaAngellist } from "react-icons/fa6";
export default function Topbar() {
  return (
    <>
      <div className="bg-[#f5f7fa] h-10.5 px-4 md:px-22.5 border-b-[#1a231a]/30 border-t-[#1a231a]/30 text-sm text-gray-600">
        <div className="max-w-7xl h-10 mx-auto justify-end flex items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 h-10 py-2 font-medium cursor-pointer">
              <span className="text-[#879287] text-xs md:text-sm">Makurdi, Nigeria |</span>
              <RiArrowDropDownLine size={35} />
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <FaXTwitter size={17} />
              <RiFacebookCircleFill size={20} />
              <FaAngellist size={17} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}