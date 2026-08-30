import type {
  CheckoutStepperProps,
  CheckoutStep,
} from './CheckoutStepper.types';

const steps: Array<{ key: CheckoutStep; label: string }> = [
  { key: 'email', label: 'Email' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
];

export function CheckoutStepper({
  activeStep,
  stepStatuses,
}: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout steps">
      <ol className="flex items-center gap-4">
        {steps.map((step, i) => {
          const status = stepStatuses[step.key];
          const circleClass = [
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
            status === 'complete' ? 'bg-primary text-primary-foreground' : '',
            status === 'active'
              ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
              : '',
            status === 'pending' ? 'bg-muted text-muted-foreground' : '',
          ]
            .filter(Boolean)
            .join(' ');

          const labelClass = [
            'text-sm font-medium',
            status === 'active' ? 'text-foreground' : 'text-muted-foreground',
          ].join(' ');

          return (
            <li key={step.key} className="flex items-center gap-2">
              <span className={circleClass}>
                {status === 'complete' ? '✓' : i + 1}
              </span>
              <span className={labelClass}>{step.label}</span>
              {i < steps.length - 1 && (
                <span className="mx-2 h-px w-8 bg-border" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default null;
