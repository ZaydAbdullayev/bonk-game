import { TbSmartHome } from "react-icons/tb";
import { HiUsers } from "react-icons/hi2";
import { RiTwitterXFill } from "react-icons/ri";

export function BonkTokSidebar() {
  return (
    <div className="bg-black border-r border-gray-800 text-white w-[300px] min-h-screen">
      {/* Header */}
      <div className="p-4 bg-black border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <span className="text-white text-xl font-bold">BonkTok</span>
        </div>
      </div>

      {/* Sidebar content */}
      <div className="px-2 py-4">
        {/* For You item */}
        <div className="mb-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-md text-white text-lg hover:bg-pink-500/20 hover:text-white"
          >
            <TbSmartHome className="w-6 h-6" />
            <span className="whitespace-nowrap text-sm">
              For You (Bonk Videos For You)
            </span>
          </a>
        </div>

        {/* Following item */}
        <div className="mb-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-md text-white text-lg hover:bg-pink-500/20 hover:text-white"
          >
            <HiUsers className="w-6 h-6" />
            <span className="text-sm">Following</span>
          </a>
        </div>
        <div className="mb-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-md text-white text-lg hover:bg-pink-500/20 hover:text-white"
          >
            <RiTwitterXFill className="w-6 h-6" />
            <span className="text-sm">Follow Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
