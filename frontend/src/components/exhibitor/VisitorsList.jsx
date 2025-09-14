import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, FileText, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function VisitorsList({ visits, stand }) {
  if (!visits || visits.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Visitors Yet</h3>
          <p className="text-gray-600 mb-6">
            Share your QR code to start connecting with exhibition visitors
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Visitors ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">Visitor #{visit.visitor_id.slice(-6)}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(visit.created_date), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {visit.rating && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      {visit.rating}
                    </Badge>
                  )}
                  {visit.is_favorite && (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  )}
                </div>
              </div>

              {visit.notes && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Visitor Notes</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {visit.notes}
                  </p>
                </div>
              )}

              {visit.stickers && visit.stickers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Feedback Stickers</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {visit.stickers.map((sticker, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                      >
                        {sticker.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}