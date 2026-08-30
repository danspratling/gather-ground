import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Address, ShippingMethod } from '@/lib/commerce/types';
import type { CheckoutShippingStepProps } from './CheckoutShippingStep.types';

type Mode = 'address' | 'shipping-methods';
type Status = 'idle' | 'submitting' | 'success';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  line1?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

function validateAddress(values: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName?.trim()) errors.firstName = 'First name is required';
  if (!values.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!values.line1?.trim()) errors.line1 = 'Address line 1 is required';
  if (!values.city?.trim()) errors.city = 'City is required';
  if (!values.postalCode?.trim()) errors.postalCode = 'Postcode is required';
  if (!values.country?.trim()) errors.country = 'Country is required';
  return errors;
}

export function CheckoutShippingStep({
  customer,
  savedAddresses = [],
  onComplete,
  _shippingMethods,
}: CheckoutShippingStepProps) {
  const hasSavedAddresses = Boolean(customer && savedAddresses.length > 0);

  const [mode, setMode] = useState<Mode>('address');
  const [useNewAddress, setUseNewAddress] = useState(!hasSavedAddresses);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<
    string | null
  >(savedAddresses[0]?.id ?? null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(
    _shippingMethods ?? []
  );
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    _shippingMethods?.[0]?.id ?? null
  );
  const [confirmedAddress, setConfirmedAddress] = useState<Address | null>(
    null
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');

  // -- Address form state (for guest and new-address modes)
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const buildAddressFromForm = (): Address => ({
    firstName: fields.firstName.trim(),
    lastName: fields.lastName.trim(),
    line1: fields.line1.trim(),
    ...(fields.line2.trim() ? { line2: fields.line2.trim() } : {}),
    city: fields.city.trim(),
    ...(fields.state.trim() ? { state: fields.state.trim() } : {}),
    postalCode: fields.postalCode.trim(),
    country: fields.country.trim(),
    ...(fields.phone.trim() ? { phone: fields.phone.trim() } : {}),
  });

  // -- Step 1: confirm address → POST shipping-address → fetch shipping methods
  const handleAddressSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    let address: Address;

    if (hasSavedAddresses && !useNewAddress) {
      // Use the selected saved address
      const found = savedAddresses.find((a) => a.id === selectedSavedAddressId);
      if (!found) {
        setFormError('Please select an address to continue.');
        return;
      }
      address = found;
    } else {
      // Validate form fields
      const errors = validateAddress(fields as Record<string, string>);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;
      address = buildAddressFromForm();
    }

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/checkout/shipping-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: address,
          billingSameAsShipping: true,
        }),
      });

      if (!resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as {
          error?: string;
        };
        setFormError(data.error ?? 'Failed to save address. Please try again.');
        setStatus('idle');
        return;
      }

      setConfirmedAddress(address);

      // Fetch shipping methods (skip if injected via _shippingMethods)
      if (_shippingMethods) {
        setShippingMethods(_shippingMethods);
        setSelectedMethodId(_shippingMethods[0]?.id ?? null);
      } else {
        const methodsResp = await fetch(
          '/api/commerce/checkout/shipping-methods'
        );
        if (!methodsResp.ok) {
          setFormError('Failed to load shipping methods. Please try again.');
          setStatus('idle');
          return;
        }
        const methodsData = (await methodsResp.json()) as {
          shippingMethods?: ShippingMethod[];
        };
        const methods = methodsData.shippingMethods ?? [];
        setShippingMethods(methods);
        setSelectedMethodId(methods[0]?.id ?? null);
      }

      setMode('shipping-methods');
      setStatus('idle');
    } catch {
      setFormError('Network error. Please try again.');
      setStatus('idle');
    }
  };

  // -- Step 2: confirm shipping method → POST shipping-method → onComplete
  const handleMethodSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!selectedMethodId) {
      setFormError('Please select a shipping method to continue.');
      return;
    }

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/checkout/shipping-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingMethodId: selectedMethodId }),
      });

      if (!resp.ok) {
        const data = (await resp.json().catch(() => ({}))) as {
          error?: string;
        };
        setFormError(
          data.error ?? 'Failed to set shipping method. Please try again.'
        );
        setStatus('idle');
        return;
      }

      onComplete(confirmedAddress!, selectedMethodId);
    } catch {
      setFormError('Network error. Please try again.');
      setStatus('idle');
    }
  };

  const submitting = status === 'submitting' || status === 'success';

  // ---- Shipping methods panel ----
  if (mode === 'shipping-methods') {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-base font-semibold text-brand-900">
          Shipping method
        </h3>

        {shippingMethods.length === 0 ? (
          <p className="text-sm text-brand-500">
            No shipping methods available for this address.
          </p>
        ) : (
          <form onSubmit={handleMethodSubmit} className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">Select a shipping method</legend>
              {shippingMethods.map((method) => {
                const isSelected = method.id === selectedMethodId;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                      isSelected
                        ? 'border-brand-700 bg-brand-25'
                        : 'border-brand-100 bg-off-white hover:border-brand-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedMethodId(method.id)}
                        className="h-4 w-4 border-brand-300 text-brand-700 focus:ring-brand-700"
                      />
                      <span className="text-sm font-medium text-brand-900">
                        {method.name}
                      </span>
                      {method.estimatedDays !== undefined && (
                        <span className="text-xs text-brand-500">
                          ({method.estimatedDays}{' '}
                          {method.estimatedDays === 1 ? 'day' : 'days'})
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-brand-900">
                      {method.cost.formatted}
                    </span>
                  </label>
                );
              })}
            </fieldset>

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !selectedMethodId}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-brand-600 bg-brand-700 px-4.5 py-3 text-base font-semibold whitespace-nowrap text-brand-25 transition-colors hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Continue to payment'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // ---- Address panel ----
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-brand-900">
        Shipping address
      </h3>

      {hasSavedAddresses && (
        <div className="flex flex-col gap-3">
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">Select a saved address</legend>
            {savedAddresses.map((address) => {
              const isSelected =
                !useNewAddress && address.id === selectedSavedAddressId;
              return (
                <label
                  key={address.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    isSelected
                      ? 'border-brand-700 bg-brand-25'
                      : 'border-brand-100 bg-off-white hover:border-brand-300'
                  }`}
                  onClick={() => {
                    setUseNewAddress(false);
                    setSelectedSavedAddressId(address.id ?? null);
                  }}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value={address.id}
                    checked={isSelected}
                    onChange={() => {
                      setUseNewAddress(false);
                      setSelectedSavedAddressId(address.id ?? null);
                    }}
                    className="mt-0.5 h-4 w-4 border-brand-300 text-brand-700 focus:ring-brand-700"
                  />
                  <span className="flex flex-col gap-0.5 text-sm text-brand-900">
                    <span className="font-medium">
                      {address.firstName} {address.lastName}
                    </span>
                    <span>{address.line1}</span>
                    {address.line2 && <span>{address.line2}</span>}
                    <span>
                      {address.city}
                      {address.state ? `, ${address.state}` : ''}{' '}
                      {address.postalCode}
                    </span>
                    <span>{address.country}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>

          <button
            type="button"
            className="self-start text-sm font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
            onClick={() => {
              setUseNewAddress((prev) => !prev);
              setSelectedSavedAddressId(null);
            }}
          >
            {useNewAddress ? 'Use a saved address' : 'Use a new address'}
          </button>
        </div>
      )}

      {(!hasSavedAddresses || useNewAddress) && (
        <form
          onSubmit={handleAddressSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="shipping-firstName" className={labelClasses}>
                First name
                <span className="ml-0.5 text-brand-800" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="shipping-firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Jane"
                value={fields.firstName}
                onChange={handleFieldChange}
                aria-invalid={fieldErrors.firstName ? 'true' : undefined}
                aria-describedby={
                  fieldErrors.firstName ? 'shipping-firstName-error' : undefined
                }
                className={`${inputClasses} ${fieldErrors.firstName ? inputErrorClasses : ''}`}
              />
              {fieldErrors.firstName && (
                <p
                  id="shipping-firstName-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.firstName}
                </p>
              )}
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="shipping-lastName" className={labelClasses}>
                Last name
                <span className="ml-0.5 text-brand-800" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="shipping-lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Smith"
                value={fields.lastName}
                onChange={handleFieldChange}
                aria-invalid={fieldErrors.lastName ? 'true' : undefined}
                aria-describedby={
                  fieldErrors.lastName ? 'shipping-lastName-error' : undefined
                }
                className={`${inputClasses} ${fieldErrors.lastName ? inputErrorClasses : ''}`}
              />
              {fieldErrors.lastName && (
                <p
                  id="shipping-lastName-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Address line 1 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shipping-line1" className={labelClasses}>
              Address
              <span className="ml-0.5 text-brand-800" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="shipping-line1"
              name="line1"
              type="text"
              autoComplete="address-line1"
              required
              placeholder="123 Farm Lane"
              value={fields.line1}
              onChange={handleFieldChange}
              aria-invalid={fieldErrors.line1 ? 'true' : undefined}
              aria-describedby={
                fieldErrors.line1 ? 'shipping-line1-error' : undefined
              }
              className={`${inputClasses} ${fieldErrors.line1 ? inputErrorClasses : ''}`}
            />
            {fieldErrors.line1 && (
              <p id="shipping-line1-error" className="text-sm text-destructive">
                {fieldErrors.line1}
              </p>
            )}
          </div>

          {/* Address line 2 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shipping-line2" className={labelClasses}>
              Apartment, suite, etc.{' '}
              <span className="text-brand-500">(optional)</span>
            </label>
            <input
              id="shipping-line2"
              name="line2"
              type="text"
              autoComplete="address-line2"
              placeholder="Unit 4"
              value={fields.line2}
              onChange={handleFieldChange}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="shipping-city" className={labelClasses}>
                City
                <span className="ml-0.5 text-brand-800" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="shipping-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                placeholder="London"
                value={fields.city}
                onChange={handleFieldChange}
                aria-invalid={fieldErrors.city ? 'true' : undefined}
                aria-describedby={
                  fieldErrors.city ? 'shipping-city-error' : undefined
                }
                className={`${inputClasses} ${fieldErrors.city ? inputErrorClasses : ''}`}
              />
              {fieldErrors.city && (
                <p
                  id="shipping-city-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.city}
                </p>
              )}
            </div>

            {/* Postcode */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="shipping-postalCode" className={labelClasses}>
                Postcode
                <span className="ml-0.5 text-brand-800" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="shipping-postalCode"
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                required
                placeholder="EC1A 1BB"
                value={fields.postalCode}
                onChange={handleFieldChange}
                aria-invalid={fieldErrors.postalCode ? 'true' : undefined}
                aria-describedby={
                  fieldErrors.postalCode
                    ? 'shipping-postalCode-error'
                    : undefined
                }
                className={`${inputClasses} ${fieldErrors.postalCode ? inputErrorClasses : ''}`}
              />
              {fieldErrors.postalCode && (
                <p
                  id="shipping-postalCode-error"
                  className="text-sm text-destructive"
                >
                  {fieldErrors.postalCode}
                </p>
              )}
            </div>
          </div>

          {/* State (optional) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shipping-state" className={labelClasses}>
              State / County <span className="text-brand-500">(optional)</span>
            </label>
            <input
              id="shipping-state"
              name="state"
              type="text"
              autoComplete="address-level1"
              placeholder="e.g. California"
              value={fields.state}
              onChange={handleFieldChange}
              className={inputClasses}
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shipping-country" className={labelClasses}>
              Country
              <span className="ml-0.5 text-brand-800" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="shipping-country"
              name="country"
              type="text"
              autoComplete="country-name"
              required
              placeholder="United Kingdom"
              value={fields.country}
              onChange={handleFieldChange}
              aria-invalid={fieldErrors.country ? 'true' : undefined}
              aria-describedby={
                fieldErrors.country ? 'shipping-country-error' : undefined
              }
              className={`${inputClasses} ${fieldErrors.country ? inputErrorClasses : ''}`}
            />
            {fieldErrors.country && (
              <p
                id="shipping-country-error"
                className="text-sm text-destructive"
              >
                {fieldErrors.country}
              </p>
            )}
          </div>

          {/* Phone (optional) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shipping-phone" className={labelClasses}>
              Phone <span className="text-brand-500">(optional)</span>
            </label>
            <input
              id="shipping-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+44 7700 900000"
              value={fields.phone}
              onChange={handleFieldChange}
              className={inputClasses}
            />
          </div>

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-brand-600 bg-brand-700 px-4.5 py-3 text-base font-semibold whitespace-nowrap text-brand-25 transition-colors hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Continue to shipping'}
          </button>
        </form>
      )}

      {hasSavedAddresses && !useNewAddress && (
        <form onSubmit={handleAddressSubmit}>
          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !selectedSavedAddressId}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-brand-600 bg-brand-700 px-4.5 py-3 text-base font-semibold whitespace-nowrap text-brand-25 transition-colors hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Continue to shipping'}
          </button>
        </form>
      )}
    </div>
  );
}

export default null;
