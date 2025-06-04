import digitalGoodsService from './digital-goods.js';

// Microsoft Store item IDs
const STORE_ITEMS = {
  PREMIUM_FEATURES: 'super_acceso_vip',
  //REMOVE_ADS: 'remove_ads',
};

// Initialize the digital goods service
async function initializeStore() {
  await digitalGoodsService.initialize();
}

// Get details for store items
async function getStoreItems(items = Object.values(STORE_ITEMS)) {
  if (!items || items.length === 0) {
    console.warn('No items specified');
    return [];
  }
  return (await digitalGoodsService.getDetails(items)) || [];
}

async function validateResponse(response) {
  if (await checkAllValues(response)) {
    console.log('Payment validation successful');
    await response.complete('success');
  } else {
    console.log('Payment validation failed');
    await response.complete('fail');
    throw new Error('Payment validation failed');
  }
}

// Function to validate payment response values
async function checkAllValues(response) {
  // Check if response exists
  if (!response) {
    console.error('No response received');
    return false;
  }

  // Check if response has details
  if (!response.details) {
    console.error('No details in response');
    return false;
  }

  // Validate payment method
  if (
    !response.methodName ||
    response.methodName !== 'https://store.microsoft.com/billing'
  ) {
    console.error('Invalid payment method');
    return false;
  }

  // Validate SKU in details
  if (!response.details.sku) {
    console.error('No SKU in response details');
    return false;
  }

  // Validate that the SKU matches one of our store items
  const validSkus = Object.values(STORE_ITEMS);
  if (!validSkus.includes(response.details.sku)) {
    console.error('Invalid SKU in response');
    return false;
  }

  // All validations passed
  return true;
}

// Function to check existing purchases
async function checkPurchases() {
  return await digitalGoodsService.listPurchases();
}

// Export functions and constants for use in other modules
export { initializeStore, getStoreItems, checkPurchases, validateResponse };
