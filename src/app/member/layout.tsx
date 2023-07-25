'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMember =
    pathname === '/member'
      ? 'border-r-sky-700 border-r-4 transition duration-400 ease-in-out transform'
      : null;
  const isFavorites =
    pathname === '/member/favorites'
      ? 'border-r-sky-700 border-r-4 transition duration-400 ease-in-out transform'
      : null;

  return (
    <>
      <div className="w-full flex justify-center h-negativeHeaderFooter">
        <div className="max-w-[1280px] w-full flex items-center">
          <div className="text-2xl font-bold w-1/4 h-3/5 flex flex-col justify-center rounded-2xl bg-gray-100">
            <Link
              className={`h-[100px] flex justify-center items-center opacity-70 hover:opacity-100 ${isMember}`}
              href={'/member'}
            >
              <button className="transition duration-300 ease-in-out transform hover:scale-110">
                Profile
              </button>
            </Link>
            <Link
              className={`h-[100px] flex justify-center items-center opacity-70 hover:opacity-100 ${isFavorites}`}
              href={'/member/favorites'}
            >
              <button className="transition duration-300 ease-in-out transform hover:scale-110">
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
