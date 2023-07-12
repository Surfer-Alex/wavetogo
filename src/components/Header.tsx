'use client'
import Link from "next/link";
import {useEffect,useState} from 'react'
import {userStore} from '@/store'
import Image from "next/image";
import { usePathname } from 'next/navigation';
import logo from '../../public/images/logo.png'
import headerUserIcon from '../../public/images/icons8-male-user-96.png';


const Header = () => {
  // const userIcon = userStore.getState().photoURL;
  const [showLogo, setShowLogo] = useState(false);
    useEffect(() => {
        setShowLogo(true);
    }, [showLogo]);
  const userIcon = userStore((state)=>state.photoURL);
  const pathname = usePathname();
  // console.log(pathname);
  const isActive = pathname === '/';
  const homepage = isActive ? 'bg-transparent absolute w-full text-white' : 'sticky text-black border-b-2 border-slate-400 bg-[#ffffff]';
  const searchForm=isActive?'':'border border-slate-700';
  
  

  
  
  return (
    <div className={`z-50 flex h-[80px] top-0  text-2xl ${homepage} `}>
      <Link className='flex' href="/">
        <div className="h-full w-[80px] ml-8"><Image quality={100} src={logo} width={500} height={500} alt='logo' className='w-full h-full  rounded-full'/></div>
      <div className="self-center  ">WAVE TO GO</div></Link>
      <Link className='flex' href="/surf-spot-map"><button className="self-center ml-10  ">SURF SPOT MAP</button></Link>
      <div className="self-center ml-auto">
        <input type="text" className={`py-2 px-4  rounded-full focus:outline-none ${searchForm}`} placeholder="What you looking for?"/>
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