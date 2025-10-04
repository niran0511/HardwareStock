import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Building2, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Mail,
  Globe,
  Save,
  Sparkles
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const settingsSections = [
    {
      title: "Profile Settings",
      description: "Manage your account information",
      icon: User,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    },
    {
      title: "Business Settings",
      description: "Configure your business details",
      icon: Building2,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    },
    {
      title: "Notifications",
      description: "Control your notification preferences",
      icon: Bell,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    },
    {
      title: "Appearance",
      description: "Customize how StockPro looks",
      icon: Palette,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    },
  ];

  return (
    <div className="h-screen overflow-auto bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/20 dark:to-pink-950/20">
      <Header 
        title="Settings" 
        subtitle="Manage your account and application preferences"
      />
      
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
        {/* Quick Settings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.title}
                className={`shadow-xl border-0 bg-gradient-to-br ${section.bgGradient} hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{section.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Profile Settings */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 animate-slide-up">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
                <CardDescription className="font-medium">Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input 
                  id="fullName" 
                  defaultValue="John Smith" 
                  className="rounded-xl border-2 h-11"
                  data-testid="input-fullname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="john.smith@example.com" 
                  className="rounded-xl border-2 h-11"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input 
                  id="phone" 
                  defaultValue="+91 98765 43210" 
                  className="rounded-xl border-2 h-11"
                  data-testid="input-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</Label>
                <Input 
                  id="role" 
                  defaultValue="Administrator" 
                  disabled 
                  className="rounded-xl border-2 h-11 bg-gray-100 dark:bg-gray-800"
                  data-testid="input-role"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 animate-slide-up">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Business Settings</CardTitle>
                <CardDescription className="font-medium">Configure your business information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Business Name</Label>
                <Input 
                  id="businessName" 
                  defaultValue="StockPro Industries" 
                  className="rounded-xl border-2 h-11"
                  data-testid="input-businessname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst" className="text-sm font-semibold text-gray-700 dark:text-gray-300">GST Number</Label>
                <Input 
                  id="gst" 
                  defaultValue="29ABCDE1234F1Z5" 
                  className="rounded-xl border-2 h-11"
                  data-testid="input-gst"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Business Address</Label>
                <Input 
                  id="address" 
                  defaultValue="123 Business Park, Mumbai, Maharashtra 400001" 
                  className="rounded-xl border-2 h-11"
                  data-testid="input-address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-amber-950/20 animate-slide-up">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Notification Settings</CardTitle>
                <CardDescription className="font-medium">Manage how you receive notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-sm font-bold text-gray-900 dark:text-gray-100 cursor-pointer">Email Notifications</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Receive updates via email</p>
                  </div>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 border border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <div>
                    <Label htmlFor="low-stock-alerts" className="text-sm font-bold text-gray-900 dark:text-gray-100 cursor-pointer">Low Stock Alerts</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Get notified when stock is low</p>
                  </div>
                </div>
                <Switch 
                  id="low-stock-alerts" 
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                  data-testid="switch-low-stock-alerts"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20 animate-slide-up">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Appearance Settings</CardTitle>
                <CardDescription className="font-medium">Customize the look and feel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <Label htmlFor="dark-mode" className="text-sm font-bold text-gray-900 dark:text-gray-100 cursor-pointer">Dark Mode</Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Switch to dark theme</p>
                  </div>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  data-testid="switch-dark-mode"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-900 dark:to-rose-950/20 animate-slide-up">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl h-11 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
                data-testid="button-change-password"
              >
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl h-11 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
                data-testid="button-two-factor"
              >
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 animate-slide-up">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Data Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl h-11 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30"
                data-testid="button-export-data"
              >
                Export Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl h-11 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30"
                data-testid="button-backup"
              >
                Create Backup
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 pb-6">
          <Button 
            variant="outline" 
            className="rounded-xl px-8 h-12 font-semibold"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            data-testid="button-save-settings"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
