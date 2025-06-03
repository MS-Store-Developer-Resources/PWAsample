import digitalGoodsService from './digital-goods.js';

// Microsoft Store item IDs
const STORE_ITEMS = {
  PREMIUM_FEATURES: 'super_acceso_vip',
  REMOVE_ADS: 'remove_ads',
};

// Initialize the digital goods service
async function initializeStore() {
  try {
    await digitalGoodsService.initialize();
    console.log('Store initialized successfully');
  } catch (error) {
    console.error('Failed to initialize store:', error);
    throw error;
  }
}

// Get details for all available items
async function getStoreItems() {
  try {
    const itemDetails = await digitalGoodsService.getDetails([
      STORE_ITEMS.PREMIUM_FEATURES,
      STORE_ITEMS.REMOVE_ADS,
    ]);
    return itemDetails;
  } catch (error) {
    console.error('Failed to get store items:', error);
    throw error;
  }
}

async function validateResponse(response) {
  try {
    if (await checkAllValues(response)) {
      console.log('Payment validation successful');
      await response.complete('success');
    } else {
      console.log('Payment validation failed');
      await response.complete('fail');
      throw new Error('Payment validation failed');
    }
  } catch (err) {
    console.error('Error during payment validation:', err);
    await response.complete('fail');
    throw err;
  }
}

// Function to validate payment response values
async function checkAllValues(response) {
  try {
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
  } catch (error) {
    console.error('Error validating response:', error);
    return false;
  }
}

// Function to check existing purchases
async function checkPurchases(itemId) {
  try {
    return await digitalGoodsService.listPurchases(itemId);
  } catch (error) {
    console.error('Failed to check purchases:', error);
    throw error;
  }
}

// Export functions and constants for use in other modules
export { initializeStore, getStoreItems, checkPurchases, validateResponse };
