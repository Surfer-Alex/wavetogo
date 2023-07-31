"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBounds } from "leaflet";
import surfSpotIcon from "../../public/images/Surf.png";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import { Map as Mymap } from "leaflet";
import Link from "next/link";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userPrivateStore } from "@/store";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import useProgressBar from "@/hooks/useProgressBar";
import CardSkeleton from "./CardSkeleton";
interface SpotInfo {
  lat: number;
  lon: number;
  name: string;
  conditions: { value: string };
  waveHeight: {
    min: string;
    max: string;
  };
  weather: {
    condition: string;
    temperature: string;
  };
  rating: { key: string };
  bestSeason: string;
  _id: string;
  difficulty: string[];
  region: string;
}
type ColorClasses = {
  [key: string]: string;
};

const SpotIcon = new L.Icon({
  iconUrl: surfSpotIcon.src,
  iconSize: [32, 45],
});

async function getFireSpotByServer() {
  const data = await fetch("/api/firebase");

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  const formatedData = await data.json();

  return formatedData;
}

async function getRegion(lat: number, lon: number) {
  try {
    const response = await fetch(`/api/geocoding/?lat=${lat}&lon=${lon}`, {
      cache: "force-cache",
    });
    const data = await response.json();

    return data.features[0].text_en;
  } catch (error) {
    console.error(error);
  }
}

const getSpotData = async (
  setSpotInfo: (spotInfo: SpotInfo[]) => void,
  setIsSpotLoading: (isLoading: boolean) => void,
) => {
  try {
    const response = await fetch(
      "https://services.surfline.com/kbyg/mapview?south=21.755561&west=119.438618&north=25.365470&east=122.025492",
      { cache: "no-store" },
    );
    const data = await response.json();
    const spotData = data.data.spots;

    const fireSpotInfo = await getFireSpotByServer();

    const newArray = [];
    const map = new Map();

    for (let i = 0; i < spotData.length; i++) {
      map.set(spotData[i].name, spotData[i]);
    }
    for (let j = 0; j < fireSpotInfo.length; j++) {
      if (map.has(fireSpotInfo[j].name)) {
        newArray.push({ ...map.get(fireSpotInfo[j].name), ...fireSpotInfo[j] });
      }
    }

    const promises = newArray.map((item) => getRegion(item.lat, item.lon));
    const regions = await Promise.all(promises);
    newArray.forEach((item, index) => {
      item.region = regions[index];
    });

    setSpotInfo(newArray);
    setIsSpotLoading(false);
  } catch (error) {
    console.error(error);
  }
};

const LazyMap = () => {
  // const [center, setCenter] = useState({ lat: 23.553118, lng: 121.0211024 });
  const [spotInfo, setSpotInfo] = useState<SpotInfo[] | null>(null);
  const [map, setMap] = useState<Mymap | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>("");
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSpotLoading, setIsSpotLoading] = useState<boolean>(true);

  const markerRef = useRef<L.Marker[]>([]);
  const ZOOM_LEVEL = 7;
  const uid = userPrivateStore.getState().userInfo?.uid;

  useEffect(() => {
    getSpotData(setSpotInfo, setIsSpotLoading);
    fetchFavorites();
  }, []);
  useEffect(() => {
    setBounds(map?.getBounds());
  }, [map]);

  const flyToSpot = (
    event: React.MouseEvent,
    lat: number,
    lon: number,
    idx: number,
  ) => {
    event.preventDefault();
    if (map) {
      map.flyTo([lat, lon], 15, { duration: 1.5 });
      map.once("moveend", () => {
        if (markerRef.current && markerRef.current[idx]) {
          markerRef.current[idx].openPopup();
        }
      });
    }
  };

  map?.once("moveend", () => {
    const bounds = map.getBounds();
    setBounds(bounds);
  });
  const filteredMarkers = spotInfo?.filter((marker) => {
    return bounds?.contains([marker.lat, marker.lon]);
  });

  const filteredDiffcultyByLevel = filteredMarkers?.filter((i) => {
    const difficultyMatch = selectedLevel
      ? i.difficulty.includes(selectedLevel)
      : spotInfo;

    const regionMatch = selectedRegion ? i.region === selectedRegion : spotInfo;

    return difficultyMatch && regionMatch;
  });

  const splitLevels = spotInfo?.flatMap((i) => i.difficulty);
  const Levels = Array.from(new Set(splitLevels));

  const splitRegion = spotInfo?.flatMap((i) => i.region);
  const regions = Array.from(new Set(splitRegion));

  const fetchFavorites = async () => {
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}`);
      const parsedData = await data.json();
      setFavorites(parsedData.favorites);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const handleAddToFavorites = async (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}&id=${id}`, {
        method: "POST",
      });

      if (favorites) {
        setFavorites((prevFavorites) => [...prevFavorites, id]);
      } else {
        setFavorites([id]);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };
  const handleRemoveFromFavorites = async (
    event: React.MouseEvent,
    id: string,
  ) => {
    event.preventDefault();
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}&id=${id}`, {
        method: "DELETE",
      });

      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav !== id),
      );
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
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

  const [ref, completion] = useProgressBar();

  return (
    <>
      <div className="relative flex h-negativeHeader w-screen  flex-col-reverse font-bold lg:flex-row">
        <div className=" absolute bottom-6 z-10 flex  w-screen flex-col bg-transparent lg:relative lg:h-full lg:w-1/3 lg:bg-[#ffffff]  xl:w-1/2">
          <div className="relative flex w-full border-slate-400  sm:w-1/2 lg:flex lg:w-full lg:border-b-2">
            <div className="flex h-24 w-1/2 flex-col  px-8 lg:mt-4 lg:h-[100px]">
              <label
                htmlFor="level"
                className="mb-2 block text-lg font-bold text-gray-900 dark:text-gray-400"
              >
                Level
              </label>

              <select
                defaultValue=""
                onChange={(e) => setSelectedLevel(e.target.value)}
                id="level"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {Levels.map((level, idx) => {
                  return (
                    <option key={idx} value={level}>
                      {level}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex h-24 w-1/2 flex-col  px-8 lg:mt-4 lg:h-[100px] ">
              <label
                htmlFor="region"
                className="mb-2 block  text-lg font-bold text-gray-900 dark:text-gray-400"
              >
                Region
              </label>
              <select
                defaultValue=""
                onChange={(e) => setSelectedRegion(e.target.value)}
                id="region"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {regions.map((region, idx) => {
                  return (
                    <option key={idx} value={region}>
                      {region}
                    </option>
                  );
                })}
              </select>
            </div>
            <span
              style={{ transform: `translateX(${completion - 100}%)` }}
              className="bottom-0 hidden h-1 w-full rounded-xl bg-slate-400 transition-transform duration-500 ease-in-out lg:absolute lg:inline"
            />
          </div>

          <motion.div
            layout
            ref={ref}
            className="no-scrollbar mx-4 flex gap-6 overflow-x-auto rounded-2xl lg:mx-0 lg:flex-wrap lg:overflow-y-auto lg:rounded-none lg:p-10"
          >
            <AnimatePresence>
              {isSpotLoading && <CardSkeleton cards={35} />}

              {filteredDiffcultyByLevel?.map((i, idx) => {
                const waveRatingColor =
                  colorClasses[i.rating.key] || "text-gray-500";

                return (
                  <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className={` relative  h-[140px] transform rounded-2xl bg-slate-100 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]  hover:z-10  lg:h-[280px]  lg:w-full lg:transition lg:duration-200 lg:hover:-translate-y-1   lg:hover:scale-105 lg:hover:shadow-[5px_5px_0px_0px_rgba(243,203,172)]  xl:w-negativeGap`}
                    key={idx}
                  >
                    <Link
                      href={`/surf-report/${i._id}`}
                      className="flex h-full w-[400px] lg:w-full lg:flex-col"
                    >
                      <Image
                        priority={true}
                        width={800}
                        height={400}
                        quality={100}
                        className="h-full w-2/5 rounded-l-xl lg:h-[162px] lg:w-full lg:rounded-t-2xl"
                        alt="spot static map with marker"
                        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-l+f44546(${i.lon},${i.lat})/${i.lon},${i.lat},15,0/1000x500?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
                      />
                      <div className="flex-grow">
                        <div className="ml-6 mt-3 flex items-center text-xl font-bold text-gray-600 lg:mt-1">
                          {i.name}
                          {favorites?.some((fav) => fav === i._id) ? (
                            <button
                              className="ml-auto mr-2 text-4xl text-red-600 md:text-2xl"
                              onClick={(event) =>
                                handleRemoveFromFavorites(event, i._id)
                              }
                            >
                              <FavoriteIcon fontSize="inherit" />
                            </button>
                          ) : (
                            <button
                              className="ml-auto mr-2 text-4xl md:text-2xl"
                              onClick={(event) =>
                                handleAddToFavorites(event, i._id)
                              }
                            >
                              <FavoriteBorderIcon fontSize="inherit" />
                            </button>
                          )}
                        </div>
                        <div className="ml-6 mt-1 flex text-lg font-bold text-gray-800 lg:text-3xl">
                          {i.waveHeight.min}-{i.waveHeight.max} m
                        </div>
                        <div
                          className={`${waveRatingColor} ml-6 mt-1 text-base font-bold`}
                        >
                          {i.rating.key.replace(/_/g, " ")}
                        </div>
                      </div>
                    </Link>
                    <button
                      className=" absolute bottom-4 right-4 ml-6 rounded-full text-base font-bold hover:opacity-70"
                      onClick={(event) => flyToSpot(event, i.lat, i.lon, idx)}
                    >
                      Fly To Spot
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="  h-full w-full lg:w-2/3 xl:w-1/2">
          <MapContainer
            center={{ lat: 23.553118, lng: 121.0211024 }}
            zoom={ZOOM_LEVEL}
            ref={setMap}
            className="z-0 h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup showCoverageOnHover={false}>
              {filteredDiffcultyByLevel?.map((i, idx) => {
                const waveRatingColor =
                  colorClasses[i.rating.key] || "text-gray-500";
                return (
                  <Marker
                    key={idx}
                    ref={(el) => {
                      if (el !== null) {
                        markerRef.current[idx] = el;
                      }
                    }}
                    position={[i.lat, i.lon]}
                    icon={SpotIcon}
                  >
                    <Popup>
                      <div className="">
                        <div className="flex items-center justify-center text-lg">
                          <Image
                            width={50}
                            height={50}
                            className=""
                            alt="spot wheather icon"
                            src={`https://wa.cdn-surfline.com/quiver/0.21.2/weathericons/${i.weather.condition}.svg`}
                          />
                          {i.weather.temperature}°C
                        </div>
                        <div className="text-lg">{i.name}</div>
                        <div className={`${waveRatingColor}`}>
                          {i.rating.key.replace(/_/g, " ")}
                        </div>

                        <div>{i.difficulty ? i.difficulty : "無資料"}</div>
                        <div>{i.region ? i.region : "無資料"}</div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
            {/* <LocationMarker /> */}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default LazyMap;
