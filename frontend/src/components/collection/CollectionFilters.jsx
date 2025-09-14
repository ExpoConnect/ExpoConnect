import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

const industries = [
  "technology",
  "healthcare", 
  "automotive",
  "finance",
  "retail",
  "manufacturing",
  "education",
  "food",
  "fashion",
  "other"
];

export default function CollectionFilters({ filters, onFiltersChange, stands }) {
  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === 'industry') return value !== 'all';
    if (key === 'rating') return value !== 'all';
    return value === true;
  });

  const clearFilter = (filterKey) => {
    if (filterKey === 'industry' || filterKey === 'rating') {
      onFiltersChange({ ...filters, [filterKey]: 'all' });
    } else {
      onFiltersChange({ ...filters, [filterKey]: false });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      industry: "all",
      rating: "all", 
      favorites: false,
      withNotes: false
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-800">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Filter Options</h4>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <Select
                value={filters.industry}
                onValueChange={(value) => onFiltersChange({ ...filters, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
              <Select
                value={filters.rating}
                onValueChange={(value) => onFiltersChange({ ...filters, rating: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites"
                  checked={filters.favorites}
                  onCheckedChange={(checked) => 
                    onFiltersChange({ ...filters, favorites: checked })
                  }
                />
                <label
                  htmlFor="favorites"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Favorites only
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="withNotes"
                  checked={filters.withNotes}
                  onCheckedChange={(checked) => 
                    onFiltersChange({ ...filters, withNotes: checked })
                  }
                />
                <label
                  htmlFor="withNotes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  With notes only
                </label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {activeFilters.map(([key, value]) => (
            <Badge
              key={key}
              variant="secondary"
              className="bg-indigo-100 text-indigo-800 flex items-center gap-1"
            >
              {key === 'industry' && value !== 'all' 
                ? value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : key === 'rating' && value !== 'all'
                ? `${value}+ Stars`
                : key === 'favorites'
                ? 'Favorites'
                : 'With Notes'
              }
              <button
                onClick={() => clearFilter(key)}
                className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}