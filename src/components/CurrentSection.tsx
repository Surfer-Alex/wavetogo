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

const CurrentSection = ({ id }: ChartProps) => {
  const { spotData } = useStore();

  const spotInfo = spotData.data.spots
    .map((i) => i)
    .filter((i) => i._id === id);

  // if(spotInfo){
  //     console.log(spotInfo[0]);
  // }

  return (
    spotInfo[0] && (
      <div className="w-[1000px]">
        <div className=" text-3xl font-bold text-stone-950 flex">
          <div className="self-center">目前狀況</div>
          <div className="text-lg font-bold text-stone-950 flex items-center">
            {spotInfo[0].weather.temperature}
            <div className="ml-1 text-xs align-bottom self-center">。C</div>
          </div>
          <Image
            width={100}
            height={100}
            alt="spot wheather icon"
            className="min-h-[50px]"
            src={`https://wa.cdn-surfline.com/quiver/0.21.2/weathericons/${spotInfo[0].weather.condition}.svg`}
          />
        </div>
        <div className="w-full flex">
          <div className="">
            <div className=" font-bold text-stone-950 ">
              浪高比例:{spotInfo[0].waveHeight.humanRelation}
            </div>
            <div className=" text-lg font-bold text-stone-950 flex">
              {spotInfo[0].waveHeight.min}~{spotInfo[0].waveHeight.max}
              <div className="ml-1 text-xs align-bottom self-center">M</div>
            </div>
            <div className=" font-normal text-blue-600 ">
              評價:{spotInfo[0].conditions.value}
            </div>
          </div>
          <div className="flex max-w-[450px]">
            <div className="w-1/2">
              <div className="font-bold">
                風向:{spotInfo[0].wind.directionType}
              </div>
              <div className=" text-lg font-bold text-stone-950 flex">
                {spotInfo[0].wind.speed}
                <div className="ml-1 text-xs align-bottom self-center">KPH</div>
              </div>
            </div>
            <div className="relative w-1/2">
              <Image
                width={500}
                height={500}
                className="w-full h-full z-0"
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
          <div className="flex flex-col justify-between">
            <div className="flex">
              <div>
                <div className="font-bold">
                  {spotInfo[0].tide.next.type === 'HIGH' ? '漲潮中' : '退潮中'}
                </div>
                <div>
                  <div className="text-lg font-bold text-stone-950 flex">
                    {spotInfo[0].tide.current.height}
                    <div className="ml-1 text-xs align-bottom self-center">
                      M
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-4xl">
                {spotInfo[0].tide.next.type === 'HIGH' ? (
                  <TrendingUpIcon fontSize="inherit" />
                ) : (
                  <TrendingDownIcon />
                )}
              </div>
            </div>
            <div>
              {spotInfo[0].tide.next.type === 'HIGH' ? (
                <div className="text-sm font-bold text-stone-700">
                  下一次滿潮:{spotInfo[0].tide.next.height}M{' '}
                  {new Date(
                    spotInfo[0].tide.next.timestamp * 1000
                  ).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              ) : (
                <div className="text-sm font-bold text-stone-700">
                  下一次乾潮:{spotInfo[0].tide.next.height}M{' '}
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
          <div className="text-lg font-bold text-stone-950">
            {spotInfo[0].waterTemp.max > 25
              ? '防磨衣'
              : spotInfo[0].waterTemp.max > 20
              ? '1~2mm 防寒衣/防磨衣'
              : spotInfo[0].waterTemp.max > 17
              ? '2mm 春季防寒衣'
              : spotInfo[0].waterTemp.max > 11
              ? '3/2 or 4/3 mm防寒衣'
              : spotInfo[0].waterTemp.max > 7
              ? '4/3 or 5/4 mm防寒衣'
              : '太冷了建議先想清楚'}
            <div className=" flex">
              <WaterIcon className="text-blue-700" />
              {spotInfo[0].waterTemp.max}
              <div className="ml-1 text-xs align-bottom self-center">。C</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CurrentSection;
