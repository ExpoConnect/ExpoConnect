import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Copy } from "lucide-react";

export default function QRCodeDisplay({ stand }) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(stand.qr_code)}`;

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${stand.company_name}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQRCode = async () => {
    try {
      await navigator.clipboard.writeText(stand.qr_code);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy QR code:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Your QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-inner inline-block">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          
          <div className="space-y-2">
            <Badge variant="outline" className="bg-gray-50 text-gray-700 px-3 py-1">
              {stand.qr_code}
            </Badge>
            <p className="text-sm text-gray-600">
              Visitors can scan this code to connect with your stand
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
            <Button
              onClick={copyQRCode}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="w-6 h-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-indigo-900">Share Your Stand</h3>
          </div>
          <p className="text-indigo-700 text-sm mb-4 text-center">
            Print this QR code and display it at your stand, or share the code directly with visitors.
          </p>
          <div className="text-center">
            <Badge className="bg-indigo-600 text-white px-3 py-1">
              Stand {stand.stand_number}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}