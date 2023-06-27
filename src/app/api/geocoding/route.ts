import { NextResponse } from 'next/server';
export const revalidate = 0;
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&language=zh-TW&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}
