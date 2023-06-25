import { NextResponse } from 'next/server'

export async function GET() {
  try{
  const res = await fetch('https://services.surfline.com/kbyg/mapview?south=21.755561&west=119.438618&north=25.365470&east=122.025492', {
    cache:'no-store'
  })
  const data= await res.json()
  return NextResponse.json(data)
  }catch (error) {
    return new NextResponse(error as undefined)
  }
}
