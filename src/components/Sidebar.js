function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-black text-white p-4">
      <ul>
        <li className="text-white hover:text-gray-300 cursor-pointer mb-2">Home</li>
        <li className="text-white hover:text-gray-300 cursor-pointer mb-2">Trending</li>
        <li className="text-white hover:text-gray-300 cursor-pointer mb-2">Subscriptions</li>
      </ul>
    </div>
  );
}

export default Sidebar;