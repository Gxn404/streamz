"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar/Navbar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import VideoCardMatrix from '../components/VideoCardMatrix/VideoCardMatrix';
import {
  Search as SearchIcon,
  Star,
  Filter as FilterIcon,
  Heart,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function SearchResults() {
  const router = useRouter();
  const { query } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [filters, setFilters] = useState({ category: '', rating: '' });

  // fetch wrapper
  const fetchResults = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?type=videos&query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await res.json();

      if (Array.isArray(data.results)) {
        setResults((prev) => [...prev, ...data.results]);
        setTotalPages(data.total_pages || 1);
      } else {
        setError('Unexpected response format. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to load search results: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // initial + page effect
  useEffect(() => {
    setResults([]); // reset on new query
    setPage(1);
  }, [query]);

  useEffect(fetchResults, [query, page]);

  // handlers
  const handleSearch = (q) => {
    setSearchHistory((prev) => [q, ...prev.filter((h) => h !== q)].slice(0, 10));
    router.push(`/results?query=${encodeURIComponent(q)}`);
  };

  const toggleFavorite = (video) => {
    setFavorites((prev) =>
      prev.find((f) => f.id === video.id)
        ? prev.filter((f) => f.id !== video.id)
        : [...prev, video]
    );
  };

  const loadMore = () => page < totalPages && setPage((p) => p + 1);
  const handleCardClick = (video) => router.push(`/video/${video.id}`);

  // dropdown toggles
  const toggleFilterOpen = () => setFiltersOpen((o) => !o);
  const toggleHistoryOpen = () => setHistoryOpen((o) => !o);

  // filter change
  const handleFilterChange = (type, value) =>
    setFilters((prev) => ({ ...prev, [type]: value }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          {/* Title + stats */}
          <div>
            <h1 className="text-3xl font-bold text-red-500 mb-1">Search Results</h1>
            {query && !loading && !error && results.length > 0 && (
              <p className="text-gray-300">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for “{query}”
              </p>
            )}
          </div>

          {/* Controls: Search input, filters, history */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                onSearch={handleSearch}
                placeholder="Search videos..."
                className="pr-10"
                aria-label="Search videos"
              />
              <SearchIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {/* Filters */}
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
                onClick={toggleFilterOpen}
                aria-expanded={filtersOpen}
                aria-haspopup="true"
              >
                <FilterIcon size={16} />
                Filters
                {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
              {filtersOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-20"
                  role="menu"
                  aria-label="Filter options"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <X
                      size={16}
                      className="cursor-pointer"
                      onClick={toggleFilterOpen}
                      aria-label="Close filters"
                    />
                  </div>
                  <div className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="text-gray-300 block mb-1" htmlFor="filter-category">
                        Category
                      </label>
                      <select
                        id="filter-category"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded"
                      >
                        <option value="">All</option>
                        <option value="action">Action</option>
                        <option value="comedy">Comedy</option>
                        <option value="drama">Drama</option>
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-gray-300 block mb-1" htmlFor="filter-rating">
                        Rating
                      </label>
                      <select
                        id="filter-rating"
                        value={filters.rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded"
                      >
                        <option value="">All</option>
                        <option value="5">5★</option>
                        <option value="4">4★ & up</option>
                        <option value="3">3★ & up</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search History */}
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
                onClick={toggleHistoryOpen}
                aria-expanded={historyOpen}
                aria-haspopup="true"
              >
                <Heart size={16} />
                History
                {historyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
              {historyOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-20"
                  role="menu"
                  aria-label="Search history"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Search History</h3>
                    <X
                      size={16}
                      className="cursor-pointer"
                      onClick={toggleHistoryOpen}
                      aria-label="Close history"
                    />
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-auto">
                    {searchHistory.length > 0 ? (
                      searchHistory.map((item, idx) => (
                        <li key={idx}>
                          <Button
                            variant="ghost"
                            className="w-full text-left flex items-center gap-1"
                            onClick={() => handleSearch(item)}
                          >
                            <SearchIcon size={14} />
                            {item}
                          </Button>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No history yet</p>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main>
          {/* Loading */}
          {loading && query && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button onClick={() => router.push('/')}>Return Home</Button>
            </div>
          )}

          {/* No results */}
          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-20 space-y-2">
              <p className="text-yellow-500 text-lg">No results for “{query}”</p>
              <p className="text-gray-400">Try different keywords</p>
              <Input
                onSearch={handleSearch}
                placeholder="Search again..."
                className="max-w-md mx-auto"
              />
            </div>
          )}

          {/* Results */}
          {!loading && !error && results.length > 0 && (
            <>
              <VideoCardMatrix
                videos={results}
                onFavorite={toggleFavorite}
                onClick={handleCardClick}
              />
              {page < totalPages && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={loadMore}
                    className="flex items-center gap-1 px-6 py-2"
                  >
                    <SearchIcon size={14} />
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
