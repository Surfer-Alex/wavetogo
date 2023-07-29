import { useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Spot, useStore } from "@/store";
import Link from "next/link";
import Image from "next/image";
interface SearchBarProps {
  setOpen: (open: boolean) => void;
  open: boolean;
}
type ColorClasses = {
  [key: string]: string;
};
const SearchBar: React.FC<SearchBarProps> = ({ setOpen, open }) => {
  const [activeSearch, setActiveSearch] = useState<Spot[]>([]);
  const [inputValue, setInputValue] = useState("");

  const spotInfo = useStore((state) => state.spotData.data.spots);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    setActiveSearch(
      spotInfo.filter((spot) =>
        spot.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };
  const clickToPage = () => {
    setOpen(false);
    setActiveSearch([]);
    setInputValue("");
  };
  const colorClasses: ColorClasses = {
    VERY_POOR: "text-red-600",
    POOR: "text-amber-600",
    POOR_TO_FAIR: "text-yellow-500",
    FAIR: "text-green-600",
    FAIR_TO_GOOD: "text-emerald-700",
    GOOD: "text-blue-600",
    EPIC: "text-fuchsia-800",
  };

  return (
    <div
      onClick={() => setOpen(false)}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  transition-colors  ${
        open ? "visible " : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative h-2/3 w-4/6  rounded-xl bg-white text-black`}
      >
        <div className="h-full">
          <div className="relative h-14 w-full text-2xl ">
            <SearchRoundedIcon
              fontSize="inherit"
              className="absolute left-4 top-4 self-center text-4xl"
            />
            <input
              onChange={(e) => handleSearch(e)}
              type="text"
              className={`w-full rounded-t-xl border-b border-slate-400  py-4 pl-16 text-black focus:outline-none`}
              placeholder="What you looking for?"
              value={inputValue}
            />
          </div>
          {activeSearch.length > 0 && (
            <div className="mt-6 flex h-negativeSearchBar w-full flex-col gap-2 overflow-y-auto px-10">
              {activeSearch.map((i, idx) => {
                const waveRatingColor =
                  colorClasses[i.conditions.value] || "text-gray-500";
                return (
                  <Link
                    key={idx}
                    href={`/surf-report/${i._id}`}
                    onClick={clickToPage}
                  >
                    <div className="flex flex-col rounded-xl bg-slate-200 px-2 py-2 opacity-75 hover:opacity-100 sm:flex-row">
                      <div className="flex w-3/5 items-center">{i.name}</div>
                      <div className="flex flex-grow">
                        <div
                          className={`flex w-1/2 items-center px-2 py-1 ${waveRatingColor}`}
                        >
                          {i.conditions.value.replace(/_/g, " ")}
                        </div>
                        <div className="mr-4 flex items-center justify-center text-lg">
                          <Image
                            width={50}
                            height={50}
                            className=""
                            alt="spot wheather icon"
                            src={`https://wa.cdn-surfline.com/quiver/0.21.2/weathericons/${i.weather.condition}.svg`}
                          />
                          {i.weather.temperature}°C
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 text-3xl text-gray-400 hover:text-black "
        >
          <CancelRoundedIcon fontSize="inherit" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
