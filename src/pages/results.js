import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import VideoCardMatrix from '../components/VideoCardMatrix/VideoCardMatrix';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { query } = router.query;
    
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            
            try {
                const response = await axios.get(`https://streamz-roan.vercel.app/api/search?type=videos&query=${encodeURIComponent(query)}`);
                setResults(response.data);
                console.log('Search results:', response.data);
                setLoading(false);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to load search results');
                setLoading(false);
            }
        };
        
        fetchSearchResults();
    }, [query]);
    
    const handleSearch = (searchQuery) => {
        router.push(`/results?query=${encodeURIComponent(searchQuery)}`);
    };
    
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center p-8 mt-10 bg-black/50 backdrop-blur-sm rounded-lg">
                    <h2 className="text-red-500 text-xl font-bold mb-4">{error}</h2>
                    <Button onClick={() => router.push('/')}>Return Home</Button>
                </div>
            );
        }
        
        if (!query) {
            return (
                <div className="flex flex-col items-center justify-center p-8 mt-10 bg-black/50 backdrop-blur-sm rounded-lg">
                    <h2 className="text-yellow-500 text-xl font-bold mb-4">No search query provided</h2>
                    <Input 
                        onSearch={handleSearch}
                        placeholder="What would you like to watch?"
                        className="max-w-lg"
                    />
                </div>
            );
        }
        
        if (results.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-8 mt-10 bg-black/50 backdrop-blur-sm rounded-lg">
                    <h2 className="text-yellow-500 text-xl font-bold mb-4">No results found for "{query}"</h2>
                    <p className="text-gray-400 mb-6">{`Try different keywords or check spelling`}</p>
                    <Input 
                        onSearch={handleSearch}
                        placeholder="Try another search..."
                        className="max-w-lg"
                    />
                </div>
            );
        }
        
        return (
            <div className="mt-8">
                <VideoCardMatrix videos={results} />
            </div>
        );
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-red-500 mb-2">Search Results</h1>
                    {query && !loading && !error && results.length > 0 && (
                        <p className="text-gray-300 text-lg">
                            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                        </p>
                    )}
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default SearchResults;
