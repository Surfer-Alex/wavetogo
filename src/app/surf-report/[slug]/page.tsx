import { headers } from "next/headers";
import Chart from "@/components/Chart";
import CurrentSection from "@/components/CurrentSection";

import DetailPageReport from "@/components/DetailPageReport";

const getSpotInfo = async (id: string) => {
  const headersData = headers();
  const protocol = headersData.get("x-forwarded-proto");
  const host = headersData.get("host");

  const response = await fetch(`${protocol}://${host}/api/firebase/?id=${id}`);
  const data = await response.json();
  return data[0];
};

export default async function Page({ params }: { params: { slug: string } }) {
  const spotInfo = await getSpotInfo(params.slug);

  return (
    <div className="flex w-full flex-col items-center bg-[#ffffff] ">
      <DetailPageReport id={params.slug} />

      <CurrentSection id={params.slug} />
      <Chart id={params.slug} />
      <div className="mt-5 w-full max-w-[1280px] px-5 text-3xl font-bold text-stone-950 2xl:px-0">
        <div className="self-center">Spot Info</div>
      </div>
      <div className="mb-5 mt-5 flex w-full max-w-[1000px] flex-wrap justify-center">
        <div className="m-2 h-[150px] w-45% rounded-3xl bg-slate-100 text-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] sm:w-1/4">
          <div className=" mt-3 h-1/5 text-2xl font-bold text-slate-700">
            Best Season
          </div>
          <div className="font-base flex h-4/5 items-center justify-center text-xl text-slate-700">
            {spotInfo.bestSeason}
          </div>
        </div>
        <div className="m-2 h-[150px] w-45% rounded-3xl bg-slate-100 text-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] sm:w-1/4">
          <div className=" mt-3 h-1/5 text-2xl font-bold text-slate-700">
            Category
          </div>
          <div className="font-base flex h-4/5 items-center justify-center text-xl text-slate-700">
            {spotInfo.category.map((i: string) => i).join("、")}
          </div>
        </div>
        <div className="m-2 h-[150px] w-45% rounded-3xl bg-slate-100 text-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] sm:w-1/4">
          <div className=" mt-3 h-1/5 text-2xl font-bold text-slate-700">
            Direction
          </div>
          <div className="font-base flex h-4/5 items-center justify-center text-xl text-slate-700">
            {spotInfo.direction}
          </div>
        </div>
        <div className="m-2 h-[150px] w-45% rounded-3xl bg-slate-100 text-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] sm:w-1/4">
          <div className=" mt-3 h-1/5 text-2xl font-bold text-slate-700">
            Level
          </div>
          <div className="font-base flex h-4/5 items-center justify-center text-xl text-slate-700">
            {spotInfo.difficulty}
          </div>
        </div>
        <div className="m-2 h-[150px] w-45% rounded-3xl bg-slate-100 text-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] sm:w-1/4">
          <div className=" mt-3 h-1/5 text-2xl font-bold text-slate-700">
            Bottom
          </div>
          <div className="font-base flex h-4/5 items-center justify-center text-xl text-slate-700">
            {spotInfo.bottom}
          </div>
        </div>
        <div className="m-2 h-[150px] w-45% rounded-3xl bg-slate-100 text-center shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] sm:w-1/4">
          <div className=" mt-3 h-1/5 text-2xl font-bold text-slate-700">
            Left or Right
          </div>
          <div className="font-base flex h-4/5 items-center justify-center text-xl text-slate-700">
            {spotInfo.surfWay}
          </div>
        </div>
      </div>
    </div>
  );
}
