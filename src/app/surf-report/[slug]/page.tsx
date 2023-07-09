import { headers } from 'next/headers'; 
import Chart from '@/components/Chart';
import CurrentSection from '@/components/CurrentSection';

  

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
  // const currentInfo=await getAllSpotInfo(params.slug);


  
  return (
    <div className="w-full flex items-center flex-col">
      <div className="w-full h-[250px] flex">
        <div className="w-1/2 flex justify-center items-center bg-slate-500">
        {spotInfo.name}:{params.slug}
        </div>
        <div className="w-1/2  flex justify-center items-center bg-orange-400">
          浪點回報區
        </div>
      </div>
      <div className="w-[1280px] flex">
        <div></div>
        <div></div>
      </div>
      <CurrentSection id={params.slug}/>
      <Chart id={params.slug} />
      <div className="w-[1000px] flex flex-wrap">
        <div className="w-1/2 h-[200px] text-center"><div className=' text-xl text-teal-500'>最佳季節</div>{spotInfo.bestSeason}</div>
        <div className="w-1/2 h-[200px] text-center"><div className=' text-xl text-teal-500'>類型</div>{spotInfo.category.map((i:string)=>i).join("、")}</div>
        <div className="w-1/2 h-[200px] text-center"><div className=' text-xl text-teal-500'>面向</div>{spotInfo.direction}</div>
        <div className="w-1/2 h-[200px] text-center"><div className=' text-xl text-teal-500'>等級</div>{spotInfo.difficulty}</div>
        <div className="w-1/2 h-[200px] text-center"><div className=' text-xl text-teal-500'>地形</div>{spotInfo.bottom}</div>
        <div className="w-1/2 h-[200px] text-center"><div className=' text-xl text-teal-500'>方向</div>{spotInfo.surfWay}</div>
      </div>
    </div>
  );
}
