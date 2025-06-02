import digitalGoodsService from './digital-goods.js';

// Example Microsoft Store item IDs
const STORE_ITEMS = {
  PREMIUM_FEATURES: 'premium_features',
  REMOVE_ADS: 'remove_ads',
  // Add more items as needed
};

// Initialize the store when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await digitalGoodsService.initialize();
    console.log('Store initialized successfully');

    // Example: Get details for all items
    const itemDetails = await digitalGoodsService.getDetails([
      STORE_ITEMS.PREMIUM_FEATURES,
      STORE_ITEMS.REMOVE_ADS,
    ]);
    console.log('Available items:', itemDetails);

    // Example: Check existing purchases
    const purchases = await digitalGoodsService.listPurchases();
    console.log('Current purchases:', purchases);

    // Update UI based on purchases
    updateUIWithPurchases(purchases);
  } catch (error) {
    console.error('Failed to initialize store:', error);
  }
});

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

    // After successful purchase, acknowledge it
    // Note: In a real implementation, you would get the purchaseToken from the purchase flow
    // await digitalGoodsService.acknowledge(purchaseToken, true);
  } catch (error) {
    console.error('Purchase failed:', error);
  }
}

// Function to update UI based on purchases
function updateUIWithPurchases(purchases) {
  // Example: Update UI elements based on purchases
  purchases.forEach((purchase) => {
    const element = document.querySelector(
      `[data-item-id="${purchase.itemId}"]`
    );
    if (element) {
      element.classList.add('purchased');
      // Disable purchase button or show "Purchased" status
    }
  });
}

// Example: Add click handlers to purchase buttons
document.addEventListener('click', async (event) => {
  if (event.target.matches('[data-purchase-item]')) {
    const itemId = event.target.dataset.purchaseItem;
    await purchaseItem(itemId);
  }
});

// Export functions for use in other modules if needed
export { purchaseItem, STORE_ITEMS };
