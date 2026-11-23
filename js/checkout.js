(() => {
  const bundles = new Map([
    ['basic', { name: 'Basic Bundle', price: 1999 }],
    ['silver', { name: 'Silver Bundle', price: 2499 }],
    ['gold', { name: 'Gold Bundle', price: 2999 }],
  ]);
  const params = new URLSearchParams(window.location.search);
  const bundleId = params.get('bundle');
  const bundle = bundles.get(bundleId);
  const method = params.get('method');
  const options = document.getElementById('payment-options');
  const review = document.getElementById('checkout-review');
  const paymentScreen = document.getElementById('payment-screen');
  const hasSelection = params.has('bundle') || params.has('method');

  let price;
  if (bundle && !review) {
    price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bundle.price);
    document.querySelector('[data-bundle-name]').textContent = bundle.name;
    document.querySelector('[data-bundle-price]').textContent = price;
  }

  if (options) {
    if (!bundle) {
      document.getElementById('bundle-unavailable').hidden = false;
      return;
    }

    document.querySelector('[data-gold-only]').hidden = bundleId !== 'gold';
    for (const link of options.querySelectorAll('[data-payment-method]')) {
      const order = new URLSearchParams({ bundle: bundleId, method: link.dataset.paymentMethod });
      link.href = `checkout.html?${order}`;
    }
    options.hidden = false;
    return;
  }

  const optionsUrl = bundle ? `payment-options.html?bundle=${bundleId}` : 'payment-options.html';
  if (hasSelection && (!bundle || (method !== 'card' && method !== 'clarity'))) {
    window.location.replace(optionsUrl);
    return;
  }

  const orderQuery = hasSelection ? `?${new URLSearchParams({ bundle: bundleId, method })}` : '';
  if (paymentScreen) {
    document.getElementById('payment-back').href = `checkout.html${orderQuery}`;
    if (bundle) {
      document.getElementById('payment-total').textContent = price;
      paymentScreen.querySelector('[data-account-preview]').hidden = true;
    }

    const provider = document.getElementById('payment-provider');
    const methods = document.getElementById('payment-methods');
    const panels = provider.querySelectorAll('[data-provider-method]');
    const payButton = document.getElementById('provider-pay-button');
    const buttonLabels = { card: 'Pay', crypto: 'Continue with crypto', clarity: 'Continue with Clarity Pay' };
    const initialMethod = method || 'card';
    methods.querySelector(`[value="${initialMethod}"]`).checked = true;

    function showMethod(selectedMethod) {
      for (const panel of panels) {
        panel.hidden = panel.dataset.providerMethod !== selectedMethod;
      }
      payButton.textContent = buttonLabels[selectedMethod];
    }

    methods.addEventListener('change', event => showMethod(event.target.value));
    showMethod(initialMethod);
    paymentScreen.hidden = false;
    return;
  }

  if (hasSelection) {
    const payLater = method === 'clarity';
    document.getElementById('checkout-back').href = optionsUrl;
    document.getElementById('checkout-back-label').textContent = 'Payment options';

    if (payLater) {
      document.getElementById('bundle-payment').textContent = 'Pay over time with Clarity Pay';
      document.getElementById('order-total-label').textContent = 'Bundle total';
      document.getElementById('card-renewals').hidden = true;
      document.getElementById('clarity-renewals').hidden = false;
      document.getElementById('payment-method').textContent = 'Clarity Pay';
      document.getElementById('continue-payment-label').textContent = 'Continue with Clarity Pay';
      document.getElementById('card-processor-note').hidden = true;
    }
  }

  document.getElementById('review-continue').href = `payment.html${orderQuery}`;
  review.hidden = false;
})();
