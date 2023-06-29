import { NextResponse } from 'next/server';
export const runtime = 'edge';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const baseUrl = 'https://services.surfline.com/kbyg/spots/forecasts';
    const waveRes = await fetch(
      `${baseUrl}/wave?spotId=${id}&days=5`,
      { cache: 'no-store' }
    );
    const windRes = await fetch(
      `${baseUrl}/wind?spotId=${id}&days=5`,
      { cache: 'no-store' }
    );
    const tideRes = await fetch(
      `${baseUrl}/tides?spotId=${id}&days=5`,
      { cache: 'no-store' }
    );
    
    const waveData = await waveRes.json();
    const windData = await windRes.json();
    const tideData = await tideRes.json();
    return NextResponse.json({waveData,windData,tideData});
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}
