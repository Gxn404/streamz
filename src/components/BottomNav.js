function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#ff5722] via-[#ff0000] to-[#ffe100] p-4 md:hidden">
      <div className="container mx-auto flex items-center justify-around">
        <div className="text-white">Home</div>
        <div className="text-white">Trending</div>
        <div className="text-white">Playlists</div>
        <div className="text-white">Live Now</div>
      </div>
    </nav>
  );
}

export default BottomNav;