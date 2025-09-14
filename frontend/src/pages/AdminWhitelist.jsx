import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WhitelistedEmail } from "@/api/entities";
import { User } from "@/api/entities";
import { Plus, Mail, Trash2, Eye, EyeOff, Users } from "lucide-react";

export default function AdminWhitelistPage() {
  const [emails, setEmails] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmail, setNewEmail] = useState({
    email: "",
    notes: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const emailList = await WhitelistedEmail.list("-created_date");
      setEmails(emailList);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleAddEmail = async () => {
    if (!newEmail.email) return;
    
    setSaving(true);
    try {
      await WhitelistedEmail.create({
        email: newEmail.email.toLowerCase().trim(),
        notes: newEmail.notes,
        added_by: user.email
      });
      
      setNewEmail({ email: "", notes: "" });
      setShowAddDialog(false);
      loadData();
    } catch (error) {
      console.error("Error adding email:", error);
    }
    setSaving(false);
  };

  const handleToggleActive = async (emailRecord) => {
    try {
      await WhitelistedEmail.update(emailRecord.id, {
        is_active: !emailRecord.is_active
      });
      loadData();
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handleDelete = async (emailRecord) => {
    if (!confirm("Are you sure you want to remove this email from the whitelist?")) {
      return;
    }
    
    try {
      await WhitelistedEmail.delete(emailRecord.id);
      loadData();
    } catch (error) {
      console.error("Error deleting email:", error);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Email Whitelist Management
            </h1>
            <p className="text-gray-600 text-lg">
              Control who can access your exhibition application
            </p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Email
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
              <p className="text-gray-500">Total Emails</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {emails.filter(e => e.is_active).length}
              </p>
              <p className="text-gray-500">Active</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeOff className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {emails.filter(e => !e.is_active).length}
              </p>
              <p className="text-gray-500">Inactive</p>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Whitelisted Emails</CardTitle>
          </CardHeader>
          <CardContent>
            {emails.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emails Added</h3>
                <p className="text-gray-600 mb-4">Start by adding email addresses to the whitelist</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Email
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {emails.map((emailRecord) => (
                  <div
                    key={emailRecord.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {emailRecord.email}
                        </span>
                        <Badge
                          variant={emailRecord.is_active ? "default" : "secondary"}
                          className={emailRecord.is_active ? "bg-green-100 text-green-800" : ""}
                        >
                          {emailRecord.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {emailRecord.notes && (
                        <p className="text-sm text-gray-600 ml-7">{emailRecord.notes}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-7">
                        Added by {emailRecord.added_by}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(emailRecord)}
                        className={emailRecord.is_active ? "text-orange-600" : "text-green-600"}
                      >
                        {emailRecord.is_active ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(emailRecord)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Email Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Email to Whitelist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail.email}
                  onChange={(e) => setNewEmail({...newEmail, email: e.target.value})}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newEmail.notes}
                  onChange={(e) => setNewEmail({...newEmail, notes: e.target.value})}
                  placeholder="Add any notes about this user..."
                  className="h-20"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEmail}
                  disabled={saving || !newEmail.email}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? "Adding..." : "Add Email"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}