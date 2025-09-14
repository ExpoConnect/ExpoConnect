
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Visit } from "@/api/entities";
import { Stand } from "@/api/entities";
import { User } from "@/api/entities";
import { Search, Heart, Star, Filter, Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";
import CollectionGrid from "../components/collection/CollectionGrid";
import CollectionFilters from "../components/collection/CollectionFilters";

export default function CollectionPage() {
  const [visits, setVisits] = useState([]);
  const [stands, setStands] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    industry: "all",
    rating: "all",
    favorites: false,
    withNotes: false
  });
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadData();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = visits.filter(visit => {
      const stand = stands.find(s => s.id === visit.stand_id);
      if (!stand) return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          stand.company_name?.toLowerCase().includes(searchLower) ||
          stand.stand_number?.toLowerCase().includes(searchLower) ||
          visit.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (filters.industry !== "all" && stand.industry !== filters.industry) {
        return false;
      }

      // Rating filter
      if (filters.rating !== "all") {
        const minRating = parseInt(filters.rating);
        if (!visit.rating || visit.rating < minRating) {
          return false;
        }
      }

      // Favorites filter
      if (filters.favorites && !visit.is_favorite) {
        return false;
      }

      // Notes filter
      if (filters.withNotes && (!visit.notes || visit.notes.trim() === "")) {
        return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_date) - new Date(a.created_date);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "company":
          const standA = stands.find(s => s.id === a.stand_id);
          const standB = stands.find(s => s.id === b.stand_id);
          return (standA?.company_name || "").localeCompare(standB?.company_name || "");
        default:
          return 0;
      }
    });

    setFilteredVisits(filtered);
  }, [visits, stands, searchTerm, filters, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const userVisits = await Visit.filter({ visitor_id: userData.id }, "-created_date");
      setVisits(userVisits);

      // Load stand data for all visits
      const standIds = [...new Set(userVisits.map(v => v.stand_id))];
      if (standIds.length > 0) {
        const standPromises = standIds.map(id => Stand.filter({ id: id }));
        const standResults = await Promise.all(standPromises);
        const allStands = standResults.flat();
        setStands(allStands);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const stats = {
    total: visits.length,
    favorites: visits.filter(v => v.is_favorite).length,
    withNotes: visits.filter(v => v.notes && v.notes.trim() !== "").length,
    avgRating: visits.reduce((sum, v) => sum + (v.rating || 0), 0) / (visits.length || 1)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Exhibition Collection
          </h1>
          <p className="text-gray-600 text-lg">
            All the stands you've visited and connected with
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Stands Visited</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              <p className="text-xs text-gray-500">Favorites</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.withNotes}</p>
              <p className="text-xs text-gray-500">With Notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search stands, companies, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-md"
              />
            </div>
          </div>

          <CollectionFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            stands={stands}
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="company">Company Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CollectionGrid
          visits={filteredVisits}
          stands={stands}
          onRefresh={loadData}
        />
      </div>
    </div>
  );
}
