const Product = require('../models/Product');
const PriceObservation = require('../models/PriceObservation');

exports.resolveProduct = async (req, res) => {
  try {
    const { url, title, price, domain, image } = req.body;
    
    // Parse price to number for observation (basic fallback parser)
    let numericPrice = null;
    if (price) {
      const match = price.match(/[\d,.]+/);
      if (match) {
        numericPrice = parseFloat(match[0].replace(/,/g, ''));
      }
    }

    let product = await Product.findOne({ url });
    
    if (!product) {
      product = await Product.create({
        url,
        title,
        source: domain || new URL(url).hostname,
        imageUrl: image,
        currency: 'USD'
      });
    }

    // Always record a new price observation when resolved with a valid price
    if (numericPrice !== null && !isNaN(numericPrice)) {
      await PriceObservation.create({
        product: product._id,
        priceAmount: numericPrice,
        currency: 'USD',
        sourceType: 'browser_extension',
        validationStatus: 'unverified'
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error resolving product' });
  }
};

exports.getProductHistory = async (req, res) => {
  try {
    const observations = await PriceObservation.find({ product: req.params.id })
      .sort({ observedAt: 1 })
      .select('priceAmount observedAt currency');
      
    res.status(200).json({ success: true, data: observations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error fetching history' });
  }
};
