import digitalGoodsService from './digital-goods.js';

// Microsoft Store item IDs
const STORE_ITEMS = {
  PREMIUM_FEATURES: 'super_acceso_vip',
  REMOVE_ADS: 'remove_ads',
};

// Initialize the store
async function initializeStore() {
  try {
    await digitalGoodsService.initialize();
    const itemDetails = await digitalGoodsService.getDetails([
      STORE_ITEMS.PREMIUM_FEATURES,
      STORE_ITEMS.REMOVE_ADS,
    ]);
    return itemDetails;
  } catch (error) {
    console.error('Failed to initialize store:', error);
    throw error;
  }
}

// Function to handle purchasing an item
async function purchaseItem(itemId) {
  try {
    // Get item details first
    const [itemDetails] = await digitalGoodsService.getDetails([itemId]);

    if (!itemDetails) {
      throw new Error('Item not found');
    }

    // Here you would typically show a purchase UI
    // For Microsoft Store, this would open the store purchase flow
    console.log('Initiating purchase for:', itemDetails);
    const item = itemDetails[0];

    const request = new PaymentRequest([
      {
        supportedMethods: 'https://store.microsoft.com/billing',
        data: { sku: item.itemId },
      },
    ]);

    const response = await request.show();
    return response.details;
  } catch (error) {
    console.error('Purchase failed:', error);
    throw error;
  }
}

// Function to check existing purchases
async function checkPurchases() {
  try {
    return await digitalGoodsService.listPurchases();
  } catch (error) {
    console.error('Failed to check purchases:', error);
    throw error;
  }
}

// Export functions and constants for use in other modules
export { initializeStore, purchaseItem, checkPurchases, STORE_ITEMS };
