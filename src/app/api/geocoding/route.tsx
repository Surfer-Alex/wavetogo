import { NextResponse } from 'next/server';
export const revalidate = 0;
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    const res = await fetch(
      // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=region&language=en&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}
// &language=zh-TW
