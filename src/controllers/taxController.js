const taxService = require('../services/taxService');

class TaxController {
  async calculateTax(req, res) {
    try {
      const result = await taxService.calculateTax(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TaxController();
