"use client";

import { RiArrowDropDownLine, RiFacebookCircleFill } from "react-icons/ri";
import { FaXTwitter, FaAngellist } from "react-icons/fa6";


export default function Topbar() {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#f5f7fa] h-10.5 px-22.5 border-b-[#1a231a]/30 border-t-[#1a231a]/30 text-sm text-gray-600">
        <div className="max-w-7xl h-10 mx-auto justify-end flex items-center">
          <div className="flex w-64 h-10 gap-2">
            <div className="flex items-center gap-1 h-10 py-2 font-medium cursor-pointer">
              <span className="text-[#879287]">Makurdi, Nigeria |</span>
              <RiArrowDropDownLine size={35}/>
            </div>
            <div className="flex items-center w-17.5 h-3.5 py-5 gap-3.5 text-gray-500">
              <FaXTwitter size={17}/>
              <RiFacebookCircleFill size={20}/>
              <FaAngellist size={17}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}