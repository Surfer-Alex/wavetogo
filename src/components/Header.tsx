import React from 'react'

const Header = () => {
  return (
    <div className="flex h-[50px] sticky top-0 text-white bg-[rgb(0,0,0)] ">
      <div className="h-[50px] w-[50px] ml-10  text-white">Logo image</div>
      <div className="self-center ml-10  text-white">WAVE TO GO</div>
      <button className="self-center ml-10  text-white">SURF SPOT MAP</button>
      <div className="self-center ml-auto">
        <input type="text" className="p-2 rounded-full focus:outline-none text-black" placeholder="What you looking for?"/>
      </div>
      <button className="self-center ml-10 mr-10  text-white">會員頁</button>
    </div>
  )
}

export default Header