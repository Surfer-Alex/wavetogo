"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMember =
    pathname === "/member"
      ? "border-sky-700  border-b-4 md:border-b-0 md:border-r-4 transition duration-400 ease-in-out transform"
      : null;
  const isFavorites =
    pathname === "/member/favorites"
      ? "border-sky-700  border-b-4 md:border-b-0 md:border-r-4 transition duration-400 ease-in-out transform"
      : null;

  return (
    <>
      <div className="flex h-negativeHeaderFooter w-full justify-center px-0 sm:px-10">
        <div className="flex w-full max-w-[1280px] flex-col items-center md:flex-row">
          <div className="flex w-full justify-center bg-gray-100 text-2xl font-bold md:h-3/5 md:w-1/4 md:flex-col md:rounded-2xl">
            <Link
              className={`flex h-[100px] w-1/2 items-center justify-center opacity-70 hover:opacity-100 md:w-full ${isMember}`}
              href={"/member"}
            >
              <button className="transform transition duration-300 ease-in-out hover:scale-110">
                Profile
              </button>
            </Link>
            <Link
              className={`flex h-[100px] w-1/2 items-center justify-center opacity-70 hover:opacity-100 md:w-full ${isFavorites}`}
              href={"/member/favorites"}
            >
              <button className="transform transition duration-300 ease-in-out hover:scale-110">
                Favorites
              </button>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
