// Digital Goods API implementation
class DigitalGoodsService {
  constructor() {
    this.service = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Check if the Digital Goods API is available
      if (!window.getDigitalGoodsService) {
        throw new Error('Digital Goods API is not supported in this browser');
      }
      debugger;
      // Get the service for Microsoft Store
      this.service = await window.getDigitalGoodsService(
        'https://store.microsoft.com/billing'
      );
      this.initialized = true;
      console.log('Digital Goods Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Digital Goods Service:', error);
      throw error;
    }
  }

  async getDetails(itemIds) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const details = await this.service.getDetails(itemIds);
      return details;
    } catch (error) {
      console.error('Failed to get item details:', error);
      throw error;
    }
  }

  async acknowledge(purchaseToken, consume) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.service.acknowledge(purchaseToken, consume);
      console.log('Purchase acknowledged successfully');
    } catch (error) {
      console.error('Failed to acknowledge purchase:', error);
      throw error;
    }
  }

  async listPurchases() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const purchases = await this.service.listPurchases();
      return purchases;
    } catch (error) {
      console.error('Failed to list purchases:', error);
      throw error;
    }
  }

  async listPurchaseHistory() {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const history = await this.service.listPurchaseHistory();
      return history;
    } catch (error) {
      console.error('Failed to list purchase history:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const digitalGoodsService = new DigitalGoodsService();

// Export the service instance
export default digitalGoodsService;
