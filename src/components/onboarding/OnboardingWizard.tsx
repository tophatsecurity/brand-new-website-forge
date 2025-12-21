import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Building2, User, Package, Key, GraduationCap } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const stepIcons: Record<number, React.ReactNode> = {
  1: <User className="h-5 w-5" />,
  2: <Building2 className="h-5 w-5" />,
  3: <Package className="h-5 w-5" />,
  4: <Key className="h-5 w-5" />,
  5: <GraduationCap className="h-5 w-5" />
};

interface StepFormProps {
  step: OnboardingStep;
  onComplete: (data: Record<string, any>) => Promise<void>;
  onBack?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StepForm: React.FC<StepFormProps> = ({ step, onComplete, onBack, isFirst, isLast }) => {
  const [formData, setFormData] = useState<Record<string, any>>(step.data || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onComplete(formData);
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (step.step_number) {
      case 1: // Account Setup
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
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
      case 2: // Company Information
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
      case 3: // Product Selection
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
      case 4: // License Activation
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you have a license key, enter it below. Otherwise, you can request a demo license.
            </p>
            <div className="space-y-2">
              <Label htmlFor="license_key">License Key (Optional)</Label>
              <Input
                id="license_key"
                value={formData.license_key || ''}
                onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
                placeholder="XXXX-XXXX-XXXX-XXXX"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="request_demo"
                checked={formData.request_demo || false}
                onChange={(e) => setFormData({ ...formData, request_demo: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="request_demo">Request a demo license</Label>
            </div>
          </div>
        );
      case 5: // Training & Support
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Let us know your training preferences:
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
                  checked={formData.support_contact || false}
                  onChange={(e) => setFormData({ ...formData, support_contact: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span>Contact support team</span>
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

export const OnboardingWizard: React.FC = () => {
  const { onboarding, steps, loading, createOnboarding, completeStep } = useOnboarding();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [startFormData, setStartFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_phone: ''
  });

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading onboarding...</div>
        </CardContent>
      </Card>
    );
  }

  // Start onboarding flow
  if (!onboarding) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Top Hat Security</CardTitle>
          <CardDescription>
            Let's get you set up with our platform. This will only take a few minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
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
                  description: 'Welcome aboard!'
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={startFormData.company_name}
                onChange={(e) => setStartFormData({ ...startFormData, company_name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone Number (Optional)</Label>
              <Input
                id="contact_phone"
                value={startFormData.contact_phone}
                onChange={(e) => setStartFormData({ ...startFormData, contact_phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <Button type="submit" className="w-full">
              Start Onboarding
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
          <p className="text-muted-foreground mb-4">
            You're all set up and ready to use Top Hat Security products.
          </p>
          <Badge variant="default" className="bg-green-500">Completed</Badge>
        </CardContent>
      </Card>
    );
  }

  const progress = (steps.filter(s => s.is_completed).length / steps.length) * 100;
  const activeStep = steps.find(s => s.step_number === currentStep);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Onboarding Progress</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <Badge variant={onboarding.status === 'in_progress' ? 'default' : 'secondary'}>
              {onboarding.status.replace('_', ' ')}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => !step.is_completed || setCurrentStep(step.step_number)}
            className={cn(
              'flex flex-col items-center gap-2 p-2 rounded-lg transition-colors',
              currentStep === step.step_number && 'bg-primary/10',
              step.is_completed && 'cursor-pointer hover:bg-muted'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2',
                step.is_completed && 'bg-green-500 border-green-500 text-white',
                currentStep === step.step_number && !step.is_completed && 'border-primary text-primary',
                currentStep !== step.step_number && !step.is_completed && 'border-muted-foreground/30 text-muted-foreground/50'
              )}
            >
              {step.is_completed ? <CheckCircle2 className="h-5 w-5" /> : stepIcons[step.step_number]}
            </div>
            <span className={cn(
              'text-xs font-medium hidden sm:block',
              currentStep === step.step_number ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {step.step_name}
            </span>
          </button>
        ))}
      </div>

      {/* Active Step Form */}
      {activeStep && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {stepIcons[activeStep.step_number]}
              {activeStep.step_name}
            </CardTitle>
            {activeStep.step_description && (
              <CardDescription>{activeStep.step_description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <StepForm
              step={activeStep}
              onComplete={async (data) => {
                const result = await completeStep(activeStep.step_number, data);
                if (result.error) {
                  toast({
                    title: 'Error',
                    description: result.error.message,
                    variant: 'destructive'
                  });
                } else {
                  if (currentStep < steps.length) {
                    setCurrentStep(currentStep + 1);
                  }
                  toast({
                    title: 'Step completed!',
                    description: `${activeStep.step_name} has been saved.`
                  });
                }
              }}
              onBack={() => setCurrentStep(Math.max(1, currentStep - 1))}
              isFirst={currentStep === 1}
              isLast={currentStep === steps.length}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnboardingWizard;
