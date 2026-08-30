export type CheckoutStep = 'email' | 'shipping' | 'payment';
export type StepStatus = 'pending' | 'active' | 'complete';

export interface CheckoutStepperProps {
  activeStep: CheckoutStep;
  stepStatuses: Record<CheckoutStep, StepStatus>;
}

export default null;
