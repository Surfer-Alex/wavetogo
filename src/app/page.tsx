
import Image from 'next/image'
import landing from '../../public/images/landing.jpg'
import FavoritesList from '@/components/FavoritesList'
import RandomList from '@/components/RandomList'

export default async function Home() {
  
  

  return (
    <main className="flex min-h-[calc(100%-50px)] flex-col items-center">
      <div className='max-w-[1280px] w-full '>
        
        <Image src={landing} alt='landing' className='w-full h-[500px] object-fill'/>
         
        <div className='w-full flex flex-col'>
          <RandomList/>
          <FavoritesList/>
        </div>  
        
      </div>
      
    </main>
  )
}

