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
    await this.ensureInitialization();
    return await this.fetchAndProcessDetails(itemIds);
  }

  async ensureInitialization() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.service) {
      throw new Error('Digital Goods Service not initialized properly');
    }
  }

  async fetchAndProcessDetails(itemIds) {
    const details = await this.service.getDetails(itemIds);
    if (!details) {
      this.warnNoDetails(itemIds);
      return [];
    }
    return details;
  }

  warnNoDetails(itemIds) {
    console.warn('No details returned for items:', itemIds);
  }

  async listPurchases() {
    await this.ensureInitialization();
    // The listPurchases method doesn't return consumed products or expired subscriptions.
    return await this.service.listPurchases();
  }

  async listPurchaseHistory() {
    await this.ensureInitialization();
    return await this.service.listPurchaseHistory();
  }
}

// Create a singleton instance
const digitalGoodsService = new DigitalGoodsService();

// Export the service instance
export default digitalGoodsService;
