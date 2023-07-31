'use client';
import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('../../components/LazyMap'), // replace '@components/map' with your component's location
  {
    loading: () => {
      return (
        <div className='w-screen h-negativeHeader flex justify-center items-center'>
        <div
          className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        </div>
      );
    },
    ssr: false,
  } // This line is important. It's what prevents server-side render
);

function Page() {
  return <Map />;
}

export default Page;
