const { Product, PriceObservation } = require('../models');

exports.resolveProduct = async (req, res) => {
  try {
    const { url, title, price, image, identifier, domain } = req.body;
    let product = await Product.findOne({ where: { url } });

    if (!product) {
      product = await Product.create({
        url,
        title: title || 'Unknown Product',
        imageUrl: image,
        identifier,
        domain
      });
    }

    if (price && price !== 'Unknown') {
      const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g,""));
      if (!isNaN(parsedPrice)) {
        await PriceObservation.create({
          productId: product.id,
          price: parsedPrice
        });
      }
    }

    res.status(200).json({ success: true, data: { _id: product.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
