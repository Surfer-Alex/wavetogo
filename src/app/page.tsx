import LandingPage from "@/components/LandingPage";

export default async function Home() {
  return (
    <main className="bg-waves flex min-h-[calc(100%-500px)] w-full flex-col  items-center bg-[#ffffff]">
      <LandingPage />
    </main>
  );
}
