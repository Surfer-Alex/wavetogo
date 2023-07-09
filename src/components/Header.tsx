'use client'
import Link from "next/link";
import {useEffect,useState} from 'react'
import {userStore} from '@/store'
import Image from "next/image";
import headerUserIcon from '../../public/images/headerUser.gif'

const Header = () => {
  // const userIcon = userStore.getState().photoURL;
  const [showLogo, setShowLogo] = useState(false);
    useEffect(() => {
        setShowLogo(true);
    }, [showLogo]);
  const userIcon = userStore((state)=>state.photoURL);
  
  
  return (
    <div className=" z-50 flex h-[50px] sticky top-0 text-white bg-[rgb(0,0,0)] ">
      <div className="h-[50px] w-[50px] ml-10  text-white">Logo image</div>
      <Link className='flex' href="/"><div className="self-center ml-10  text-white">WAVE TO GO</div></Link>
      <Link className='flex' href="/surf-spot-map"><button className="self-center ml-10  text-white">SURF SPOT MAP</button></Link>
      <div className="self-center ml-auto">
        <input type="text" className="p-2 rounded-full focus:outline-none text-black" placeholder="What you looking for?"/>
      </div>
      <div className="ml-10 mr-10 self-center max-w-[40px] w-full max-h-[40px] ">
      {showLogo&&
      <Link  href="/member"><Image
                width={50}
                height={50}
                alt="member icon"
                src={userIcon||headerUserIcon}
                className="rounded-full"
                priority={true}
              /></Link>
      }</div>
    </div>
  )
}

export default Header

{/* <button className="self-center ml-10 mr-10  text-white">會員頁</button> */}