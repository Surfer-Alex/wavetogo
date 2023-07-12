import { headers } from 'next/headers'; 
import Chart from '@/components/Chart';
import CurrentSection from '@/components/CurrentSection';


import DetailPageReport from '@/components/DetailPageReport';

const getSpotInfo=async(id:string)=>{
const headersData = headers();
const protocol = headersData.get('x-forwarded-proto');
const host = headersData.get('host');
  

  const response = await fetch(`${protocol}://${host}/api/firebase/?id=${id}`);
  const data = await response.json();
  return data[0];
}
// const getAllSpotInfo=async(id:string)=>{
//   const response = await fetch('http://localhost:3000/api/currentAllSpot');
//   const data = await response.json();
//   const filtedInfo = data.data.spots.map((i:Spots)=>i).filter((i:Spots)=>i._id===id)
//   return filtedInfo;
// }

export default async function Page({ params }: { params: { slug: string } }) {
  const spotInfo= await getSpotInfo(params.slug);
  
  

  
  return (
    <div className="w-full flex items-center flex-col bg-[#ffffff]"> 
      <DetailPageReport id={params.slug}/>
      
      <CurrentSection id={params.slug}/>
      <Chart id={params.slug} />
      <div className="max-w-[1280px] w-full text-3xl font-bold text-stone-950 mt-5">
          <div className="self-center">Spot Info</div>
        </div>
      <div className="max-w-[1000px] w-full flex flex-wrap mt-5 mb-5 justify-center">
      
        <div className="mx-4 my-4 w-1/4 h-[150px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] rounded-3xl bg-slate-100 text-center">
          <div className=' font-bold text-2xl text-slate-700 h-1/5 mt-3'>Best Season</div>
          <div className='font-base text-xl text-slate-700 h-4/5 flex justify-center items-center'>{spotInfo.bestSeason}</div>
        </div>
        <div className="mx-4 my-4 w-1/4 h-[150px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] rounded-3xl bg-slate-100 text-center">
          <div className=' font-bold text-2xl text-slate-700 h-1/5 mt-3'>Category</div>
          <div className='font-base text-xl text-slate-700 h-4/5 flex justify-center items-center'>{spotInfo.category.map((i:string)=>i).join("、")}</div>
        </div>
        <div className="mx-4 my-4 w-1/4 h-[150px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] rounded-3xl bg-slate-100 text-center">
          <div className=' font-bold text-2xl text-slate-700 h-1/5 mt-3'>Direction</div>
          <div className='font-base text-xl text-slate-700 h-4/5 flex justify-center items-center'>{spotInfo.direction}</div>
        </div>
        <div className="mx-4 my-4 w-1/4 h-[150px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] rounded-3xl bg-slate-100 text-center">
          <div className=' font-bold text-2xl text-slate-700 h-1/5 mt-3'>Level</div>
          <div className='font-base text-xl text-slate-700 h-4/5 flex justify-center items-center'>{spotInfo.difficulty}</div>
        </div>
        <div className="mx-4 my-4 w-1/4 h-[150px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] rounded-3xl bg-slate-100 text-center">
          <div className=' font-bold text-2xl text-slate-700 h-1/5 mt-3'>Bottom</div>
          <div className='font-base text-xl text-slate-700 h-4/5 flex justify-center items-center'>{spotInfo.bottom}</div>
        </div>
        <div className="mx-4 my-4 w-1/4 h-[150px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] rounded-3xl bg-slate-100 text-center">
          <div className=' font-bold text-2xl text-slate-700 h-1/5 mt-3'>Left or Right</div>
          <div className='font-base text-xl text-slate-700 h-4/5 flex justify-center items-center'>{spotInfo.surfWay}</div>
        </div>
        
      </div>
    </div>
  );
}
