"use client";
import Image from "next/image";
import { useStore } from "@/store";
import OutboundOutlinedIcon from "@mui/icons-material/OutboundOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import WaterIcon from "@mui/icons-material/Water";

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

  const colorClasses: ColorClasses = {
    VERY_POOR: "text-red-600",
    POOR: "text-amber-600",
    POOR_TO_FAIR: "text-yellow-500",
    FAIR: "text-green-600",
    FAIR_TO_GOOD: "text-emerald-700",
    GOOD: "text-blue-600",
    EPIC: "text-fuchsia-800",
  };
  const waveRatingColor =
    colorClasses[spotInfo[0]?.conditions.value] || "text-gray-500";

  const compassSector = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];

  const windDirection =
    compassSector[Math.round(spotInfo[0]?.wind.direction / 22.5)];
  return (
    spotInfo[0] && (
      <div className="mt-5 w-full max-w-[1280px] px-5 2xl:px-0">
        <div className=" text-3xl font-bold text-stone-950">
          <div className="self-center">Current Conditions</div>
        </div>
        <div className="mt-5 flex w-full flex-wrap justify-between lg:justify-around xl:flex-nowrap">
          <div className="my-[10px] flex h-[150px] w-full rounded-3xl bg-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] lg:w-45% xl:w-32%">
            <div className="flex w-2/5 flex-col items-center">
              <div className=" mt-4 text-base font-semibold text-slate-700 sm:text-lg">
                {spotInfo[0].waveHeight.humanRelation}
              </div>

              <div className=" mt-2 flex text-2xl font-bold text-stone-950 sm:text-3xl">
                {spotInfo[0].waveHeight.min}~{spotInfo[0].waveHeight.max}
                <div className="ml-1 self-end text-base">M</div>
              </div>

              <div
                className={`${waveRatingColor} mt-2 text-lg font-bold sm:text-xl`}
              >
                {spotInfo[0].conditions.value.replace(/_/g, " ")}
              </div>
            </div>

            <Image
              width={100}
              height={100}
              className="w-2/5"
              alt="spot wheather icon"
              src={`https://wa.cdn-surfline.com/quiver/0.21.2/weathericons/${spotInfo[0].weather.condition}.svg`}
            />
            <div className="flex w-1/5 items-center text-3xl font-bold text-stone-950">
              <div className="flex">
                {spotInfo[0].weather.temperature}
                <div className="ml-1 self-end text-base">°C</div>
              </div>
            </div>
          </div>
          <div className="my-[10px] flex h-[170px] w-full  rounded-3xl bg-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] lg:h-[150px] lg:w-45%  xl:w-32%">
            <div className="flex flex-grow flex-col items-center justify-center xl:w-2/5">
              <div className="text-lg font-bold text-slate-700 sm:text-2xl xl:text-base">
                {spotInfo[0].wind.directionType} Wind
              </div>
              <div className=" mt-2 flex text-3xl font-bold text-stone-950 sm:text-4xl xl:text-3xl">
                {spotInfo[0].wind.speed}
                <div className="ml-1 self-end  text-lg xl:text-base">KPH</div>
              </div>
              <div className=" mt-4 flex text-lg font-bold text-slate-700 xl:text-sm">
                {spotInfo[0].wind.gust}
                <div className="self-center align-bottom">
                  KPH gust {windDirection}
                </div>
              </div>
            </div>
            <div className="relative ml-auto w-1/2 sm:w-2/5 xl:w-3/5">
              <Image
                width={500}
                height={500}
                className="h-full w-full rounded-3xl"
                alt="spot static map"
                src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${spotInfo[0].lon},${spotInfo[0].lat},14,0/500x350?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-200">
                <OutboundOutlinedIcon
                  style={{
                    transform: `rotateZ(${
                      spotInfo[0].wind.direction + 135
                    }deg)`,
                    fontSize: "4rem",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="my-[10px] flex h-[150px] w-full flex-col items-center rounded-3xl bg-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] sm:w-48% lg:w-45% xl:w-16%">
            <div className="flex items-end">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="mt-4 text-2xl font-bold text-slate-700 xl:text-base">
                  {spotInfo[0].tide.next.type === "HIGH"
                    ? "Rising tide"
                    : "Falling tide"}
                </div>
                <div>
                  <div className="mt-2 flex text-3xl font-bold text-stone-950">
                    {spotInfo[0].tide.current.height}
                    <div className="ml-1 self-end text-base">M</div>
                  </div>
                </div>
              </div>
              <div className="ml-4 w-2/6 text-5xl xl:ml-2">
                {spotInfo[0].tide.next.type === "HIGH" ? (
                  <TrendingUpIcon fontSize="inherit" />
                ) : (
                  <TrendingDownIcon fontSize="inherit" />
                )}
              </div>
            </div>
            <div className="mt-4 text-center">
              {spotInfo[0].tide.next.type === "HIGH" ? (
                <div className="text-xl font-bold text-stone-700 xl:text-sm">
                  HIGH {spotInfo[0].tide.next.height}M at{" "}
                  {new Date(
                    spotInfo[0].tide.next.timestamp * 1000,
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              ) : (
                <div className="text-xl font-bold text-stone-700 xl:text-sm">
                  LOW {spotInfo[0].tide.next.height}M at{" "}
                  {new Date(
                    spotInfo[0].tide.next.timestamp * 1000,
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="my-[10px] flex h-[150px] w-full flex-col items-center justify-center rounded-3xl bg-slate-100 font-bold text-stone-950 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] sm:w-48% lg:w-45% xl:w-16%">
            <div className="text-3xl text-slate-700 xl:text-xl">
              {spotInfo[0].waterTemp.max > 25
                ? "Rash Guard"
                : spotInfo[0].waterTemp.max > 20
                ? "1~2mm Wetsuit/Rash Guard"
                : spotInfo[0].waterTemp.max > 17
                ? "2mm Spring Suit"
                : spotInfo[0].waterTemp.max > 11
                ? "3/2 or 4/3 mm Weitsuit"
                : spotInfo[0].waterTemp.max > 7
                ? "4/3 or 5/4 mm Weitsuit"
                : "Stay Home,Buddy!"}
            </div>
            <div className="mt-2 flex items-center text-4xl xl:text-3xl">
              <WaterIcon className="mr-1 text-blue-700" fontSize="inherit" />
              {spotInfo[0].waterTemp.max}
              <div className="ml-1 self-end text-base">°C</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CurrentSection;
