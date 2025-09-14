
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User } from "@/api/entities";
import { WhitelistedEmail } from "@/api/entities"; // Added import
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { QrCode, Users, Building2, Sparkles, ArrowRight, AlertCircle } from "lucide-react"; // Added AlertCircle import

export default function WelcomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false); // New state for access control
  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    phone: "",
    website: ""
  });

  const checkUserAccess = useCallback(async () => { // Renamed from checkUser
    try {
      const userData = await User.me();
      
      // Check if user email is whitelisted
      const whitelist = await WhitelistedEmail.filter({ 
        email: userData.email, 
        is_active: true 
      });
      
      if (whitelist.length === 0) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      
      if (userData.role) {
        // User already has a role, redirect based on role
        if (userData.role === 'exhibitor') {
          navigate(createPageUrl("MyStand"));
        } else {
          navigate(createPageUrl("Scanner"));
        }
      } else {
        setUser(userData);
      }
    } catch (error) {
      // User not logged in, show login
      // Optionally, you might want to log the error: console.error("Error checking user:", error);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    checkUserAccess(); // Changed to call checkUserAccess
  }, [checkUserAccess]);

  const handleLogin = async () => {
    await User.loginWithRedirect(window.location.href);
  };

  const handleRoleSetup = async () => {
    if (!selectedRole) return;
    
    try {
      await User.updateMyUserData({
        role: selectedRole,
        ...formData
      });
      
      if (selectedRole === 'exhibitor') {
        navigate(createPageUrl("MyStand"));
      } else {
        navigate(createPageUrl("Scanner"));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (accessDenied) { // New access denied UI
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Your email address is not authorized to access this application. 
                Please contact the administrator to request access.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact support.
                </p>
                <Button
                  onClick={() => User.logout()}
                  variant="outline"
                  className="bg-white/80"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ExpoConnect</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The ultimate networking platform for exhibitions. Connect, discover, and grow your business relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Scanning</h3>
              <p className="text-gray-600">Scan QR codes to instantly connect with exhibitors and collect business cards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Networking</h3>
              <p className="text-gray-600">Organize your connections, add notes, and never lose a valuable contact</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Rich Feedback</h3>
              <p className="text-gray-600">Rate stands, leave feedback with custom stickers, and track your favorites</p>
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 text-lg font-medium shadow-lg"
              >
                Sign in with Google
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h1>
          <p className="text-gray-600 text-lg">
            Welcome, {user.full_name}! Tell us how you'll be using ExpoConnect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'visitor' ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white/80'
            }`}
            onClick={() => setSelectedRole('visitor')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visitor</h3>
              <p className="text-gray-600 mb-4">
                I'm attending the exhibition to discover new products and services
              </p>
              <Badge variant={selectedRole === 'visitor' ? 'default' : 'secondary'}>
                Discover & Network
              </Badge>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'exhibitor' ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white/80'
            }`}
            onClick={() => setSelectedRole('exhibitor')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exhibitor</h3>
              <p className="text-gray-600 mb-4">
                I'm showcasing my company's products and services at a stand
              </p>
              <Badge variant={selectedRole === 'exhibitor' ? 'default' : 'secondary'}>
                Showcase & Connect
              </Badge>
            </CardContent>
          </Card>
        </div>

        {selectedRole && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <Label htmlFor="position">Position/Title</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="Your job title"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="Your company website"
                />
              </div>
              <Button
                onClick={handleRoleSetup}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3"
                disabled={!formData.company_name}
              >
                Complete Setup
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
