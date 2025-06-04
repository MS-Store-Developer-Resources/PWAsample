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

    try {
      return await this.fetchAndProcessDetails(itemIds);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
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

  handleError(error) {
    console.error('Error getting item details:', error);
    if (error.name === 'OperationError') {
      throw new Error(
        'Failed to get item details. Please ensure you are using a supported browser and try again.'
      );
    }
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
