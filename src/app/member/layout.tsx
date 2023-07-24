export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full flex justify-center h-negativeHeaderFooter">
        <div className="max-w-[1280px] w-full flex items-center">
          <div className="text-2xl font-bold w-1/4 h-3/5 flex flex-col justify-center rounded-2xl bg-gray-100">
            <button className="h-[100px]">Profile</button>
            <button className="h-[100px]">Favorites</button>
            <button className="h-[100px]">My Reports</button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
