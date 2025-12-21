import AdminLayout from '@/components/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Plug, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Send, 
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  TestTube
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  lastTested?: string;
  configFields: { key: string; label: string; type: 'text' | 'password'; value: string }[];
}

const SettingsAdminPage = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  
  // Email testing state
  const [emailTest, setEmailTest] = useState({
    sender: 'noreply@tophatsecurity.com',
    recipient: '',
    subject: 'Test Email from Admin Panel',
    template: 'welcome',
    customMessage: ''
  });

  // Mock API integrations (in real app, fetch from database)
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([
    {
      id: 'postmark',
      name: 'Postmark',
      description: 'Transactional email service for sending notifications and alerts',
      isConnected: true,
      lastTested: '2024-01-15T10:30:00Z',
      configFields: [
        { key: 'server_token', label: 'Server Token', type: 'password', value: '••••••••' },
        { key: 'from_email', label: 'From Email', type: 'text', value: 'noreply@example.com' }
      ]
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing for subscriptions and credits',
      isConnected: false,
      configFields: [
        { key: 'publishable_key', label: 'Publishable Key', type: 'text', value: '' },
        { key: 'secret_key', label: 'Secret Key', type: 'password', value: '' },
        { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', value: '' }
      ]
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'AI-powered features and content generation',
      isConnected: false,
      configFields: [
        { key: 'api_key', label: 'API Key', type: 'password', value: '' }
      ]
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team notifications and alerts',
      isConnected: false,
      configFields: [
        { key: 'webhook_url', label: 'Webhook URL', type: 'password', value: '' },
        { key: 'channel', label: 'Default Channel', type: 'text', value: '#notifications' }
      ]
    }
  ]);

  const toggleSecretVisibility = (integrationId: string, fieldKey: string) => {
    const key = `${integrationId}-${fieldKey}`;
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const testIntegration = async (integrationId: string) => {
    setTestingIntegration(integrationId);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, lastTested: new Date().toISOString(), isConnected: true }
          : i
      ));
      toast.success(`${integration.name} connection verified successfully`);
    }
    
    setTestingIntegration(null);
  };

  const saveIntegration = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast.success(`${integration.name} settings saved`);
    }
  };

  const sendTestEmail = async () => {
    if (!emailTest.recipient) {
      toast.error('Please enter a recipient email address');
      return;
    }

    setTestingEmail(true);

    try {
      const emailPayload: Record<string, any> = {
        to: emailTest.recipient,
        from: emailTest.sender,
        subject: emailTest.subject,
        data: {
          testMode: true
        }
      };

      // If custom template, send the body directly; otherwise use template
      if (emailTest.template === 'custom') {
        emailPayload.htmlBody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${emailTest.customMessage.replace(/\n/g, '<br>')}
          <p style="color: #666; font-style: italic; margin-top: 20px;">(This is a test email)</p>
        </div>`;
      } else {
        emailPayload.template = emailTest.template;
        emailPayload.data.customMessage = emailTest.customMessage;
      }

      const { data, error } = await supabase.functions.invoke('send-email-postmark', {
        body: emailPayload
      });

      if (error) throw error;
      
      toast.success(`Test email sent to ${emailTest.recipient}`);
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast.error(`Failed to send test email: ${error.message}`);
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-muted-foreground">Manage API integrations and system configuration</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Plug className="h-4 w-4" />
              API Integrations
            </TabsTrigger>
            <TabsTrigger value="email-testing" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Testing
            </TabsTrigger>
          </TabsList>

          {/* API Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant={integration.isConnected ? 'default' : 'secondary'}>
                          {integration.isConnected ? (
                            <><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" /> Not Connected</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testIntegration(integration.id)}
                          disabled={testingIntegration === integration.id}
                        >
                          {testingIntegration === integration.id ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4 mr-2" />
                          )}
                          Test Connection
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveIntegration(integration.id)}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                    {integration.lastTested && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last tested: {new Date(integration.lastTested).toLocaleString()}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {integration.configFields.map((field) => {
                        const secretKey = `${integration.id}-${field.key}`;
                        const isVisible = showSecrets[secretKey];
                        
                        return (
                          <div key={field.key} className="space-y-2">
                            <Label htmlFor={`${integration.id}-${field.key}`}>
                              {field.label}
                            </Label>
                            <div className="relative">
                              <Input
                                id={`${integration.id}-${field.key}`}
                                type={field.type === 'password' && !isVisible ? 'password' : 'text'}
                                value={field.value}
                                onChange={(e) => {
                                  setIntegrations(prev => prev.map(i => 
                                    i.id === integration.id 
                                      ? {
                                          ...i,
                                          configFields: i.configFields.map(f =>
                                            f.key === field.key ? { ...f, value: e.target.value } : f
                                          )
                                        }
                                      : i
                                  ));
                                }}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                              />
                              {field.type === 'password' && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                  onClick={() => toggleSecretVisibility(integration.id, field.key)}
                                >
                                  {isVisible ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Email Testing Tab */}
          <TabsContent value="email-testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Test Email
                </CardTitle>
                <CardDescription>
                  Test your email configuration by sending a test email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sender">Sender Email</Label>
                    <Input
                      id="sender"
                      type="email"
                      placeholder="noreply@example.com"
                      value={emailTest.sender}
                      onChange={(e) => setEmailTest(prev => ({ ...prev, sender: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">Must be a verified sender in Postmark</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Email</Label>
                    <Input
                      id="recipient"
                      type="email"
                      placeholder="test@example.com"
                      value={emailTest.recipient}
                      onChange={(e) => setEmailTest(prev => ({ ...prev, recipient: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={emailTest.subject}
                    onChange={(e) => setEmailTest(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Email Template</Label>
                  <Select
                    value={emailTest.template}
                    onValueChange={(value) => setEmailTest(prev => ({ ...prev, template: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="onboarding_reminder">Onboarding Reminder</SelectItem>
                      <SelectItem value="license_expiry">License Expiry Notice</SelectItem>
                      <SelectItem value="password_reset">Password Reset</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customMessage">
                    {emailTest.template === 'custom' ? 'Email Body' : 'Additional Message (Optional)'}
                  </Label>
                  <Textarea
                    id="customMessage"
                    placeholder={emailTest.template === 'custom' 
                      ? "Enter your full email message..." 
                      : "Add an optional message to the template..."}
                    value={emailTest.customMessage}
                    onChange={(e) => setEmailTest(prev => ({ ...prev, customMessage: e.target.value }))}
                    rows={emailTest.template === 'custom' ? 8 : 4}
                  />
                  {emailTest.template === 'custom' && (
                    <p className="text-xs text-muted-foreground">HTML is supported. Line breaks will be converted to &lt;br&gt; tags.</p>
                  )}
                </div>

                <Button 
                  onClick={sendTestEmail} 
                  disabled={testingEmail || !emailTest.recipient}
                  className="w-full sm:w-auto"
                >
                  {testingEmail ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Test Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Configuration Status</CardTitle>
                <CardDescription>Current email service configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Postmark Integration</p>
                        <p className="text-sm text-muted-foreground">Transactional emails via Postmark</p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">From Address</p>
                      <p className="font-medium">noreply@example.com</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Reply-To Address</p>
                      <p className="font-medium">support@example.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Email Activity</CardTitle>
                <CardDescription>Last 5 emails sent from the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { to: 'user@example.com', subject: 'Welcome to the platform', status: 'delivered', time: '2 hours ago' },
                    { to: 'customer@test.com', subject: 'Onboarding reminder', status: 'delivered', time: '5 hours ago' },
                    { to: 'admin@company.com', subject: 'License expiry notice', status: 'delivered', time: '1 day ago' },
                  ].map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{email.subject}</p>
                        <p className="text-xs text-muted-foreground">To: {email.to}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-600">
                          {email.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{email.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsAdminPage;
