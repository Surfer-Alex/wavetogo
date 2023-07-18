import { useState } from 'react';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Spot, useStore } from '@/store';
import Link from 'next/link';
import Image from 'next/image';
interface SearchBarProps {
  setOpen: (open: boolean) => void;
  open: boolean;
}
type ColorClasses = {
  [key: string]: string;
};
const SearchBar: React.FC<SearchBarProps> = ({ setOpen, open }) => {
  const [activeSearch, setActiveSearch] = useState<Spot[]>([]);
  const [inputValue, setInputValue] = useState('');

  const spotInfo = useStore((state) => state.spotData.data.spots);
  console.log(spotInfo);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      setActiveSearch([]);
      return false;
    }
    setActiveSearch(
      spotInfo.filter((spot) =>
        spot.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  const clickToPage = () => {
    setOpen(false);
    setActiveSearch([]);
    setInputValue('');
  };
  const colorClasses: ColorClasses = {
    VERY_POOR: 'text-red-600',
    POOR: 'text-amber-600',
    POOR_TO_FAIR: 'text-yellow-500',
    FAIR: 'text-green-600',
    FAIR_TO_GOOD: 'text-emerald-700',
    GOOD: 'text-blue-600',
    EPIC: 'text-fuchsia-800',
  };

  return (
    <div
      onClick={() => setOpen(false)}
      className={`fixed inset-0 flex justify-center items-center transition-colors bg-black bg-opacity-50  z-50  ${
        open ? 'visible ' : 'invisible'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-4/6 h-2/3 bg-white  text-black relative rounded-xl`}
      >
        <div className="h-full">
          <div className="w-full h-14 relative text-2xl ">
            <SearchRoundedIcon
              fontSize="inherit"
              className="self-center absolute left-4 top-4 text-4xl"
            />
            <input
              onChange={(e) => handleSearch(e)}
              type="text"
              className={`rounded-t-xl w-full pl-16 py-4  focus:outline-none text-black border-b border-slate-400`}
              placeholder="What you looking for?"
              value={inputValue}
            />
          </div>
          {activeSearch.length > 0 && (
            <div className="flex flex-col gap-2 w-full h-negativeSearchBar mt-6 px-10 overflow-y-auto">
              {activeSearch.map((i, idx) => {
                const waveRatingColor =
                  colorClasses[i.conditions.value] || 'text-gray-500';
                return (
                  <Link
                    key={idx}
                    href={`/surf-report/${i._id}`}
                    onClick={clickToPage}
                  >
                    <div className="flex rounded-xl bg-slate-200 opacity-75 px-2 py-2 hover:opacity-100">
                      <div className="w-1/5 flex items-center">{i.name}</div>
                      <div
                        className={`w-1/5 flex items-center px-2 py-1 ${waveRatingColor}`}
                      >
                        {i.conditions.value.replace(/_/g, ' ')}
                      </div>
                      <div className="flex items-center justify-center text-lg mr-4">
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
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 text-gray-400 text-3xl hover:text-black "
        >
          <CancelRoundedIcon fontSize="inherit" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
