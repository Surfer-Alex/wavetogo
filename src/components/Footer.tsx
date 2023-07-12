'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '../../public/images/logo.png'
import React from 'react'
import  Image from 'next/image'

const Footer = () => {
  const pathname = usePathname();
  const isActive = pathname === '/surf-spot-map';
  if(isActive){
  return;
  }
  return (
    
    <div className="flex h-[80px] w-full  mt-6 bottom-0 text-black text-2xl bg-[rgb(220,219,219)] ">
       <Link className='flex' href="/">
          <div className="h-full w-[80px] ml-8">
            <Image quality={100} src={logo} width={500} height={500} alt='logo' className='w-full h-full  rounded-full'/>
          </div>
          <div className="self-center  ">
            WAVE TO GO
          </div>
        </Link>
      
      <button className="self-center ml-auto  ">GITHUB</button>
      <div className="self-center ml-10 mr-10  ">LINKEDIN</div>
    </div>

  )
}

export default Footer