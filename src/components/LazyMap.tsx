'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngBounds } from 'leaflet';
import surfSpotIcon from '../../public/images/Surf.png';
import navigation from '../../public/images/navigation.png';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import '@changey/react-leaflet-markercluster/dist/styles.min.css';
import { LatLng, Map as Mymap } from 'leaflet';
import Link from 'next/link';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userPrivateStore } from '@/store';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import useProgressBar from '@/hooks/useProgressBar';
import CardSkeleton from './CardSkeleton';
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
const LocateIcon = new L.Icon({
  iconUrl: navigation.src,
  iconSize: [32, 45],
});

async function getFireSpotByServer() {
  const data = await fetch('/api/firebase');

  if (!data.ok) {
    throw new Error('Failed to fetch data');
  }

  const formatedData = await data.json();

  return formatedData;
}

async function getRegion(lat: number, lon: number) {
  try {
    const response = await fetch(`/api/geocoding/?lat=${lat}&lon=${lon}`, {
      cache: 'force-cache',
    });
    const data = await response.json();
    // console.log(data.features[0].text_en);

    // const results = data.results;
    // //中文版配google geocoding api這裡超複雜，因為google api資料排序問題，找不到規則，要一直切資料
    // const filteredRegionString = await data.results[results.length - 3]
    //   .formatted_address;
    // const taiwanIndex = filteredRegionString.indexOf('台灣');
    // const extractedString = filteredRegionString.slice(
    //   taiwanIndex + 2,
    //   taiwanIndex + 5
    // );

    return data.features[0].text_en;
  } catch (error) {
    console.error(error);
  }
}

const getSpotData = async (
  setSpotInfo: (spotInfo: SpotInfo[]) => void,
  setIsSpotLoading: (isLoading: boolean) => void
) => {
  try {
    const response = await fetch(
      'https://services.surfline.com/kbyg/mapview?south=21.755561&west=119.438618&north=25.365470&east=122.025492',
      { cache: 'no-store' }
    );
    const data = await response.json();
    const spotData = data.data.spots;

    const fireSpotInfo = await getFireSpotByServer();

    //整合兩包資料處
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

    // 遍歷數組並更新每個元素的region
    // for (const item of newArray) {
    //   const region = await getRegion(item.lat, item.lon);
    //   item.region = region;
    // }
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

// async function getSpotByServer(setSpotInfo: (spotInfo: SpotInfo[]) => void) {
//   const data = await fetch('/api/wave')
//   if (!data.ok) {
//     throw new Error('Failed to fetch data')
//       }
//   const formatedData = await data.json()
//   console.log(formatedData)
//   const spotInfo =await formatedData.data.spots
//   setSpotInfo(spotInfo)
// }

const LazyMap = () => {
  // const [center, setCenter] = useState({ lat: 23.553118, lng: 121.0211024 });
  const [spotInfo, setSpotInfo] = useState<SpotInfo[] | null>(null);
  const [map, setMap] = useState<Mymap | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>('');
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSpotLoading, setIsSpotLoading] = useState<boolean>(true);

  const markerRef = useRef<L.Marker[]>([]);
  const ZOOM_LEVEL = 7;
  const uid = userPrivateStore.getState().userInfo?.uid;

  useEffect(() => {
    getSpotData(setSpotInfo, setIsSpotLoading);
    // getSpotByServer(setSpotInfo);
    fetchFavorites();
  }, []);
  useEffect(() => {
    setBounds(map?.getBounds());
  }, [map]);
  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  //定位功能有bug先拿掉
  // function LocationMarker() {
  //   const [position, setPosition] = useState<LatLng | null>(null);
  //   const LocateMarkerRef = useRef<L.Marker>(null);
  //   const map = useMapEvents({
  //     click() {
  //       map.locate();
  //     },
  //     locationfound(e) {
  //       setPosition(e.latlng);
  //       map.flyTo(e.latlng, map.getZoom());
  //       map.once('moveend', () => {
  //         // 在這裡添加您想要在 flyTo 完成後執行的操作

  //         LocateMarkerRef.current?.openPopup();
  //       });
  //     },
  //   });

  //   return position === null ? null : (
  //     <Marker ref={LocateMarkerRef} position={position} icon={LocateIcon}>
  //       <Popup>你在這</Popup>
  //     </Marker>
  //   );
  // }

  //左邊浪點list
  const flyToSpot = (
    event: React.MouseEvent,
    lat: number,
    lon: number,
    idx: number
  ) => {
    event.preventDefault();
    if (map) {
      map.flyTo([lat, lon], 15);
      map.once('moveend', () => {
        // 在這裡添加您想要在 flyTo 完成後執行的操作
        if (markerRef.current && markerRef.current[idx]) {
          markerRef.current[idx].openPopup();
        }
      });
    }
  };

  map?.once('moveend', () => {
    const bounds = map.getBounds();
    setBounds(bounds);
  });
  const filteredMarkers = spotInfo?.filter((marker) => {
    return bounds?.contains([marker.lat, marker.lon]);
  });

  //  const filteredDiffcultyByLevel = selectedLevel
  //   ? spotInfo?.filter((i) => i.difficulty.includes(selectedLevel))
  //   : spotInfo;

  const filteredDiffcultyByLevel = filteredMarkers?.filter((i) => {
    // 篩選困難度
    const difficultyMatch = selectedLevel
      ? i.difficulty.includes(selectedLevel)
      : spotInfo;

    // 篩選地區
    const regionMatch = selectedRegion ? i.region === selectedRegion : spotInfo;

    // 返回最終結果
    return difficultyMatch && regionMatch;
  });

  //將陣列中提取所有等級的類型，並去除重複類型，最終得到一個包含所有不同類型的陣列
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
      console.error('Error fetching favorites:', err);
    }
  };

  const handleAddToFavorites = async (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}&id=${id}`, {
        method: 'POST',
      });
      const parsedData = await data.json();
      console.log(parsedData);
      if (favorites) {
        setFavorites((prevFavorites) => [...prevFavorites, id]);
      } else {
        setFavorites([id]);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };
  const handleRemoveFromFavorites = async (
    event: React.MouseEvent,
    id: string
  ) => {
    event.preventDefault();
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}&id=${id}`, {
        method: 'DELETE',
      });
      const parsedData = await data.json();

      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav !== id)
      );
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
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

  const [ref, completion] = useProgressBar();

  return (
    <>
      <div className="h-negativeHeader w-screen flex font-bold">
        <div className="w-1/2 flex flex-col bg-[#ffffff]">
          <div className="flex border-b-2 border-slate-400 relative">
            <div className="h-[100px] px-8 w-1/2 flex flex-col   mt-4">
              <label
                htmlFor="level"
                className="block mb-2 text-lg font-bold text-gray-900 dark:text-gray-400"
              >
                Level
              </label>

              <select
                defaultValue=""
                onChange={(e) => setSelectedLevel(e.target.value)}
                id="level"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {/* <option selected value="LEVEL" disabled>
                LEVEL
              </option> */}
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
            <div className="h-[100px] px-8 w-1/2 flex flex-col mt-4 ">
              <label
                htmlFor="region"
                className="block mb-2  dark:text-gray-400 text-lg font-bold text-gray-900"
              >
                Region
              </label>
              <select
                defaultValue=""
                onChange={(e) => setSelectedRegion(e.target.value)}
                id="region"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              className=" bg-slate-400 h-1 w-full absolute bottom-0 rounded-xl transition-transform duration-500 ease-in-out"
            />
          </div>

          <motion.div
            layout
            ref={ref}
            className="w-full  flex flex-wrap gap-6  px-10 py-10 overflow-auto no-scrollbar"
          >
            <AnimatePresence>
              {isSpotLoading && <CardSkeleton cards={35} />}

              {filteredDiffcultyByLevel?.map((i, idx) => {
                const waveRatingColor =
                  colorClasses[i.rating.key] || 'text-gray-500';

                return (
                  <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className={` bg-slate-100 h-[280px] w-negativeGap  shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]  rounded-2xl hover:shadow-[5px_5px_0px_0px_rgba(243,203,172)] transform hover:scale-105 hover:-translate-y-1  transition duration-200 hover:z-10 relative}`}
                    key={idx}
                  >
                    <Link href={`/surf-report/${i._id}`}>
                      <Image
                        priority={true}
                        width={500}
                        height={500}
                        quality={100}
                        className="w-full h-[162px] rounded-t-2xl"
                        alt="spot static map with marker"
                        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-l+f44546(${i.lon},${i.lat})/${i.lon},${i.lat},15,0/1000x500?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}
                      />
                      <div className="font-bold text-gray-600 ml-6 mt-1 text-xl">
                        {i.name}
                        {favorites?.some((fav) => fav === i._id) ? (
                          <button
                            className="text-2xl ml-2 text-red-600"
                            onClick={(event) =>
                              handleRemoveFromFavorites(event, i._id)
                            }
                          >
                            <FavoriteIcon fontSize="inherit" />
                          </button>
                        ) : (
                          <button
                            className="text-2xl ml-2"
                            onClick={(event) =>
                              handleAddToFavorites(event, i._id)
                            }
                          >
                            <FavoriteBorderIcon fontSize="inherit" />
                          </button>
                        )}
                      </div>
                      <div className="text-gray-800 font-bold ml-6 mt-1 text-3xl flex">
                        {i.waveHeight.min}-{i.waveHeight.max} m
                      </div>
                      <div
                        className={`${waveRatingColor} ml-6 mt-1 text-base font-bold`}
                      >
                        {i.rating.key.replace(/_/g, ' ')}
                      </div>
                    </Link>
                    <button
                      className=" absolute right-4 bottom-4 font-bold rounded-full text-base ml-6 hover:opacity-70"
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
        <div className="w-1/2 h-full">
          <MapContainer
            center={{ lat: 23.553118, lng: 121.0211024 }}
            zoom={ZOOM_LEVEL}
            ref={setMap}
            className="h-full z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup showCoverageOnHover={false}>
              {filteredDiffcultyByLevel?.map((i, idx) => {
                const waveRatingColor =
                  colorClasses[i.rating.key] || 'text-gray-500';
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
                          {i.rating.key.replace(/_/g, ' ')}
                        </div>

                        <div>{i.difficulty ? i.difficulty : '無資料'}</div>
                        <div>{i.region ? i.region : '無資料'}</div>
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

{
  /* <div>{i.conditions.value}</div>
                  <div>最大浪高:{i.waveHeight.max} M</div>
                  <div>天氣狀況:{i.weather.condition}</div>
                  <div>氣溫:{i.weather.temperature}。C</div>
                  <div>等級:{i.difficulty ? i.difficulty : '無資料'}</div>
                  <div>區域:{i.region ? i.region : '無資料'}</div> */
}
