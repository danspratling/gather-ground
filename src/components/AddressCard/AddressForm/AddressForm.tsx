import { useState, type FormEvent } from 'react';
import type { AddressFormProps, AddressFormValues } from './AddressForm.types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  line1?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

const REQUIRED_FIELDS: (keyof AddressFormValues)[] = [
  'firstName',
  'lastName',
  'line1',
  'city',
  'postcode',
  'country',
];

function validate(values: Partial<AddressFormValues>): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!values[field]) {
      errors[field as keyof FieldErrors] = `${fieldLabel(field)} is required`;
    }
  }
  return errors;
}

function fieldLabel(field: keyof AddressFormValues): string {
  const labels: Record<keyof AddressFormValues, string> = {
    firstName: 'First name',
    lastName: 'Last name',
    line1: 'Address line 1',
    line2: 'Address line 2',
    city: 'City',
    postcode: 'Postcode',
    country: 'Country',
    phone: 'Phone',
    isDefaultShipping: 'Default shipping',
    isDefaultBilling: 'Default billing',
  };
  return labels[field];
}

export default function AddressForm({
  addressId,
  initialValues,
  onSuccess,
}: AddressFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const formData = new FormData(e.currentTarget);

    const values: Partial<AddressFormValues> = {
      firstName: ((formData.get('firstName') as string | null) ?? '').trim(),
      lastName: ((formData.get('lastName') as string | null) ?? '').trim(),
      line1: ((formData.get('line1') as string | null) ?? '').trim(),
      line2:
        ((formData.get('line2') as string | null) ?? '').trim() || undefined,
      city: ((formData.get('city') as string | null) ?? '').trim(),
      postcode: ((formData.get('postcode') as string | null) ?? '').trim(),
      country: ((formData.get('country') as string | null) ?? '').trim(),
      phone:
        ((formData.get('phone') as string | null) ?? '').trim() || undefined,
      isDefaultShipping: formData.get('isDefaultShipping') === 'on',
      isDefaultBilling: formData.get('isDefaultBilling') === 'on',
    };

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');

    const url = addressId
      ? `/api/commerce/account/addresses/${addressId}`
      : '/api/commerce/account/addresses';

    try {
      const resp = await fetch(url, {
        method: addressId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          line1: values.line1,
          line2: values.line2,
          city: values.city,
          postalCode: values.postcode,
          country: values.country,
          phone: values.phone,
          isDefaultShipping: values.isDefaultShipping,
          isDefaultBilling: values.isDefaultBilling,
        }),
      });

      if (resp.ok) {
        setStatus('success');
        onSuccess?.();
        return;
      }

      const data = (await resp.json().catch(() => ({}))) as { error?: string };
      setFormError(data.error ?? 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setFormError('Network error. Please try again.');
      setStatus('error');
    }
  };

  const submitting = status === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label={addressId ? 'Edit address' : 'Add new address'}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address-firstName" className={labelClasses}>
            First name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="address-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            defaultValue={initialValues?.firstName ?? ''}
            placeholder="Jane"
            aria-invalid={fieldErrors.firstName ? 'true' : undefined}
            aria-describedby={
              fieldErrors.firstName ? 'address-firstName-error' : undefined
            }
            className={`${inputClasses} ${fieldErrors.firstName ? inputErrorClasses : ''}`}
          />
          {fieldErrors.firstName && (
            <p
              id="address-firstName-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {fieldErrors.firstName}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address-lastName" className={labelClasses}>
            Last name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="address-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            defaultValue={initialValues?.lastName ?? ''}
            placeholder="Smith"
            aria-invalid={fieldErrors.lastName ? 'true' : undefined}
            aria-describedby={
              fieldErrors.lastName ? 'address-lastName-error' : undefined
            }
            className={`${inputClasses} ${fieldErrors.lastName ? inputErrorClasses : ''}`}
          />
          {fieldErrors.lastName && (
            <p
              id="address-lastName-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {fieldErrors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address-line1" className={labelClasses}>
          Address line 1
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="address-line1"
          name="line1"
          type="text"
          autoComplete="address-line1"
          required
          defaultValue={initialValues?.line1 ?? ''}
          placeholder="123 Farm Lane"
          aria-invalid={fieldErrors.line1 ? 'true' : undefined}
          aria-describedby={
            fieldErrors.line1 ? 'address-line1-error' : undefined
          }
          className={`${inputClasses} ${fieldErrors.line1 ? inputErrorClasses : ''}`}
        />
        {fieldErrors.line1 && (
          <p
            id="address-line1-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldErrors.line1}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address-line2" className={labelClasses}>
          Address line 2
          <span className="ml-0.5 text-brand-400 text-xs" aria-hidden="true">
            (optional)
          </span>
        </label>
        <input
          id="address-line2"
          name="line2"
          type="text"
          autoComplete="address-line2"
          defaultValue={initialValues?.line2 ?? ''}
          placeholder="Apartment, suite, unit, etc."
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address-city" className={labelClasses}>
            City
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="address-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            defaultValue={initialValues?.city ?? ''}
            placeholder="London"
            aria-invalid={fieldErrors.city ? 'true' : undefined}
            aria-describedby={
              fieldErrors.city ? 'address-city-error' : undefined
            }
            className={`${inputClasses} ${fieldErrors.city ? inputErrorClasses : ''}`}
          />
          {fieldErrors.city && (
            <p
              id="address-city-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {fieldErrors.city}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address-postcode" className={labelClasses}>
            Postcode
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="address-postcode"
            name="postcode"
            type="text"
            autoComplete="postal-code"
            required
            defaultValue={initialValues?.postcode ?? ''}
            placeholder="EC1A 1BB"
            aria-invalid={fieldErrors.postcode ? 'true' : undefined}
            aria-describedby={
              fieldErrors.postcode ? 'address-postcode-error' : undefined
            }
            className={`${inputClasses} ${fieldErrors.postcode ? inputErrorClasses : ''}`}
          />
          {fieldErrors.postcode && (
            <p
              id="address-postcode-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {fieldErrors.postcode}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address-country" className={labelClasses}>
          Country
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="address-country"
          name="country"
          type="text"
          autoComplete="country-name"
          required
          defaultValue={initialValues?.country ?? ''}
          placeholder="United Kingdom"
          aria-invalid={fieldErrors.country ? 'true' : undefined}
          aria-describedby={
            fieldErrors.country ? 'address-country-error' : undefined
          }
          className={`${inputClasses} ${fieldErrors.country ? inputErrorClasses : ''}`}
        />
        {fieldErrors.country && (
          <p
            id="address-country-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldErrors.country}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address-phone" className={labelClasses}>
          Phone
          <span className="ml-0.5 text-brand-400 text-xs" aria-hidden="true">
            (optional)
          </span>
        </label>
        <input
          id="address-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={initialValues?.phone ?? ''}
          placeholder="+44 7700 900000"
          className={inputClasses}
        />
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Address defaults</legend>
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              id="address-isDefaultShipping"
              name="isDefaultShipping"
              type="checkbox"
              defaultChecked={initialValues?.isDefaultShipping ?? false}
              className="h-4 w-4 rounded border-brand-100 accent-brand-700"
            />
            <span className={labelClasses}>
              Set as default shipping address
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              id="address-isDefaultBilling"
              name="isDefaultBilling"
              type="checkbox"
              defaultChecked={initialValues?.isDefaultBilling ?? false}
              className="h-4 w-4 rounded border-brand-100 accent-brand-700"
            />
            <span className={labelClasses}>Set as default billing address</span>
          </label>
        </div>
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      {status === 'success' && (
        <p role="status" className="text-sm text-brand-700">
          Address saved successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Saving…' : addressId ? 'Update address' : 'Save address'}
      </button>
    </form>
  );
}
