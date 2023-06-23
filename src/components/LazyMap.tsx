
import React, { useState ,useEffect ,useRef} from 'react';
import { MapContainer,Marker, TileLayer,Popup,useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import surfSpotIcon from '../../public/images/Surf.png';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import '@changey/react-leaflet-markercluster/dist/styles.min.css';  
import { LatLng,Map } from 'leaflet';





const SpotIcon = new L.Icon({
  iconUrl: surfSpotIcon.src,
  iconSize: [32,45],
}); 

interface SpotInfo {
    lat:number,
    lon:number
    name: string;
    conditions:{value:string};
    waveHeight:{
        min:string,
        max:string
    };
    weather:{
        condition:string,
        temperature:string
    };
    rating:{key:string}


  }

const getSpotData = async (setSpotInfo: (spotInfo: SpotInfo[]) => void) => {
  try {
    const response = await fetch(
      "https://services.surfline.com/kbyg/mapview?south=21.755561&west=119.438618&north=25.365470&east=122.025492");
    const data = await response.json();
    const spotNameData : SpotInfo[] = data.data.spots
      setSpotInfo(spotNameData);
      
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
    const [map, setMap] = useState<Map|null>(null);
    const markerRef = useRef<(typeof Marker)[]>([]);
    const ZOOM_LEVEL = 8;
    
    useEffect(() => {
      getSpotData(setSpotInfo);
      // getSpotByServer(setSpotInfo);
    
    }, []);
    useEffect(() => {
        
        console.log(map);
      }, [map]);
    //定位功能
    function LocationMarker() {
      const [position, setPosition] = useState<LatLng| null>(null)
      const map = useMapEvents({
        click() {
          map.locate()
        },
        locationfound(e) {
          setPosition(e.latlng)
          map.flyTo(e.latlng, map.getZoom())
        },
      })
      console.log(position);
      return position === null ? null : (
        <Marker position={position} icon={SpotIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )
    }

   

    //左邊浪點list
    const flyToSpot =( lat:number,lon:number,idx:number ) => {
      
      if (map) {
        map.flyTo([lat,lon], 15);
        map.once('moveend', () => {
          // 在這裡添加您想要在 flyTo 完成後執行的操作
          if (markerRef.current && markerRef.current[idx]) {
            (markerRef.current[idx]as any).openPopup();
        }
      });
     }
      
    }
    
    return (
      <>
        
        <div className="h-screen w-screen flex justify-end ">
          <div className="h-screen w-1/2 flex flex-wrap overflow-auto">
          {spotInfo?.map((i,idx)=>{
            return(
            <>
            <div key={idx} className="h-[200px] w-1/2">
              <div className="font-bold text-blue-700">{i.name}</div>
              <div>{i.conditions.value}</div>
              <div>最大浪高:{i.waveHeight.max} M</div>
              <div>天氣狀況:{i.weather.condition}</div>
              <div>氣溫:{i.weather.temperature}。C</div>
              

              <button className="font-bold border-2 border-black" onClick={() => flyToSpot(i.lat, i.lon,idx)} >檢視</button>
            </div>
            </>    
            );
          })}
 
          </div>
          <MapContainer center={{lat: 23.553118, lng: 121.0211024}} zoom={ZOOM_LEVEL} ref={setMap}  className="h-screen w-6/12">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup   showCoverageOnHover={false} >
            {spotInfo?.map((i,idx)=>{
              
              return(
                <Marker key={idx} ref={(el) => ((markerRef.current[idx] as any) = el)} position={[i.lat,i.lon]} icon={SpotIcon}>
              <Popup>
              這裡是{i.name} <br/> 浪況評價:{i.rating.key}<br/> 浪高:{i.waveHeight.min}m~{i.waveHeight.max}m
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