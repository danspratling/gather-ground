import { useState } from 'react';
import AddressForm from '@/components/AddressCard/AddressForm/AddressForm';
import type { Address } from '@/components/AddressCard/AddressCard.types';
import type { AddressManagerProps } from './AddressManager.types';
import type { Address as CommerceAddress } from '@/lib/commerce/types';

function toCardAddress(
  addr: CommerceAddress,
  defaultShippingId?: string,
  defaultBillingId?: string
): Address {
  return {
    id: addr.id,
    firstName: addr.firstName,
    lastName: addr.lastName,
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    postcode: addr.postalCode,
    country: addr.country,
    isDefaultShipping: addr.id != null && addr.id === defaultShippingId,
    isDefaultBilling: addr.id != null && addr.id === defaultBillingId,
  };
}

function AddressCardInner({
  address,
  onEdit,
  onDelete,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      {(address.isDefaultShipping || address.isDefaultBilling) && (
        <div className="absolute left-4 top-0 flex -translate-y-1/2 flex-wrap gap-2">
          {address.isDefaultShipping && (
            <span className="inline-flex items-center rounded-full border border-brand-50 bg-off-white px-2 py-0.5 text-xs font-medium text-brand-700">
              Default shipping
            </span>
          )}
          {address.isDefaultBilling && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-off-white px-2 py-0.5 text-xs font-medium text-brand-400">
              Default billing
            </span>
          )}
        </div>
      )}
      <address className="flex-1 space-y-0.5 not-italic text-sm text-brand-600">
        <p className="font-semibold text-brand-900">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}, {address.postcode}
        </p>
        <p>{address.country}</p>
      </address>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit address"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete address"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-destructive ring-1 ring-gray-200 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-destructive"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AddressManager({
  addresses: initial,
}: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initial);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function refreshAddresses() {
    try {
      const resp = await fetch('/api/commerce/account/addresses');
      if (!resp.ok) return;
      const data = (await resp.json()) as {
        success: boolean;
        addresses?: CommerceAddress[];
      };
      if (data.success && data.addresses) {
        setAddresses(data.addresses.map((a) => toCardAddress(a)));
      }
    } catch {
      // silently ignore network errors — stale data is acceptable
    }
  }

  function handleEdit(address: Address) {
    setShowAddForm(false);
    setEditingAddress(address);
  }

  async function handleDelete(addressId: string) {
    if (!window.confirm('Are you sure you want to delete this address?'))
      return;
    try {
      const resp = await fetch(`/api/commerce/account/addresses/${addressId}`, {
        method: 'DELETE',
      });
      if (resp.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      }
    } catch {
      // silently ignore
    }
  }

  function handleFormSuccess() {
    setEditingAddress(null);
    setShowAddForm(false);
    void refreshAddresses();
  }

  const editInitialValues = editingAddress
    ? {
        firstName: editingAddress.firstName,
        lastName: editingAddress.lastName,
        line1: editingAddress.line1,
        line2: editingAddress.line2,
        city: editingAddress.city,
        postcode: editingAddress.postcode,
        country: editingAddress.country,
        isDefaultShipping: editingAddress.isDefaultShipping,
        isDefaultBilling: editingAddress.isDefaultBilling,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      {addresses.length === 0 && !showAddForm && !editingAddress ? (
        <p className="text-sm text-brand-600">No saved addresses yet.</p>
      ) : (
        <ul
          className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {addresses.map((address) => (
            <li key={address.id ?? `${address.line1}-${address.postcode}`}>
              <AddressCardInner
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => address.id && void handleDelete(address.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {editingAddress && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-brand-900">Edit address</h3>
          <AddressForm
            addressId={editingAddress.id}
            initialValues={editInitialValues}
            onSuccess={handleFormSuccess}
          />
          <button
            type="button"
            onClick={() => setEditingAddress(null)}
            className="self-start text-sm text-brand-600 underline hover:text-brand-900"
          >
            Cancel
          </button>
        </div>
      )}

      {!editingAddress && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="self-start rounded-md px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            {showAddForm ? 'Cancel' : 'Add new address'}
          </button>

          {showAddForm && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-brand-900">
                Add new address
              </h3>
              <AddressForm onSuccess={handleFormSuccess} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
