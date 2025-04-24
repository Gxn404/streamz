import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar, AvatarImage, AvatarFallback } from '../Avatar/Avatar';
import { Search, Loader2, Mic } from "lucide-react";
import { useRouter } from 'next/router';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  // Handle search input change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 2) {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(`https://streamZ-roan.vercel.app/api/ai?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Perform search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowSuggestions(false);
    router.push(`/results?query=${encodeURIComponent(searchQuery)}`).finally(() => setIsSearching(false));
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) handleSearch();
  };

  // Voice search
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      if (searchInputRef.current) searchInputRef.current.value = transcript;
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (searchInputRef.current) searchInputRef.current.value = suggestion;
    router.push(`/results?query=${encodeURIComponent(suggestion)}`);
  };

  // Insert suggestion
  const handleInsertSuggestion = (suggestion, e) => {
    e.stopPropagation();
    e.preventDefault();
    const newQuery = `${searchQuery.trim()} ${suggestion}`.trim();
    setSearchQuery(newQuery);
    if (searchInputRef.current) {
      searchInputRef.current.value = newQuery;
      searchInputRef.current.focus();
    }
    handleSearchChange({ target: { value: newQuery } });
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.focus();
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="bg-black text-white w-[90vw] sticky top-0 border-b border-gray-600 z-[9999]">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">StreamZ</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-8">
          <div className="relative">
            <div className="flex items-center">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search videos, creators, or playlists"
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              value={searchQuery}
              className="flex-grow bg-gray-900 border-gray-700 rounded-md focus:ring-0 text-white placeholder-gray-400 px-4 py-2"
              showClearButton={true}
              onClear={clearSearch}
              />
              
              {/* Search Button */}
              <Button
                variant="primary"
                size="default"
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="bg-red-600 hover:bg-red-700 h-11 px-4 py-2 rounded-l-none"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                
              </Button>
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {isLoadingSuggestions ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between group"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center flex-grow">
                          <Search className="h-4 w-4 mr-2 text-gray-400" />
                          {suggestion}
                        </div>
                        <button
                          className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 ml-2 opacity-0 group-hover:opacity-100"
                          onClick={(e) => handleInsertSuggestion(suggestion, e)}
                          title="Add to current search"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-400">No suggestions found</div>
                )}
              </div>
            )}
          </div>
        </div>

            {/* Voice Search Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceSearch}
                className={`p-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                title="Search by voice"
              >
                <Mic className="h-5 w-5" />
              </Button>

        {/* Profile & Notification */}
        <div className="flex items-center space-x-4">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.05-.595 1.43L4 17h5m10 0v-2c0-.707-.36-1.333-.972-1.681A1.819 1.819 0 0015 12v-2c0-.707-.36-1.333-.972-1.681A1.819 1.819 0 0013 8V6a1 1 0 00-2 0v2a1.819 1.819 0 00-.972.681A1.819 1.819 0 009 10v2c0 .707.36 1.333.972 1.681.327.223.768.345 1.23.345H20z"
              />
            </svg>
          </button>
          <Avatar>
            <AvatarImage src="/path/to/profile.jpg" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;