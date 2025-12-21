import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useStripePayment } from '@/hooks/useStripePayment';
import { useAccountPayment } from '@/hooks/useAccountPayment';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AddPaymentMethodFormProps {
  accountId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({
  accountId,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const { refetch } = useAccountPayment();
  const {
    loading,
    createCustomer,
    createSetupIntent,
    confirmPaymentMethod,
    savePaymentMethodToDb,
    updateAccountPaymentStatus
  } = useStripePayment();

  const [step, setStep] = useState<'init' | 'collecting' | 'processing' | 'success' | 'error'>('init');
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });

  // For a real implementation, you would use Stripe Elements here
  // This is a simplified version for demo purposes
  const [simulatedCard, setSimulatedCard] = useState({
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025
  });

  const handleInitialize = async () => {
    if (!user) return;

    setStep('collecting');
    const customer = await createCustomer(user.email || 'Customer');
    if (customer) {
      setStripeCustomerId(customer.id);
    } else {
      setStep('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeCustomerId) return;

    setStep('processing');

    try {
      // In a real implementation, you would use Stripe.js to create a payment method
      // For now, we'll simulate a successful payment method confirmation
      
      // Simulate payment method ID (in production, this comes from Stripe.js)
      const simulatedPaymentMethodId = `pm_${Date.now()}`;

      // Save to database
      await savePaymentMethodToDb(
        {
          id: simulatedPaymentMethodId,
          brand: simulatedCard.brand,
          last4: simulatedCard.last4,
          expMonth: simulatedCard.expMonth,
          expYear: simulatedCard.expYear
        },
        stripeCustomerId,
        accountId
      );

      // Update account payment status
      if (accountId) {
        await updateAccountPaymentStatus(accountId, stripeCustomerId);
      }

      setStep('success');
      toast.success('Payment method added successfully');
      refetch();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      setStep('error');
      toast.error('Failed to add payment method');
    }
  };

  if (step === 'init') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Payment Method
          </CardTitle>
          <CardDescription>
            Add a payment method to unlock paid features and upgrade from free tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your card will not be charged until you make a purchase. Adding a payment 
            method allows you to access paid features.
          </p>
          <div className="flex gap-3">
            <Button onClick={handleInitialize} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Payment Method Added</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You now have access to all paid features
          </p>
          <Button onClick={onSuccess}>Continue</Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We couldn't add your payment method. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setStep('init')}>Try Again</Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Card Details
        </CardTitle>
        <CardDescription>
          Enter your card information securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              disabled={step === 'processing'}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expMonth">Month</Label>
              <Input
                id="expMonth"
                placeholder="MM"
                maxLength={2}
                value={cardDetails.expMonth}
                onChange={(e) => setCardDetails({ ...cardDetails, expMonth: e.target.value })}
                disabled={step === 'processing'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expYear">Year</Label>
              <Input
                id="expYear"
                placeholder="YY"
                maxLength={2}
                value={cardDetails.expYear}
                onChange={(e) => setCardDetails({ ...cardDetails, expYear: e.target.value })}
                disabled={step === 'processing'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                maxLength={4}
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                disabled={step === 'processing'}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={step === 'processing'}>
              {step === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Payment Method
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={step === 'processing'}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPaymentMethodForm;
