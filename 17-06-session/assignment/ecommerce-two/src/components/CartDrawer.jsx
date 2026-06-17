import { useMemo } from "react";

export default function CartDrawer({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem
}) {
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const shippingLimit = 1500;
  const shippingFee = totalAmount >= shippingLimit || totalAmount === 0 ? 0 : 50;
  const remainingAmount = Math.max(0, shippingLimit - totalAmount);
  const progressPercentage = Math.min((totalAmount / shippingLimit) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="cart-overlay"></div>

      <div className="cart-drawer">
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 pb-0">
            <div className="cart-header">
              <h3 className="text-lg font-black text-gray-900">
                Sepetim ({cart.reduce((sum, item) => sum + item.quantity, 0)} Ürün)
              </h3>
              <button onClick={onClose} className="cart-close-btn">✕</button>
            </div>

            {cart.length > 0 && (
              <div className="cart-shipping-box">
                {totalAmount >= shippingLimit ? (
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">🎉 Kargonuz Bedava!</span>
                ) : (
                  <span className="cart-shipping-text">
                    🚚 Kargo bedava için <strong className="text-red-500">{remainingAmount.toFixed(2)} TL</strong> daha ekleyin!
                  </span>
                )}
                <div className="cart-progress-bg">
                  <div
                    className="cart-progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="cart-list">
            {cart.length === 0 ? (
              <div className="cart-empty-msg">
                <span>Sepetiniz şu anda boş.</span>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <span className="cart-item-title">{item.title}</span>
                    <span className="cart-item-price">{item.price.toFixed(2)} TL</span>
                    
                    <div className="cart-qty-wrapper">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="cart-counter-btn"
                      >
                        -
                      </button>
                      <span className="cart-counter-value">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="cart-counter-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <span className="cart-item-total">
                      {(item.price * item.quantity).toFixed(2)} TL
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="cart-item-delete"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="cart-summary-panel">
            <div className="cart-summary-row">
              <span>Ara Toplam</span>
              <span className="font-bold text-gray-900">{totalAmount.toFixed(2)} TL</span>
            </div>
            <div className="cart-summary-row">
              <span>Kargo Ücreti</span>
              <span className={`font-bold ${shippingFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                {shippingFee === 0 ? "Bedava" : `${shippingFee.toFixed(2)} TL`}
              </span>
            </div>
            <div className="cart-total-row">
              <span className="text-base font-bold text-gray-900">Genel Toplam</span>
              <span className="text-xl font-black text-red-600">
                {(totalAmount + shippingFee).toFixed(2)} TL
              </span>
            </div>
            <button
              onClick={() => alert("Siparişiniz başarıyla alındı! (Simülasyon)")}
              className="cart-checkout-btn"
            >
              Alışverişi Tamamla
            </button>
          </div>
        )}
      </div>
    </>
  );
}