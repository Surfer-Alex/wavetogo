'use client';
import { useEffect, useState } from 'react';
import { useStore, userStore } from '@/store';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import Image from 'next/image';
import { Spot } from '@/store';
type ColorClasses = {
  [key: string]: string;
};

function FavoritesList() {
  const [login, setLogin] = useState(false);
  const [favoritesSpotInfo, setFavoritesSpotInfo] = useState<Spot[]>([])
  const uid = userStore.getState().uid;
  const { spotData } = useStore();
  
  useEffect(() => {
    if (uid) {
      setLogin(true);
      fetchFavorites();
    }
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}`);
      const parsedData = await data.json();
      
      const spotInfo = spotData.data.spots.filter((spot) =>
        parsedData.favorites.includes(spot._id)
      );
      setFavoritesSpotInfo(spotInfo)
      console.log(spotInfo);
      
      
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleSlide = (distance: number) => {
    const slider = document.getElementById('slider');
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + distance;
    }
  };
  
  const handleSlideLeft = () => handleSlide(-500);
  const handleSlideRight = () => handleSlide(500);
  const colorClasses:ColorClasses = {
    VERY_POOR: 'text-red-600',
    POOR: 'text-amber-600',
    POOR_TO_FAIR: 'text-yellow-500',
    FAIR: 'text-green-600',
    FAIR_TO_GOOD: 'text-emerald-700',
    GOOD: 'text-blue-600',
    EPIC: 'text-fuchsia-800',
  };
  return (
    login && (
      <>
        <div>Favorites</div>
        <div className="w-full h-[320px] relative">
          <div
            className="absolute left-0 top-1/2 rounded-full flex items-center opacity-20 -translate-y-1/2 text-6xl shadow shadow-current bg-gray-100 hover:opacity-100"
            onClick={handleSlideLeft}
          >
            <ArrowLeftOutlinedIcon className="" fontSize="inherit" />
          </div>
          <div
            id="slider"
            className="w-full h-full whitespace-nowrap overflow-x-scroll no-scrollbar scroll-smooth"
          >
            {favoritesSpotInfo.map((spot, idx) => {
              const waveRatingColor = colorClasses[spot.rating.key] || 'text-gray-500';
              return (
                <div
                  className=" w-[320px] h-[300px] mx-[5px] my-[10px] inline-block shadow-xl shadow-current rounded-3xl bg-slate-100"
                  key={idx}
                >
                  
                    <Image 
                    width={500}
                    height={500}
                    className="w-full h-[150px] rounded-t-3xl"
                    alt="spot static map with maeker" src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/pin-l+f44546(${spot.lon},${spot.lat})/${spot.lon},${spot.lat},15,0/600x300?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&logo=false`}/>
                  
                  <div className="font-bold text-gray-600 ml-6 mt-5 text-xl">
                    {spot.name}
                  </div>
                  <div className="text-gray-800 font-bold ml-6 mt-5 text-3xl">
                    {spot.waveHeight.min}-{spot.waveHeight.max} m
                  </div>
                  <div className={`${waveRatingColor} ml-6 mt-1 text-base font-bold`}>
                    {spot.rating.key.replace(/_/g, ' ')}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="absolute right-0 top-1/2 rounded-full flex items-center opacity-20 -translate-y-1/2 text-6xl shadow shadow-current bg-gray-100 hover:opacity-100"
            onClick={handleSlideRight}
          >
            <ArrowRightOutlinedIcon className="" fontSize="inherit" />
          </div>
        </div>
      </>
    )
  );
}

export default FavoritesList;

{
  /* <div className='max-w-[258px] w-full flex flex-col'>content1</div> 
<div className='max-w-[258px] w-full flex flex-col'>content2</div>
<div className='max-w-[258px] w-full flex flex-col'>content3</div>
<div className='max-w-[258px] w-full flex flex-col'>content4</div>
<div className='max-w-[258px] w-full flex flex-col'>content5</div>  */
}
