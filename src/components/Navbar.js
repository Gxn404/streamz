// Suggested code may be subject to a license. Learn more: ~LicenseLog:1928031035.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:698260584.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3693373198.
import React, { useState } from 'react';
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-[#ff5722] via-[#ff0000] to-[#ffe100] p-4 transition-all duration-300 shadow-md dark:bg-black dark:shadow-white md:flex md:items-center  dark:text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-white font-bold text-xl">StreamZ Music</div>
          <input
            type="text"
            placeholder="Search"
            className="w-64 p-2 rounded-full bg-gray-800  text-white"
          />
          <ul className="flex space-x-4">
            <li className="text-white cursor-pointer">Home</li>
            <li className="text-white cursor-pointer">Trending</li>
            <li className="text-white cursor-pointer">Playlists</li>
            <li className="text-white cursor-pointer">Live Now</li>
          </ul>
        </div>
        <div className="flex gap-4">
          <button className="bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Login</button>
          <button className="bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Signup</button>
            <button id='dark-mode-toggle' className='text-white focus:outline-none rounded-full p-2 flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            
              Dark Mode
            </button>
            <div className='text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>

        </div>
        <div className="text-white">Profile</div>
      </div>
    </nav>
  );
}

export default Navbar;