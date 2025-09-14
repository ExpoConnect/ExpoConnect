
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User } from "@/api/entities";
import { Visit } from "@/api/entities";
import { Stand } from "@/api/entities";
import { User2, Building2, Phone, Mail, Globe, Edit, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData(userData);

      if (userData.role === 'visitor') {
        // Load visitor stats
        const visits = await Visit.filter({ visitor_id: userData.id });
        const favoritesCount = visits.filter(v => v.is_favorite).length;
        const notesCount = visits.filter(v => v.notes && v.notes.trim() !== "").length;
        const avgRating = visits.reduce((sum, v) => sum + (v.rating || 0), 0) / (visits.length || 1);
        
        setStats({
          totalVisits: visits.length,
          favorites: favoritesCount,
          notesCount,
          avgRating: avgRating.toFixed(1)
        });
      } else if (userData.role === 'exhibitor') {
        // Load exhibitor stats
        const stands = await Stand.filter({ exhibitor_id: userData.id });
        const allVisits = [];
        if (stands.length > 0) {
          for (const stand of stands) {
            const standVisits = await Visit.filter({ stand_id: stand.id });
            allVisits.push(...standVisits);
          }
        }
        
        setStats({
          totalStands: stands.length,
          totalVisitors: allVisits.length,
          totalFavorites: allVisits.filter(v => v.is_favorite).length,
          avgRating: allVisits.reduce((sum, v) => sum + (v.rating || 0), 0) / (allVisits.length || 1) || 0
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData(formData);
      setUser({ ...user, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl("Welcome"));
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account information and view your activity
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User2 className="w-6 h-6 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  disabled={saving}
                >
                  {editing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <Badge className="bg-indigo-600 text-white px-3 py-1">
                    {user.role === 'exhibitor' ? 'Exhibitor' : 'Visitor'}
                  </Badge>
                  <div>
                    <p className="font-semibold text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editing ? formData.full_name || "" : user.full_name || ""}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_name">Company</Label>
                    <Input
                      id="company_name"
                      value={editing ? formData.company_name || "" : user.company_name || ""}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={editing ? formData.position || "" : user.position || ""}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editing ? formData.phone || "" : user.phone || ""}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editing ? formData.website || "" : user.website || ""}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setFormData(user);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats and Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>
                  {user.role === 'exhibitor' ? 'Exhibition Stats' : 'Activity Stats'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.role === 'visitor' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Stands Visited</span>
                      <span className="font-semibold text-lg">{stats.totalVisits || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Favorites</span>
                      <span className="font-semibold text-lg">{stats.favorites || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Notes Added</span>
                      <span className="font-semibold text-lg">{stats.notesCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Rating Given</span>
                      <span className="font-semibold text-lg">{stats.avgRating || 0}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">My Stands</span>
                      <span className="font-semibold text-lg">{stats.totalStands || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Visitors</span>
                      <span className="font-semibold text-lg">{stats.totalVisitors || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Favorites</span>
                      <span className="font-semibold text-lg">{stats.totalFavorites || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Rating</span>
                      <span className="font-semibold text-lg">{stats.avgRating.toFixed(1) || 0}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
