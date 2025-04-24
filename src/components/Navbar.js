import React, { useState, useEffect } from "react";
import { Input } from "@/components/Input";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-[#ff5722] via-[#ff0000] to-[#ffe100] p-4 transition-all duration-300 shadow-md dark:bg-black dark:shadow-white md:flex md:items-center dark:text-white">
      <div className="container mx-auto flex items-center justify-between">
		/* Logo and Search */
		<div className="flex items-center gap-4">
			<div className="text-white font-bold text-xl">StreamZ</div>
			<div className="relative flex items-center">
				<Input 
					className="pr-10 rounded-r-none" 
					type="text" 
					placeholder="Search..." 
					value={searchQuery || ''}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<button 
					onClick={handleSearch}
					className="bg-white dark:bg-gray-800 p-2 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				>
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="0 0 24 24" 
						fill="none" 
						stroke="currentColor" 
						strokeWidth="2" 
						strokeLinecap="round" 
						strokeLinejoin="round" 
						className="w-5 h-5"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</button>
			</div>
		</div>

		{/* Navigation Links */}
        <ul className="hidden md:flex space-x-4">
          <li className="text-white cursor-pointer hover:underline">Home</li>
          <li className="text-white cursor-pointer hover:underline">Trending</li>
          <li className="text-white cursor-pointer hover:underline">Playlists</li>
          <li className="text-white cursor-pointer hover:underline">Live Now</li>
        </ul>

        {/* Buttons & Dark Mode Toggle */}
        <div className="flex gap-4 items-center">
          <button className="bg-transparent hover:bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Login
          </button>
          <button className="bg-transparent hover:bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Signup
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-white focus:outline-none rounded-full p-2 flex items-center gap-2 hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Profile Icon */}
          <div className="text-white cursor-pointer hover:scale-105 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
