'use client';
import { Permanent_Marker } from 'next/font/google';
import Image from 'next/image';
import landing from '../../public/images/landing.jpg';
import FavoritesList from '@/components/FavoritesList';
import RandomList from '@/components/RandomList';
import { useEffect, useRef } from 'react';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import { userPrivateStore } from '@/store';

const inter = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
});
const LandingPage = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const uid = userPrivateStore.getState().userInfo?.uid;

  useEffect(() => {
    console.log(uid);
  }, [uid]);

  return (
    <>
      <div className=" flex justify-center items-center relative">
        <Image
          src={landing}
          width={1000}
          height={1000}
          quality={100}
          alt="landing"
          className="mask-waves w-screen h-screen object-fill rounded-b-6xl   "
        />
        <div
          className={`mb-10 text-white text-9xl  absolute   ${inter.className} transform  -skew-y-12 drop-shadow-2xl`}
        >
          WAVE TO GO
        </div>
        <button
          onClick={handleClick}
          className="bottom-0 left-1/2  text-6xl opacity-70 bg-white absolute hover:opacity-100"
        >
          <ExpandCircleDownRoundedIcon
            className="animate-bounce"
            fontSize="inherit"
          />
        </button>
      </div>
      <div ref={ref} className="max-w-[1440px] w-full px-12">
        <div className="w-full flex flex-col mb-6">
          <RandomList />
          <FavoritesList />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
