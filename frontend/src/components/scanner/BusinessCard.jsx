import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, MapPin, Download, Building2 } from "lucide-react";

export default function BusinessCard({ stand }) {
  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${stand.company_name}
ORG:${stand.company_name}
EMAIL:${stand.contact_email}
${stand.contact_phone ? `TEL:${stand.contact_phone}` : ''}
${stand.website ? `URL:${stand.website}` : ''}
NOTE:Exhibition Stand ${stand.stand_number} - ${stand.industry?.replace('_', ' ')}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${stand.company_name.replace(/[^a-z0-9]/gi, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
              {stand.logo_url ? (
                <img
                  src={stand.logo_url}
                  alt={stand.company_name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 text-indigo-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {stand.company_name}
              </h2>
              <div className="flex gap-2 mb-4">
                <Badge className="bg-indigo-100 text-indigo-800">
                  Stand {stand.stand_number}
                </Badge>
                <Badge variant="outline">
                  {stand.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <p className="text-gray-600 mb-6">
                {stand.description || "We're excited to connect with you at the exhibition!"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-white/80 rounded-lg">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{stand.contact_email}</p>
              </div>
            </div>

            {stand.contact_phone && (
              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{stand.contact_phone}</p>
                </div>
              </div>
            )}

            {stand.website && (
              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <p className="text-sm text-gray-600">{stand.website}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-white/80 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">Stand {stand.stand_number}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={downloadVCard}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Download className="w-5 h-5 mr-2" />
            Save Contact to Phone
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}