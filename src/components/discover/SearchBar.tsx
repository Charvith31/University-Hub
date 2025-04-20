import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SearchBarProps {
  searchTerm: string;
  searchType: 'name' | 'skill' | 'branch' | 'year';
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onSearchTypeChange: () => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
}

export const SearchBar = ({
  searchTerm,
  searchType,
  loading,
  onSearchTermChange,
  onSearch,
  onSearchTypeChange,
  onKeyPress
}: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row mb-6 space-y-2 md:space-y-0 md:space-x-2">
      <div className="relative flex-grow">
        <Input 
          type="text" 
          placeholder={`Search by ${searchType}...`} 
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={onKeyPress}
          className="pr-10"
          aria-label={`Search by ${searchType}`}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onSearchTypeChange}
          title={`Currently searching by: ${searchType}. Click to change.`}
          className="flex-shrink-0"
          type="button"
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={onSearch} 
          disabled={loading}
          className="flex-shrink-0 w-full md:w-auto"
          type="button"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
};
