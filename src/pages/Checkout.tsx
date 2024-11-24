import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummary from '../components/checkout/OrderSummary';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import { ArrowLeft } from 'lucide-react';

type CheckoutStep = 'address' | 'payment' | 'review' | 'confirm';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { formatPrice } = useLocale();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleStepComplete = (step: CheckoutStep) => {
    switch (step) {
      case 'address':
        if (selectedAddress) setCurrentStep('payment');
        break;
      case 'payment':
        if (selectedPaymentMethod) setCurrentStep('review');
        break;
      case 'review':
        setCurrentStep('confirm');
        break;
      case 'confirm':
        // Handle order confirmation
        clearCart();
        navigate('/checkout/success');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Cart Button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        {/* Progress Indicator */}
        <CheckoutProgress currentStep={currentStep} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {currentStep === 'address' && (
              <AddressSection
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                onComplete={() => handleStepComplete('address')}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentSection
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={setSelectedPaymentMethod}
                onComplete={() => handleStepComplete('payment')}
              />
            )}

            {currentStep === 'review' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Review Order
                </h2>
                {/* Order details */}
                <button
                  onClick={() => handleStepComplete('review')}
                  className="w-full bg-accent-600 text-white py-3 rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              total={total}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}