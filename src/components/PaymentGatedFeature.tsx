import React from 'react';
import { Lock, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAccountPayment } from '@/hooks/useAccountPayment';

interface PaymentGatedFeatureProps {
  children: React.ReactNode;
  featureName?: string;
  className?: string;
  onAddPayment?: () => void;
}

export const PaymentGatedFeature: React.FC<PaymentGatedFeatureProps> = ({
  children,
  featureName = 'This feature',
  className,
  onAddPayment
}) => {
  const { isFreeUser, canAccessPaidFeatures, isLoading } = useAccountPayment();

  if (isLoading) {
    return <div className={cn('animate-pulse', className)}>{children}</div>;
  }

  if (canAccessPaidFeatures) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      <div className="opacity-50 pointer-events-none select-none blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-sm">
          <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium mb-2">
            {featureName} requires payment details
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Add a payment method to unlock paid features
          </p>
          {onAddPayment && (
            <Button size="sm" onClick={onAddPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface PaymentStatusBadgeProps {
  className?: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ className }) => {
  const { data, canAccessPaidFeatures, isFreeUser } = useAccountPayment();

  if (canAccessPaidFeatures) {
    return (
      <Badge variant="outline" className={cn('bg-green-500/10 text-green-600 border-green-500/30', className)}>
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Payment Verified
      </Badge>
    );
  }

  if (isFreeUser) {
    return (
      <Badge variant="outline" className={cn('bg-amber-500/10 text-amber-600 border-amber-500/30', className)}>
        <Lock className="mr-1 h-3 w-3" />
        Free Tier
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn('text-muted-foreground', className)}>
      {data?.accountType || 'Unknown'}
    </Badge>
  );
};

interface GatedButtonProps extends React.ComponentProps<typeof Button> {
  gatedLabel?: string;
}

export const GatedButton: React.FC<GatedButtonProps> = ({
  children,
  gatedLabel = 'Upgrade Required',
  disabled,
  className,
  ...props
}) => {
  const { canAccessPaidFeatures, isFreeUser } = useAccountPayment();

  if (isFreeUser && !canAccessPaidFeatures) {
    return (
      <Button
        {...props}
        disabled
        variant="outline"
        className={cn('opacity-60', className)}
      >
        <Lock className="mr-2 h-4 w-4" />
        {gatedLabel}
      </Button>
    );
  }

  return (
    <Button {...props} disabled={disabled} className={className}>
      {children}
    </Button>
  );
};
