import { NextResponse } from 'next/server';
export const runtime = 'edge';
export const revalidate = 0;

export async function GET() {
  try {
    const baseUrl = 'https://services.surfline.com/kbyg/spots/forecasts';
    const waveRes = await fetch(
      `${baseUrl}/wave?spotId=640a7562e9203027bdaa7d9a&days=5`,
      { cache: 'no-store' }
    );
    const windRes = await fetch(
      `${baseUrl}/wind?spotId=640a7562e9203027bdaa7d9a&days=5`,
      { cache: 'no-store' }
    );
    const tideRes = await fetch(
      `${baseUrl}/tides?spotId=640a7562e9203027bdaa7d9a&days=5`,
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
