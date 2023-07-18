import { Permanent_Marker } from 'next/font/google';
import Image from 'next/image';
import landing from '../../public/images/landing.jpg';
import FavoritesList from '@/components/FavoritesList';
import RandomList from '@/components/RandomList';

const inter = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
});

export default async function Home() {
  return (
    <main className="flex min-h-[calc(100%-500px)] flex-col items-center w-full  bg-waves bg-[#ffffff]">
      <div className="mask-waves">
        <Image
          src={landing}
          width={500}
          height={500}
          alt="landing"
          className="w-screen h-[800px] object-fill rounded-b-6xl relative  "
        />
        <div
          className={` text-white text-9xl  absolute top-60 left-56 ${inter.className} transform  -skew-y-12 drop-shadow-2xl`}
        >
          WAVE TO GO
        </div>
      </div>
      <div className="max-w-[1280px] w-full ">
        <div className="w-full flex flex-col mb-6">
          <RandomList />
          <FavoritesList />
        </div>
      </div>
    </main>
  );
}

// bg-[#f3cbac6f]
