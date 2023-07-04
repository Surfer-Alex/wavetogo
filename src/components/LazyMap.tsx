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
  _id: number;
  difficulty: string[];
  region: string;
}

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
    const results = data.results;
    //這裡超複雜，因為google api資料排序問題，找不到規則，要一直切資料
    const filteredRegionString = await data.results[results.length - 3]
      .formatted_address;
    const taiwanIndex = filteredRegionString.indexOf('台灣');
    const extractedString = filteredRegionString.slice(
      taiwanIndex + 2,
      taiwanIndex + 5
    );

    return extractedString;
  } catch (error) {
    console.error(error);
  }
}

const getSpotData = async (setSpotInfo: (spotInfo: SpotInfo[]) => void) => {
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

  const markerRef = useRef<L.Marker[]>([]);
  const ZOOM_LEVEL = 8;

  useEffect(() => {
    getSpotData(setSpotInfo);
    // getSpotByServer(setSpotInfo);
  }, []);
  useEffect(() => {
    setBounds(map?.getBounds());
  }, [map]);

  //定位功能
  function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null);
    const LocateMarkerRef = useRef<L.Marker>(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        map.once('moveend', () => {
          // 在這裡添加您想要在 flyTo 完成後執行的操作

          LocateMarkerRef.current?.openPopup();
        });
      },
    });

    return position === null ? null : (
      <Marker ref={LocateMarkerRef} position={position} icon={LocateIcon}>
        <Popup>你在這</Popup>
      </Marker>
    );
  }

  //左邊浪點list
  const flyToSpot = (lat: number, lon: number, idx: number) => {
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

  return (
    <>
      <div className="h-screen w-screen flex justify-end font-bold">
        <div className="h-screen w-1/2 flex flex-wrap overflow-auto">
          <div className="h-[100px] w-full">
            <button
              className={
                !selectedLevel ? ' bg-gray-900 text-white p-2 rounded-md' : 'p-2'
              }
              onClick={() => setSelectedLevel('')}
            >
              ALL
            </button>
            {Levels.map((level, idx) => {
              const isSelected = level === selectedLevel;
              return (
                <button
                  className={
                    isSelected ? 'bg-gray-900 text-white p-2 rounded-md' : 'p-2'
                  }
                  key={idx}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              );
            })}
          </div>
          <div className="h-[100px] w-full">
            <button
              className={
                !selectedRegion ? 'bg-gray-900 text-white p-2 rounded-md' : 'p-2'
              }
              onClick={() => setSelectedRegion('')}
            >
              ALL
            </button>
            {regions.map((region, idx) => {
              const isSelected = region === selectedRegion;
              return (
                <button
                  className={
                    isSelected ? 'bg-gray-900 text-white p-2 rounded-md' : 'p-2'
                  }
                  key={idx}
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </button>
              );
            })}
          </div>
          {filteredDiffcultyByLevel?.map((i, idx) => {
            return (
              <div className="h-[200px] w-1/2" key={idx}>
                <Link href={`/surf-report/${i._id}`}>
                  <div className="font-bold text-blue-700">{i.name}</div>
                  <div>{i.conditions.value}</div>
                  <div>最大浪高:{i.waveHeight.max} M</div>
                  <div>天氣狀況:{i.weather.condition}</div>
                  <div>氣溫:{i.weather.temperature}。C</div>
                  <div>等級:{i.difficulty ? i.difficulty : '無資料'}</div>
                  <div>區域:{i.region ? i.region : '無資料'}</div>
                </Link>
                <button
                  className="font-bold border-2 border-black"
                  onClick={() => flyToSpot(i.lat, i.lon, idx)}
                >
                  檢視
                </button>
              </div>
            );
          })}
        </div>
        <MapContainer
          center={{ lat: 23.553118, lng: 121.0211024 }}
          zoom={ZOOM_LEVEL}
          ref={setMap}
          className="h-screen w-6/12"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup showCoverageOnHover={false}>
            {filteredDiffcultyByLevel?.map((i, idx) => {
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
                    這裡是{i.name} <br /> 浪況評價:{i.rating.key}
                    <br /> 浪高:{i.waveHeight.min}m~{i.waveHeight.max}m
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
          <LocationMarker />
        </MapContainer>
      </div>
    </>
  );
};

export default LazyMap;
