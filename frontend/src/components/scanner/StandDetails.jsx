
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Visit } from "@/api/entities";
import { CatalogItem } from "@/api/entities";
import { Star, Heart, Mail, Phone, Globe, MapPin, Download, Sparkles } from "lucide-react";
import BusinessCard from "./BusinessCard";
import CatalogView from "./CatalogView";
import FeedbackStickers from "./FeedbackStickers";

export default function StandDetails({ stand, onClose, user }) {
  const [visit, setVisit] = useState(null);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);

  const loadVisitData = useCallback(async () => {
    try {
      const visits = await Visit.filter({ 
        visitor_id: user.id, 
        stand_id: stand.id 
      });
      if (visits.length > 0) {
        const visitData = visits[0];
        setVisit(visitData);
        setNotes(visitData.notes || "");
        setRating(visitData.rating || 0);
        setIsFavorite(visitData.is_favorite || false);
        setSelectedStickers(visitData.stickers || []);
      }
    } catch (error) {
      console.error("Error loading visit data:", error);
    }
  }, [stand.id, user.id]);

  const loadCatalogItems = useCallback(async () => {
    try {
      const items = await CatalogItem.filter({ stand_id: stand.id });
      setCatalogItems(items);
    } catch (error) {
      console.error("Error loading catalog:", error);
    }
  }, [stand.id]);
  
  useEffect(() => {
    loadVisitData();
    loadCatalogItems();
  }, [loadVisitData, loadCatalogItems]);

  const handleSave = async () => {
    if (!visit) return;
    
    setSaving(true);
    try {
      await Visit.update(visit.id, {
        notes,
        rating,
        is_favorite: isFavorite,
        stickers: selectedStickers
      });
    } catch (error) {
      console.error("Error saving visit:", error);
    }
    setSaving(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: MapPin },
    { id: "business-card", label: "Business Card", icon: Download },
    { id: "catalog", label: "Catalog", icon: Sparkles },
    { id: "feedback", label: "My Feedback", icon: Star }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {stand.company_name}
              </DialogTitle>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  Stand {stand.stand_number}
                </Badge>
                <Badge variant="outline">
                  {stand.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 cursor-pointer transition-colors ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className={isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {stand.banner_url && (
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden">
                  <img
                    src={stand.banner_url}
                    alt={stand.company_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About This Stand</h3>
                  <p className="text-gray-600 mb-6">
                    {stand.description || "Welcome to our exhibition stand! We're excited to showcase our latest products and services."}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-gray-600">{stand.contact_email}</p>
                      </div>
                    </div>
                    {stand.contact_phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-xs text-gray-600">{stand.contact_phone}</p>
                        </div>
                      </div>
                    )}
                    {stand.website && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <p className="text-xs text-gray-600">{stand.website}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "business-card" && (
            <BusinessCard stand={stand} />
          )}

          {activeTab === "catalog" && (
            <CatalogView items={catalogItems} stand={stand} />
          )}

          {activeTab === "feedback" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Your Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes & Impressions</label>
                    <Textarea
                      placeholder="Add your thoughts about this stand..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="h-32"
                    />
                  </div>

                  <FeedbackStickers
                    selectedStickers={selectedStickers}
                    onStickersChange={setSelectedStickers}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
