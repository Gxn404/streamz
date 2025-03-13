import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black text-white w-full sticky top-0 border-b border-gray-600">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo - Left Corner */}
        <div className="flex items-center ">
          <h1 className="text-2xl font-bold text-white">StreamZ</h1>
        </div>

        {/* Search Bar - Middle */}
        <div className="flex-grow mx-8 ">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full px-4 py-2 w-full"
              
            />
          </div>
        </div>

        {/* Profile & Notification - Right Corner */}
        <div className="flex items-center space-x-4 ">
           {/* Icons will go here */}
           <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-700">
            <span className="block text-white text-center">Notification</span>
            </div>
        </div>
          {/* Notification Bell */}
          <button className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.05-.595 1.43L4 17h5m10 0v-2c0-.707-.36-1.333-.972-1.681A1.819 1.819 0 0015 12v-2c0-.707-.36-1.333-.972-1.681A1.819 1.819 0 0013 8V6a1 1 0 00-2 0v2a1.819 1.819 0 00-.972.681A1.819 1.819 0 009 10v2c0 .707.36 1.333.972 1.681.327.223.768.345 1.23.345H20z" />
            </svg>
          </button>

          {/* Profile */}
          <div className="w-8 h-8 rounded-full bg-gray-500">
            <span className="block text-white text-center">Profile</span>
            </div>
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;