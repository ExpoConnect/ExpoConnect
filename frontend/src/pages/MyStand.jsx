import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stand } from "@/api/entities";
import { User } from "@/api/entities";
import { Visit } from "@/api/entities";
import { QrCode, Plus, Eye, Users, Star, Heart } from "lucide-react";
import StandSetup from "../components/exhibitor/StandSetup";
import VisitorsList from "../components/exhibitor/VisitorsList";
import QRCodeDisplay from "../components/exhibitor/QRCodeDisplay";

export default function MyStandPage() {
  const [user, setUser] = useState(null);
  const [stands, setStands] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [selectedStand, setSelectedStand] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const userStands = await Stand.filter({ exhibitor_id: userData.id });
      setStands(userStands);

      if (userStands.length > 0) {
        // Load visits for all stands
        const allVisits = [];
        for (const stand of userStands) {
          const standVisits = await Visit.filter({ stand_id: stand.id });
          allVisits.push(...standVisits);
        }
        setVisits(allVisits);

        // Calculate stats
        const totalVisitors = allVisits.length;
        const favorites = allVisits.filter(v => v.is_favorite).length;
        const avgRating = allVisits.reduce((sum, v) => sum + (v.rating || 0), 0) / (allVisits.length || 1);
        const withNotes = allVisits.filter(v => v.notes && v.notes.trim() !== "").length;

        setStats({
          totalVisitors,
          favorites,
          avgRating: avgRating.toFixed(1),
          withNotes
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (stands.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              My Exhibition Stand
            </h1>
            <p className="text-gray-600 text-lg">
              Set up your exhibition presence and start connecting with visitors
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your First Stand</h2>
              <p className="text-gray-600 mb-8">
                Set up your exhibition stand with company information, QR code, and catalog to start attracting visitors.
              </p>
              <Button
                onClick={() => setShowSetup(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Stand
              </Button>
            </CardContent>
          </Card>

          {showSetup && (
            <StandSetup
              user={user}
              onClose={() => setShowSetup(false)}
              onSuccess={loadData}
            />
          )}
        </div>
      </div>
    );
  }

  const mainStand = stands[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {mainStand.company_name}
            </h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
                Stand {mainStand.stand_number}
              </Badge>
              <Badge variant="outline">
                {mainStand.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => setShowSetup(true)}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Edit Stand
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVisitors || 0}</p>
              <p className="text-xs text-gray-500">Total Visitors</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.favorites || 0}</p>
              <p className="text-xs text-gray-500">Favorites</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating || 0}</p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.withNotes || 0}</p>
              <p className="text-xs text-gray-500">With Feedback</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VisitorsList 
              visits={visits}
              stand={mainStand}
            />
          </div>
          <div>
            <QRCodeDisplay 
              stand={mainStand}
            />
          </div>
        </div>

        {showSetup && (
          <StandSetup
            user={user}
            stand={mainStand}
            onClose={() => setShowSetup(false)}
            onSuccess={loadData}
          />
        )}
      </div>
    </div>
  );
}