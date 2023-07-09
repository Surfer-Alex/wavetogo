'use client';
import Image from 'next/image';
import { useStore } from '@/store';
import OutboundOutlinedIcon from '@mui/icons-material/OutboundOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WaterIcon from '@mui/icons-material/Water';

interface ChartProps {
  id: string;
}
type ColorClasses = {
  [key: string]: string;
};

const CurrentSection = ({ id }: ChartProps) => {
  const { spotData } = useStore();

  const spotInfo = spotData.data.spots
    .map((i) => i)
    .filter((i) => i._id === id);
  console.log(spotInfo[0]);
  const colorClasses: ColorClasses = {
    VERY_POOR: 'text-red-600',
    POOR: 'text-amber-600',
    POOR_TO_FAIR: 'text-yellow-500',
    FAIR: 'text-green-600',
    FAIR_TO_GOOD: 'text-emerald-700',
    GOOD: 'text-blue-600',
    EPIC: 'text-fuchsia-800',
  };
  const waveRatingColor =
    colorClasses[spotInfo[0]?.conditions.value] || 'text-gray-500';

  const compassSector = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
    'N',
  ];

  const windDirection =
    compassSector[Math.round(spotInfo[0]?.wind.direction / 22.5)];
  return (
    spotInfo[0] && (
      <div className="max-w-[1280px] w-full mt-5">
        <div className=" text-3xl font-bold text-stone-950">
          <div className="self-center">Current Conditions</div>
        </div>
        <div className="w-full flex justify-around mt-5">
          <div className="w-32% h-[150px] my-[10px]  shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-3xl bg-slate-100 flex">
            <div className="flex flex-col items-center w-2/5">
              <div className=" font-semibold text-slate-700 text-lg mt-4">
                {spotInfo[0].waveHeight.humanRelation}
              </div>

              <div className=" text-3xl font-bold text-stone-950 flex mt-2">
                {spotInfo[0].waveHeight.min}~{spotInfo[0].waveHeight.max}
                <div className="ml-1 text-base self-end">M</div>
              </div>

              <div className={`${waveRatingColor} text-2xl font-bold mt-1`}>
                {spotInfo[0].conditions.value.replace(/_/g, ' ')}
              </div>
            </div>

            <Image
              width={100}
              height={100}
              className="w-2/5"
              alt="spot wheather icon"
              src={`https://wa.cdn-surfline.com/quiver/0.21.2/weathericons/${spotInfo[0].weather.condition}.svg`}
            />
            <div className="w-1/5 text-3xl font-bold text-stone-950 flex items-center">
              <div className="flex">
                {spotInfo[0].weather.temperature}
                <div className="ml-1 text-base self-end">°C</div>
              </div>
            </div>
          </div>
          <div className="w-32% h-[150px] my-[10px]  shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-3xl bg-slate-100 flex">
            <div className="w-2/5 flex flex-col items-center">
              <div className="text-base font-bold mt-4 text-slate-700">
                {spotInfo[0].wind.directionType} Wind
              </div>
              <div className=" text-3xl font-bold text-stone-950 flex mt-2">
                {spotInfo[0].wind.speed}
                <div className="ml-1 text-base  self-end">KPH</div>
              </div>
              <div className=" text-sm font-bold text-slate-700 flex mt-4">
                {spotInfo[0].wind.gust}
                <div className="align-bottom self-center">
                  KPH gust {windDirection}
                </div>
              </div>
            </div>
            <div className="relative w-3/5">
              <Image
                width={500}
                height={500}
                className="w-full h-full rounded-3xl"
                alt="spot static map"
                src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${spotInfo[0].lon},${spotInfo[0].lat},14,0/500x350?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-200">
                <OutboundOutlinedIcon
                  style={{
                    transform: `rotateZ(${
                      spotInfo[0].wind.direction + 135
                    }deg)`,
                    fontSize: '4rem',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-16% h-[150px] my-[10px]  shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-3xl bg-slate-100 flex flex-col">
            <div className="flex justify-center items-center">
              <div className="w-4/6 flex flex-col justify-center items-center">
                <div className="font-bold mt-4 text-slate-700">
                  {spotInfo[0].tide.next.type === 'HIGH'
                    ? 'Rising tide'
                    : 'Falling tide'}
                </div>
                <div>
                  <div className="text-3xl font-bold text-stone-950 flex mt-2">
                    {spotInfo[0].tide.current.height}
                    <div className="ml-1 text-base self-end">M</div>
                  </div>
                </div>
              </div>
              <div className="text-5xl w-2/6">
                {spotInfo[0].tide.next.type === 'HIGH' ? (
                  <TrendingUpIcon fontSize="inherit" />
                ) : (
                  <TrendingDownIcon fontSize="inherit" />
                )}
              </div>
            </div>
            <div className="text-center mt-4">
              {spotInfo[0].tide.next.type === 'HIGH' ? (
                <div className="text-sm font-bold text-stone-700">
                  HIGH {spotInfo[0].tide.next.height}M at{' '}
                  {new Date(
                    spotInfo[0].tide.next.timestamp * 1000
                  ).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              ) : (
                <div className="text-sm font-bold text-stone-700">
                  LOW {spotInfo[0].tide.next.height}M at{' '}
                  {new Date(
                    spotInfo[0].tide.next.timestamp * 1000
                  ).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="w-16% h-[150px] my-[10px]  shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-3xl bg-slate-100 font-bold text-stone-950 flex flex-col items-center justify-center">
            <div className="text-slate-700 text-xl">
              {spotInfo[0].waterTemp.max > 25
                ? 'Rash Guard'
                : spotInfo[0].waterTemp.max > 20
                ? '1~2mm Wetsuit/Rash Guard'
                : spotInfo[0].waterTemp.max > 17
                ? '2mm Spring Suit'
                : spotInfo[0].waterTemp.max > 11
                ? '3/2 or 4/3 mm Weitsuit'
                : spotInfo[0].waterTemp.max > 7
                ? '4/3 or 5/4 mm Weitsuit'
                : 'Stay Home,Buddy!'}
            </div>
            <div className="flex mt-2 text-3xl items-center">
              <WaterIcon className="text-blue-700 mr-1" fontSize="inherit" />
              {spotInfo[0].waterTemp.max}
              <div className="ml-1 text-base self-end">°C</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CurrentSection;
