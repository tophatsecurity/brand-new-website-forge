import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, ArrowLeft, Building2, User, Package, Key, GraduationCap, Gift } from 'lucide-react';
import { useGuestOnboarding } from '@/hooks/useGuestOnboarding';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const stepIcons: Record<number, React.ReactNode> = {
  1: <User className="h-5 w-5" />,
  2: <Building2 className="h-5 w-5" />,
  3: <Package className="h-5 w-5" />,
  4: <Key className="h-5 w-5" />,
  5: <GraduationCap className="h-5 w-5" />
};

const stepNames = ['Contact Info', 'Company', 'Products', 'License', 'Complete'];

interface StepFormProps {
  stepNumber: number;
  onComplete: (data: Record<string, any>) => Promise<void>;
  onBack?: () => void;
  isFirst: boolean;
  isLast: boolean;
  initialData?: Record<string, any>;
}

const StepForm: React.FC<StepFormProps> = ({ stepNumber, onComplete, onBack, isFirst, isLast, initialData }) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onComplete(formData);
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (stepNumber) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={formData.job_title || ''}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Enter your job title"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_size">Company Size</Label>
              <Input
                id="company_size"
                value={formData.company_size || ''}
                onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                placeholder="e.g., 50-100 employees"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry || ''}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Manufacturing, Energy"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the products you're interested in:
            </p>
            <div className="grid gap-3">
              {['DDX', 'SEEKCAP', 'PARAGUARD', 'SecondLook', 'O-RANGE'].map((product) => (
                <label key={product} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.products?.includes(product) || false}
                    onChange={(e) => {
                      const products = formData.products || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, products: [...products, product] });
                      } else {
                        setFormData({ ...formData, products: products.filter((p: string) => p !== product) });
                      }
                    }}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{product}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-primary" />
                <span className="font-semibold">Free Tier Benefits</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                <li>• Access to free product downloads</li>
                <li>• Free demo licenses</li>
                <li>• Community support access</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="request_demo"
                checked={formData.request_demo || false}
                onChange={(e) => setFormData({ ...formData, request_demo: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="request_demo">Request a demo license for selected products</Label>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Let us know your preferences:
            </p>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.training_webinar || false}
                  onChange={(e) => setFormData({ ...formData, training_webinar: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span>Schedule a training webinar</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.documentation_access || false}
                  onChange={(e) => setFormData({ ...formData, documentation_access: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span>Access documentation</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsletter || false}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span>Subscribe to newsletter</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStepContent()}
      <div className="flex justify-between pt-4">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <Button type="submit" disabled={loading} className={isFirst ? 'ml-auto' : ''}>
          {loading ? 'Saving...' : isLast ? 'Complete' : 'Continue'}
          {!isLast && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
};

export const GuestOnboardingWizard: React.FC = () => {
  const { onboarding, loading, createOnboarding, completeStep } = useGuestOnboarding();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [startFormData, setStartFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: ''
  });

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // Start onboarding flow
  if (!onboarding) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Gift className="h-3 w-3 mr-1" />
              Free Tier
            </Badge>
          </div>
          <CardTitle className="text-2xl">Welcome to Top Hat Security</CardTitle>
          <CardDescription>
            Get started with our free tier - no account required! Complete onboarding to access free downloads and demo licenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!startFormData.contact_email) {
                toast({
                  title: 'Email required',
                  description: 'Please enter your email address to continue.',
                  variant: 'destructive'
                });
                return;
              }
              const result = await createOnboarding(startFormData);
              if (result.error) {
                toast({
                  title: 'Error',
                  description: result.error.message,
                  variant: 'destructive'
                });
              } else {
                toast({
                  title: 'Onboarding started!',
                  description: 'Welcome to Top Hat Security!'
                });
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="contact_name">Your Name</Label>
              <Input
                id="contact_name"
                value={startFormData.contact_name}
                onChange={(e) => setStartFormData({ ...startFormData, contact_name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email Address *</Label>
              <Input
                id="contact_email"
                type="email"
                value={startFormData.contact_email}
                onChange={(e) => setStartFormData({ ...startFormData, contact_email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={startFormData.company_name}
                onChange={(e) => setStartFormData({ ...startFormData, company_name: e.target.value })}
                placeholder="Enter company name (optional)"
              />
            </div>
            <Button type="submit" className="w-full">
              Start Free Onboarding
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Completed state
  if (onboarding.status === 'completed') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Onboarding Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You're all set! You can now access free products and downloads.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/downloads">View Downloads</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Create Full Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalSteps = 5;
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Free Onboarding</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Gift className="h-3 w-3 mr-1" />
              Free Tier
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = onboarding.data?.[`step_${step}_completed`];
          return (
            <button
              key={step}
              onClick={() => isCompleted && setCurrentStep(step)}
              className={cn(
                'flex flex-col items-center gap-2 p-2 rounded-lg transition-colors',
                currentStep === step && 'bg-primary/10',
                isCompleted && 'cursor-pointer hover:bg-muted'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2',
                  isCompleted && 'bg-green-500 border-green-500 text-white',
                  currentStep === step && !isCompleted && 'border-primary text-primary',
                  currentStep !== step && !isCompleted && 'border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepIcons[step]}
              </div>
              <span className={cn(
                'text-xs font-medium hidden sm:block',
                currentStep === step ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {stepNames[step - 1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {stepIcons[currentStep]}
            {stepNames[currentStep - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StepForm
            stepNumber={currentStep}
            onComplete={async (data) => {
              const result = await completeStep(currentStep, data);
              if (result.error) {
                toast({
                  title: 'Error',
                  description: result.error.message,
                  variant: 'destructive'
                });
              } else {
                if (currentStep < totalSteps) {
                  setCurrentStep(currentStep + 1);
                }
                toast({
                  title: 'Step completed!',
                  description: `${stepNames[currentStep - 1]} has been saved.`
                });
              }
            }}
            onBack={() => setCurrentStep(Math.max(1, currentStep - 1))}
            isFirst={currentStep === 1}
            isLast={currentStep === totalSteps}
            initialData={onboarding.data?.[`step_${currentStep}`]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestOnboardingWizard;
