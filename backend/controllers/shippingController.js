// controllers/shippingController.js - Shipping functions

const getShippingMethods = async (req, res) => {
  try {
    const methods = [
      { method: 'standard', cost: 5.0, eta: '5-7 days' },
      { method: 'express', cost: 12.0, eta: '2-3 days' },
      { method: 'overnight', cost: 25.0, eta: '1 day' }
    ];

    res.status(200).json({
      success: true,
      data: methods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving shipping methods',
      error: error.message
    });
  }
};

const calculateShipping = async (req, res) => {
  try {
    const { weight = 0, method = 'standard', country } = req.body;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: 'Country is required for shipping calculation'
      });
    }

    const baseRates = {
      standard: 5,
      express: 12,
      overnight: 25
    };

    const methodRate = baseRates[method] || baseRates.standard;
    const cost = methodRate + weight * 0.75;
    const estimate = method === 'overnight' ? '1 day' : method === 'express' ? '2-3 days' : '5-7 days';

    res.status(200).json({
      success: true,
      data: {
        country,
        method,
        cost: Number(cost.toFixed(2)),
        estimate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating shipping',
      error: error.message
    });
  }
};

module.exports = {
  getShippingMethods,
  calculateShipping
};
