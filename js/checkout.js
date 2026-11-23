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

  let price;
  if (bundle) {
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

  if (params.has('bundle') || params.has('method')) {
    const optionsUrl = bundle ? `payment-options.html?bundle=${bundleId}` : 'payment-options.html';
    if (!bundle || (method !== 'card' && method !== 'clarity')) {
      window.location.replace(optionsUrl);
      return;
    }

    const payLater = method === 'clarity';
    document.getElementById('checkout-back').href = optionsUrl;
    document.getElementById('checkout-back-label').textContent = 'Payment options';
    document.getElementById('order-total').textContent = price;
    for (const section of review.querySelectorAll('[data-account-preview]')) {
      section.hidden = true;
    }

    if (payLater) {
      document.getElementById('bundle-payment').textContent = 'Pay over time with Clarity Pay';
      document.getElementById('order-total-label').textContent = 'Bundle total';
      document.getElementById('card-renewals').hidden = true;
      document.getElementById('clarity-renewals').hidden = false;
      document.getElementById('payment-method').textContent = 'Clarity Pay';
      document.getElementById('continue-payment-label').textContent = 'Continue to Clarity Pay';
      document.getElementById('card-processor-note').hidden = true;
    } else if (bundleId !== 'gold') {
      document.getElementById('gold-renewal-rates').hidden = true;
      document.getElementById('card-renewal-description').textContent = 'Any subscription renewals are charged to your card when the included access ends.';
    }
  }

  const paymentButton = review.querySelector('.payment-button');
  const paymentPreview = document.getElementById('payment-preview');
  paymentButton.addEventListener('click', () => {
    const showPreview = paymentPreview.hidden;
    paymentPreview.hidden = !showPreview;
    paymentButton.setAttribute('aria-expanded', String(showPreview));
  });
  review.hidden = false;
})();
