import { useEffect, useState } from "react";
import { useStore } from "@/store";
import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Image from "next/image";
import { Spot } from "@/store";
import SpotChart from "./SpotChart";
import Link from "next/link";
type ColorClasses = {
  [key: string]: string;
};

interface UidProps {
  uid: string | undefined;
}
function HomePageSpotList({ uid }: UidProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const { spotData } = useStore();

  useEffect(() => {
    if (uid) {
      fetchFavorites();
    } else {
      getRandomSpots();
    }
  }, [spotData]);

  const getRandomSpots = async () => {
    const randomSpots = await spotData.data.spots
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setSpots(randomSpots);
  };

  const fetchFavorites = async () => {
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}`);
      const parsedData = await data.json();

      const spotInfo = spotData.data.spots.filter((spot) =>
        parsedData.favorites.includes(spot._id),
      );
      setSpots(spotInfo);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const handleSlide = (distance: number) => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + distance;
    }
  };

  const handleSlideLeft = () => handleSlide(-500);
  const handleSlideRight = () => handleSlide(500);
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
    <>
      {uid ? (
        <div className=" mt-6 text-3xl font-bold">Favorites</div>
      ) : (
        <div className=" mt-6 text-3xl font-bold">Recommend Spot for you</div>
      )}
      {spots.length > 0 ? (
        <>
          <div className="relative  mt-4 w-full">
            <div
              className="absolute -left-7 top-1/2 flex -translate-y-1/2 items-center rounded-3xl bg-gray-100 text-6xl opacity-40 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] hover:opacity-100"
              onClick={handleSlideLeft}
            >
              <ArrowLeftOutlinedIcon
                className="hidden sm:block"
                fontSize="inherit"
              />
            </div>
            <div
              id="slider"
              className="no-scrollbar h-full w-full overflow-x-scroll scroll-smooth whitespace-nowrap"
            >
              {spots.map((spot, idx) => {
                const waveRatingColor =
                  colorClasses[spot.rating.key] || "text-gray-500";
                return (
                  <Link key={idx} href={`/surf-report/${spot._id}`}>
                    <div className=" m-4 inline-block h-[230px] w-[250px] rounded-3xl bg-slate-100 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] sm:h-[300px] sm:w-[320px]">
                      <Image
                        width={500}
                        height={500}
                        className="h-[125px] w-full rounded-t-3xl sm:h-[150px]"
                        alt="spot static map with marker"
                        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-l+f44546(${spot.lon},${spot.lat})/${spot.lon},${spot.lat},15,0/600x300?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
                      />

                      <div className="text-medium  ml-6 mt-2 font-bold text-gray-600 sm:mt-5 sm:text-xl">
                        {spot.name}
                      </div>
                      <div className="ml-6 mt-2 text-2xl font-bold text-gray-800  sm:mt-5 sm:text-3xl">
                        {spot.waveHeight.min}-{spot.waveHeight.max} m
                      </div>
                      <div
                        className={`${waveRatingColor}  ml-6 mt-1 font-bold sm:text-base`}
                      >
                        {spot.rating.key.replace(/_/g, " ")}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div
              className="absolute -right-7 top-1/2 flex -translate-y-1/2 items-center rounded-3xl bg-gray-100 text-6xl opacity-40 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] hover:opacity-100"
              onClick={handleSlideRight}
            >
              <ArrowRightOutlinedIcon
                className="hidden sm:block"
                fontSize="inherit"
              />
            </div>
          </div>
          <div className="mt-6 text-3xl font-bold">Forecast</div>
          <SpotChart randomSpots={spots} />
        </>
      ) : (
        <div className="flex h-[300px] w-full flex-col items-center justify-center">
          <div className=" flex items-center text-3xl font-bold">
            Welcome to
            <div className="ml-1 text-2xl text-blue-600">WAVE TO GO!</div>
          </div>
          <div className="font-base mt-2 text-2xl">Lets find some waves!</div>
          <Link href="/surf-spot-map">
            <div className="mt-2 text-6xl">
              <AddCircleIcon fontSize="inherit" />
            </div>
          </Link>
        </div>
      )}
    </>
  );
}

export default HomePageSpotList;
