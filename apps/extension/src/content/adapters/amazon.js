// Amazon Source Adapter
export const extractAmazon = (document) => {
  // Amazon title
  let title = document.querySelector('#productTitle')?.innerText?.trim();
  
  // Amazon price
  // The price block on Amazon can vary drastically, usually #corePriceDisplay_desktop_feature_div or .a-price .a-offscreen
  const priceEl = document.querySelector('#corePriceDisplay_desktop_feature_div .a-price .a-offscreen') 
               || document.querySelector('#priceblock_ourprice')
               || document.querySelector('.a-price.a-text-price .a-offscreen');
  
  let price = priceEl ? priceEl.innerText.trim() : null;

  // Image
  const imgEl = document.querySelector('#landingImage');
  const image = imgEl ? imgEl.src : null;

  // ASIN from URL or element
  const asinEl = document.querySelector('#ASIN');
  const identifier = asinEl ? asinEl.value : null;

  return {
    title,
    price,
    image,
    identifier,
    domain: 'amazon.com'
  };
};
