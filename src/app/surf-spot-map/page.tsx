'use client'
import dynamic from 'next/dynamic'


const Map = dynamic(
  () => import('../../components/LazyMap'), // replace '@components/map' with your component's location
  { 
    loading: () => <p>A map is loading</p>,
    ssr: false } // This line is important. It's what prevents server-side render
)

function Page() {

  return <Map />

}

export default Page