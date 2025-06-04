// Digital Goods API implementation
class DigitalGoodsService {
  constructor() {
    this.service = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    if (window.getDigitalGoodsService === undefined) {
      throw new Error('Digital Goods API is not supported in this browser');
    }

    this.service = await window.getDigitalGoodsService(
      'https://store.microsoft.com/billing'
    );
    this.initialized = true;
    console.log('Digital Goods Service initialized successfully');
  }

  async getDetails(itemIds) {
    if (!this.initialized) {
      await this.initialize();
    }
    return await this.service.getDetails(itemIds);
  }

  async listPurchases() {
    if (!this.initialized) {
      await this.initialize();
    }
    // The listPurchases method doesn't return consumed products or expired subscriptions.
    return await this.service.listPurchases();
  }

  async listPurchaseHistory() {
    if (!this.initialized) {
      await this.initialize();
    }
    return await this.service.listPurchaseHistory();
  }
}

// Create a singleton instance
const digitalGoodsService = new DigitalGoodsService();

// Export the service instance
export default digitalGoodsService;
