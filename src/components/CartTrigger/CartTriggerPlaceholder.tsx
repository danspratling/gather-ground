// Temporary placeholder until CartTrigger from A1c is merged
export default function CartTriggerPlaceholder() {
  return (
    <button
      aria-label="Open cart"
      className="rounded-lg p-2 hover:bg-brand-25"
      onClick={() =>
        window.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }))
      }
    >
      {/* Cart icon placeholder */}
      <span aria-hidden="true">🛒</span>
    </button>
  );
}
