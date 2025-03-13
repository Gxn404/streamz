"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronRight, Play } from "lucide-react";

import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          "https://streamz-roan.vercel.app/api/trending?type=now"
        );
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        setError("Failed to fetch trending data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:px-6">
        {/* Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-xl">
          <div
            className="relative aspect-video w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: "url('/placeholder.svg?height=720&width=1280')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <h1 className="mb-2 text-3xl font-bold md:text-5xl">
                The Last Horizon
              </h1>
              <p className="mb-4 max-w-md text-sm text-muted-foreground md:text-base">
                A journey beyond the stars where humanity faces its greatest
                challenge yet. Watch the epic saga unfold in this sci-fi
                adventure.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="gap-2">
                  <Play className="h-4 w-4" /> Play Now
                </Button>
                <Button variant="outline" className="gap-2">
                  + My List
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-2xl">Trending Now</h2>
            <Button variant="link" className="gap-1 text-primary">
              See All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {loading ? (
            <p className="text-orange-500 font-bold text-center">Loading...</p>
          ) : error ? (
            <p className="text-orange-500 font-bold text-center">
              {error}
            </p> 
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {trending.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer border-2 p-4 m-2 rounded-md text-center border-orange-500 hover:border-red-500 hover:scale-105 transition-all bg-gray-900"
                >
                  <div className="relative mb-2 overflow-hidden rounded-lg">
                    <Image
                      width={300}
                      height={200}
                      src={item.image}
                      alt={item.title}
                      className="rounded-md object-cover mt-2 hover:opacity-80"
                    />
                    <h3 className="text-white text-xl font-bold hover:text-red-500 text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm p-2 text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Continue Watching */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-2xl">
              Continue Watching
            </h2>
            <Button variant="link" className="gap-1 text-primary">
              See All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative mb-2 overflow-hidden rounded-lg">
                  <img
                    src={`/placeholder.svg?height=270&width=480&text=Continue ${
                      i + 1
                    }`}
                    alt={`Continue watching ${i + 1}`}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 h-1 w-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${30 + i * 20}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Button
                    size="icon"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-sm font-medium md:text-base">
                  Galactic Wars: Episode {i + 1}
                </h3>
                <p className="text-xs text-muted-foreground">
                  45m left • Episode {i + 5}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-2xl">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              "Action",
              "Comedy",
              "Drama",
              "Sci-Fi",
              "Horror",
              "Documentary",
            ].map((category, i) => (
              <div
                key={i}
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg md:aspect-square"
              >
                <img
                  src={`/placeholder.svg?height=200&width=200&text=${category}`}
                  alt={category}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <h3 className="text-sm font-medium md:text-base">
                    {category}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */ }
      <footer className="mt-12 border-t border-border bg-background px-4 py-8 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-xl font-bold text-foreground">
              <span className="text-primary">Stream</span>Z
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/help" className="hover:text-foreground">
                Help Center
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} StreamZ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
