export const extractGenericProduct = () => {
  try {
    // Attempt 1: Schema.org Product data (JSON-LD)
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (let script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.innerText);
        // data could be an array or object
        const items = Array.isArray(data) ? data : [data];
        for (let item of items) {
          if (item['@type'] === 'Product' || item['@type'] === 'ProductGroup') {
            const title = item.name;
            const image = item.image ? (Array.isArray(item.image) ? item.image[0] : item.image) : '';
            let price = 'Unknown';
            if (item.offers) {
              if (item.offers.price) price = item.offers.price.toString();
              else if (Array.isArray(item.offers) && item.offers[0].price) price = item.offers[0].price.toString();
            }
            if (title && price !== 'Unknown') {
              return {
                title,
                price: price.replace(/[^0-9.]/g, ''),
                image: typeof image === 'string' ? image : '',
                identifier: window.location.pathname,
                domain: window.location.hostname
              };
            }
          }
        }
      } catch (e) {
        // Parse error, ignore
      }
    }

    // Attempt 2: Open Graph & Common Meta tags
    const titleMeta = document.querySelector('meta[property="og:title"]') || document.querySelector('title');
    const imageMeta = document.querySelector('meta[property="og:image"]');
    const priceMeta = document.querySelector('meta[property="product:price:amount"]') || document.querySelector('meta[property="og:price:amount"]');

    const title = titleMeta ? (titleMeta.content || titleMeta.innerText) : document.title;
    const image = imageMeta ? imageMeta.content : '';
    let price = priceMeta ? priceMeta.content : 'Unknown';

    // Attempt 3: Try grabbing a visible price if meta price is missing
    if (price === 'Unknown') {
      // Look for common price class patterns
      const priceElement = document.querySelector('[class*="price"], [class*="Price"], [id*="price"]');
      if (priceElement && priceElement.innerText.match(/[0-9]/)) {
        price = priceElement.innerText.replace(/[^0-9.]/g, '');
      }
    }

    // If we have a reasonable title, assume it's a generic product page
    if (title && title.length > 5) {
      return {
        title,
        price,
        image,
        identifier: window.location.pathname,
        domain: window.location.hostname
      };
    }

    return null;
  } catch (error) {
    console.error('PricePilot Generic Error:', error);
    return null;
  }
};
