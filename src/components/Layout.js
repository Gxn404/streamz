import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen w-screen bg-black dark:bg-black text-white flex  flex-col transition-colors duration-500">      <Navbar />
      <div className="flex flex-grow pt-16">
        <Sidebar className="w-64 md:block hidden dark:text-white" />
        <div id='main-content' className="container mx-auto flex-grow p-4">
          {children}
        </div>
      </div>
        <BottomNav />
    </div>
  );
}

export default Layout;