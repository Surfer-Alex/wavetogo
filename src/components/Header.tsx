import Link from "next/link";
import React from 'react'

const Header = () => {
  return (
    <div className="flex h-[50px] sticky top-0 text-white bg-[rgb(0,0,0)] ">
      <div className="h-[50px] w-[50px] ml-10  text-white">Logo image</div>
      <Link className='flex' href="/"><div className="self-center ml-10  text-white">WAVE TO GO</div></Link>
      <Link className='flex' href="/surf-spot-map"><button className="self-center ml-10  text-white">SURF SPOT MAP</button></Link>
      <div className="self-center ml-auto">
        <input type="text" className="p-2 rounded-full focus:outline-none text-black" placeholder="What you looking for?"/>
      </div>
      <Link className='flex' href="/member"><button className="self-center ml-10 mr-10  text-white">會員頁</button></Link>
    </div>
  )
}

export default Header