import Chart from '@/components/Chart';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="w-full h-[250px] flex ">
        <div className="w-1/2  flex justify-center items-center bg-slate-500">
          Jialeshuei{params.slug}
        </div>
        <div className="w-1/2  flex justify-center items-center bg-orange-400">
          浪點回報區
        </div>
      </div>
      <Chart />
    </>
  );
}
