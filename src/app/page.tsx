'use client'

import Image from 'next/image'
import landing from '../../public/images/landing.jpg'
export default function Home() {
  return (
    <main className="flex min-h-[calc(100%-50px)] flex-col items-center">
      <div className='max-w-[1280px] w-full '>
        <Image src={landing} alt='landing' className='w-full h-[500px] object-fill'/>
        <div className='w-full flex flex-col'>
          <div>SURF SPOT</div>
          <div className='flex'>
            <div className='max-w-[258px] w-full flex flex-col'>content1</div> 
            <div className='max-w-[258px] w-full flex flex-col'>content2</div>
            <div className='max-w-[258px] w-full flex flex-col'>content3</div>
            <div className='max-w-[258px] w-full flex flex-col'>content4</div>
            <div className='max-w-[258px] w-full flex flex-col'>content5</div>  
          </div>
        </div>  
        <div className='w-full flex flex-col'>
          <div>Favorites</div>
          <div className='flex'>
            <div className='max-w-[258px] w-full flex flex-col'>content1</div> 
            <div className='max-w-[258px] w-full flex flex-col'>content2</div>
            <div className='max-w-[258px] w-full flex flex-col'>content3</div>
            <div className='max-w-[258px] w-full flex flex-col'>content4</div>
            <div className='max-w-[258px] w-full flex flex-col'>content5</div>  
          </div>
        </div>  
        <div className='w-full flex flex-col'>
        <div>Forecast</div>
        
        </div>
      </div>
      
    </main>
  )
}
