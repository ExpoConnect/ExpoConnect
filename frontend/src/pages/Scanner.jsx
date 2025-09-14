import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Stand } from "@/api/entities";
import { Visit } from "@/api/entities";
import { User } from "@/api/entities";
import { Scan, Camera, Type, Zap, CheckCircle, AlertCircle } from "lucide-react";
import StandDetails from "../components/scanner/StandDetails";

export default function ScannerPage() {
  const [showCamera, setShowCamera] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [currentStand, setCurrentStand] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    loadUser();
    return () => stopCamera();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const processCode = async (code) => {
    if (!code.trim()) return;
    
    setScanning(true);
    setError("");
    
    try {
      const stands = await Stand.filter({ qr_code: code.trim() });
      
      if (stands.length === 0) {
        setError("Stand not found. Please check the QR code.");
        setScanning(false);
        return;
      }

      const stand = stands[0];
      setCurrentStand(stand);
      stopCamera();
      setManualCode("");
      setScannedCode("");

      // Check if already visited
      const existingVisits = await Visit.filter({ 
        visitor_id: user.id, 
        stand_id: stand.id 
      });

      if (existingVisits.length === 0) {
        await Visit.create({
          visitor_id: user.id,
          stand_id: stand.id
        });
      }

    } catch (error) {
      setError("Error processing QR code. Please try again.");
    }
    
    setScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate scanning a QR code for demo
    const demoCode = "DEMO_STAND_001";
    processCode(demoCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Exhibition Stands
          </h1>
          <p className="text-gray-600 text-lg">
            Scan QR codes to instantly connect with exhibitors and collect their information
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Camera Scanner</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Use your device camera to scan QR codes on exhibition stands
              </p>
              <Button
                onClick={startCamera}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                disabled={scanning}
              >
                <Scan className="w-5 h-5 mr-2" />
                Start Camera Scanner
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Type className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Manual Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                Enter the stand code manually if scanning isn't working
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Enter stand code..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && processCode(manualCode)}
                />
                <Button
                  onClick={() => processCode(manualCode)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  disabled={scanning || !manualCode.trim()}
                >
                  {scanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">Try Demo Mode</h3>
            </div>
            <p className="text-green-700 mb-4">
              Experience the app with a sample exhibition stand
            </p>
            <Button
              onClick={simulateQRScan}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan Demo Stand
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Dialog */}
        <Dialog open={showCamera} onOpenChange={stopCamera}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                QR Code Scanner
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">Position QR code here</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
              <Input
                placeholder="Or enter code manually"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && processCode(scannedCode)}
                className="flex-1"
              />
              <Button
                onClick={() => processCode(scannedCode)}
                disabled={!scannedCode.trim()}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stand Details Dialog */}
        {currentStand && (
          <StandDetails
            stand={currentStand}
            onClose={() => setCurrentStand(null)}
            user={user}
          />
        )}
      </div>
    </div>
  );
}