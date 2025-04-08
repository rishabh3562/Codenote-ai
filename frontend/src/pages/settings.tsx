import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings,
  Key,
  CreditCard,
  Bell,
  Shield,
  Brain,
  Download,
  Smartphone,
  LogOut,
  Loader2,
  User,
  Mail,
  Link,
  Image,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface ApiUsage {
  total: number;
  limit: number;
  remaining: number;
  resetDate: string;
}

interface BillingDetails {
  plan: string;
  price: string;
  billingCycle: string;
  nextBilling: string;
  paymentMethod: string;
}

interface ActiveSession {
  device: string;
  location: string;
  lastActive: string;
  ip: string;
}

export function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    website: '',
    bio: '',
    avatarUrl: user?.avatarUrl || '',
  });

  // Dummy data
  const apiUsage: ApiUsage = {
    total: 850,
    limit: 1000,
    remaining: 150,
    resetDate: '2024-03-15',
  };

  const billingDetails: BillingDetails = {
    plan: 'Pro',
    price: '$49/month',
    billingCycle: 'Monthly',
    nextBilling: '2024-03-15',
    paymentMethod: '**** **** **** 4242',
  };

  const activeSessions: ActiveSession[] = [
    {
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, US',
      lastActive: '2 minutes ago',
      ip: '192.168.1.1',
    },
    {
      device: 'Firefox on Windows',
      location: 'London, UK',
      lastActive: '1 hour ago',
      ip: '192.168.1.2',
    },
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export started',
      description:
        'Your AI insights are being exported. You will be notified when ready.',
    });
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Settings' }]}
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="api">
            <Brain className="h-4 w-4 mr-2" />
            API Usage
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="flex gap-4">
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      handleProfileUpdate('name', e.target.value)
                    }
                    placeholder="Your name"
                    className="flex-1"
                  />
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-4">
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileUpdate('email', e.target.value)
                    }
                    placeholder="your@email.com"
                    className="flex-1"
                  />
                  <Mail className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex gap-4">
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) =>
                      handleProfileUpdate('website', e.target.value)
                    }
                    placeholder="https://your-website.com"
                    className="flex-1"
                  />
                  <Link className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <div className="flex gap-4">
                  <Input
                    id="avatar"
                    value={profileData.avatarUrl}
                    onChange={(e) =>
                      handleProfileUpdate('avatarUrl', e.target.value)
                    }
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1"
                  />
                  <Image className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full min-h-[100px] p-2 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <Switch id="darkMode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Email Notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoAnalyze">
                  Auto-analyze new repositories
                </Label>
                <Switch id="autoAnalyze" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repository Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="privateRepos">
                  Include private repositories
                </Label>
                <Switch id="privateRepos" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSync">Auto-sync repository changes</Label>
                <Switch id="autoSync" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Calls</span>
                  <span>
                    {apiUsage.remaining} / {apiUsage.limit} remaining
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(apiUsage.total / apiUsage.limit) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Resets on {new Date(apiUsage.resetDate).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-4">
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export AI Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Plan</span>
                  <span className="font-medium">{billingDetails.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{billingDetails.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="font-medium">
                    {billingDetails.billingCycle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Next Billing Date
                  </span>
                  <span className="font-medium">
                    {billingDetails.nextBilling}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • {session.ip}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last active: {session.lastActive}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate one-time codes
                  </p>
                </div>
                <Switch id="2fa" />
              </div>

              <div className="pt-4">
                <Button variant="outline">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Setup 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6 gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}
