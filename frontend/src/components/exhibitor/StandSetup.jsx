import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stand } from "@/api/entities";
import { Building2, QrCode, Save } from "lucide-react";

const industries = [
  "technology",
  "healthcare", 
  "automotive",
  "finance",
  "retail",
  "manufacturing",
  "education",
  "food",
  "fashion",
  "other"
];

export default function StandSetup({ user, stand, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    stand_number: stand?.stand_number || "",
    company_name: stand?.company_name || user?.company_name || "",
    description: stand?.description || "",
    industry: stand?.industry || "technology",
    contact_email: stand?.contact_email || user?.email || "",
    contact_phone: stand?.contact_phone || user?.phone || "",
    website: stand?.website || user?.website || "",
    qr_code: stand?.qr_code || ""
  });
  const [saving, setSaving] = useState(false);

  const generateQRCode = () => {
    const code = `STAND_${formData.stand_number}_${Date.now()}`;
    setFormData({ ...formData, qr_code: code });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const standData = {
        ...formData,
        exhibitor_id: user.id,
        qr_code: formData.qr_code || `STAND_${formData.stand_number}_${Date.now()}`
      };

      if (stand) {
        await Stand.update(stand.id, standData);
      } else {
        await Stand.create(standData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving stand:", error);
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-indigo-600" />
            {stand ? 'Edit Exhibition Stand' : 'Create Exhibition Stand'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stand_number">Stand Number *</Label>
                  <Input
                    id="stand_number"
                    value={formData.stand_number}
                    onChange={(e) => setFormData({...formData, stand_number: e.target.value})}
                    placeholder="e.g., A-15, B2-03"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    placeholder="Your company name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell visitors about your company and what you're showcasing..."
                  className="h-24"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({...formData, industry: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://www.company.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  value={formData.qr_code}
                  onChange={(e) => setFormData({...formData, qr_code: e.target.value})}
                  placeholder="QR code will be generated automatically"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateQRCode}
                >
                  Generate
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Visitors will scan this code to connect with your stand
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !formData.stand_number || !formData.company_name}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {stand ? 'Update Stand' : 'Create Stand'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}