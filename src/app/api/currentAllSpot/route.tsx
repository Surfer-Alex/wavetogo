import { NextResponse } from 'next/server';
export const runtime = 'edge';
export const revalidate = 0;

export async function GET() {
  try {
    
    const baseUrl = 'https://services.surfline.com/kbyg';

    const allSpot = await fetch(`${baseUrl}/mapview?south=21.755561&west=119.438618&north=25.365470&east=122.025492`, {
      cache: 'no-store',
    });
   

    const parsedSpot = await allSpot.json();
    return NextResponse.json(parsedSpot);
  } catch (error) {
    return new NextResponse(error as undefined);
  }
}
