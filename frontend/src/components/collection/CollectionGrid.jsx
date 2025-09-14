import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Building2, Calendar, FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import StandDetails from "../scanner/StandDetails";
import { User } from "@/api/entities";

export default function CollectionGrid({ visits, stands, onRefresh }) {
  const [selectedStand, setSelectedStand] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  if (visits.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Stands Visited Yet</h3>
          <p className="text-gray-600 mb-6">
            Start exploring the exhibition by scanning QR codes at exhibitor stands
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Start Scanning
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits.map((visit) => {
          const stand = stands.find(s => s.id === visit.stand_id);
          if (!stand) return null;

          return (
            <Card
              key={visit.id}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedStand(stand)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                        {stand.company_name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">Stand {stand.stand_number}</p>
                    </div>
                  </div>
                  {visit.is_favorite && (
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {stand.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  {visit.rating && (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      {visit.rating}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {visit.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">My Notes</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {visit.notes}
                      </p>
                    </div>
                  )}

                  {visit.stickers && visit.stickers.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Feedback</p>
                      <div className="flex gap-1 flex-wrap">
                        {visit.stickers.slice(0, 3).map((sticker, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                          >
                            {sticker.replace('_', ' ')}
                          </Badge>
                        ))}
                        {visit.stickers.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{visit.stickers.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(visit.created_date), "MMM d, yyyy")}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedStand && user && (
        <StandDetails
          stand={selectedStand}
          onClose={() => {
            setSelectedStand(null);
            onRefresh();
          }}
          user={user}
        />
      )}
    </>
  );
}