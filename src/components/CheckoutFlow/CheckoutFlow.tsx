import { useReducer, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartStore, initCart } from '@/lib/commerce/cart/store';
import { CheckoutStepper } from '../CheckoutStepper/CheckoutStepper';
import { CheckoutEmailStep } from '../CheckoutEmailStep/CheckoutEmailStep';
import { CheckoutShippingStep } from '../CheckoutShippingStep/CheckoutShippingStep';
import { CheckoutPaymentStep } from '../CheckoutPaymentStep/CheckoutPaymentStep';
import { CheckoutSummary } from '../CheckoutSummary/CheckoutSummary';
import type {
  CheckoutFlowProps,
  CheckoutState,
  CheckoutAction,
} from './CheckoutFlow.types';
import { INITIAL_STATE } from './CheckoutFlow.types';

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState {
  switch (action.type) {
    case 'SNAPSHOT_CART':
      return { ...state, cartSnapshot: action.cart };

    case 'CART_MUTATED':
      return { ...state, cartMutated: true };

    case 'SET_EMAIL':
      return {
        ...state,
        step: 'shipping',
        email: action.email,
        stepStatuses: {
          email: 'complete',
          shipping: 'active',
          payment: 'pending',
        },
      };

    case 'SET_SHIPPING':
      return {
        ...state,
        step: 'payment',
        shippingAddress: action.address,
        shippingMethodId: action.shippingMethodId,
        stepStatuses: {
          email: 'complete',
          shipping: 'complete',
          payment: 'active',
        },
      };

    case 'SET_PAYMENT':
      return {
        ...state,
        stepStatuses: {
          email: 'complete',
          shipping: 'complete',
          payment: 'complete',
        },
      };

    case 'RESET_TO_STEP':
      return {
        ...state,
        step: action.step,
        stepStatuses: {
          email: action.step === 'email' ? 'active' : 'complete',
          shipping:
            action.step === 'shipping'
              ? 'active'
              : action.step === 'payment'
                ? 'complete'
                : 'pending',
          payment: action.step === 'payment' ? 'active' : 'pending',
        },
      };

    default:
      return state;
  }
}

export function CheckoutFlow({ customer }: CheckoutFlowProps) {
  const cart = useStore(cartStore);
  const [state, dispatch] = useReducer(checkoutReducer, INITIAL_STATE);

  // 1. Ensure cart is initialised (idempotent)
  useEffect(() => {
    initCart();
  }, []);

  // 2. Empty cart redirect (client-side guard)
  useEffect(() => {
    if (cart.id && !cart.isLoading && cart.items.length === 0) {
      window.location.href = '/cart';
    }
  }, [cart.id, cart.isLoading, cart.items]);

  // 3. Snapshot cart once on first non-empty load
  useEffect(() => {
    if (cart.id && cart.items && cart.items.length > 0 && !state.cartSnapshot) {
      dispatch({ type: 'SNAPSHOT_CART', cart });
    }
  }, [cart.id, cart.items, state.cartSnapshot]);

  // 4. Detect cart mutation after snapshot
  useEffect(() => {
    if (!state.cartSnapshot || state.cartMutated) return;
    const snapshotIds = new Set(state.cartSnapshot.items.map((i) => i.id));
    const currentIds = new Set(cart.items.map((i) => i.id));
    const snapshotQtys = Object.fromEntries(
      state.cartSnapshot.items.map((i) => [i.id, i.quantity])
    );
    const mutated =
      [...currentIds].some((id) => !snapshotIds.has(id)) ||
      [...snapshotIds].some((id) => !currentIds.has(id)) ||
      cart.items.some((i) => snapshotQtys[i.id] !== i.quantity);
    if (mutated) dispatch({ type: 'CART_MUTATED' });
  }, [cart.items, state.cartSnapshot, state.cartMutated]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <CheckoutStepper
        activeStep={state.step}
        stepStatuses={state.stepStatuses}
      />

      {state.cartMutated && (
        <div
          role="alert"
          className="my-4 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive"
        >
          Your cart has changed while you were checking out.{' '}
          <a href="/cart" className="font-medium underline">
            Return to cart to review
          </a>
          .
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {state.step === 'email' && (
            <CheckoutEmailStep
              customer={customer}
              onComplete={(email) => dispatch({ type: 'SET_EMAIL', email })}
            />
          )}
          {state.step === 'shipping' && (
            <CheckoutShippingStep
              customer={customer}
              onComplete={(address, shippingMethodId) =>
                dispatch({ type: 'SET_SHIPPING', address, shippingMethodId })
              }
            />
          )}
          {state.step === 'payment' && state.shippingAddress && (
            <CheckoutPaymentStep
              shippingAddress={state.shippingAddress}
              onComplete={async (paymentIntentId) => {
                const res = await fetch('/api/commerce/checkout/place-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ paymentMethodId: paymentIntentId }),
                });
                if (!res.ok) return;
                dispatch({ type: 'SET_PAYMENT', paymentIntentId });
                window.location.href = '/checkout/confirmation/pending';
              }}
            />
          )}
        </div>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  );
}

export default null;
