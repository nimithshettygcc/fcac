import { createElement, addClassesToElements } from '../../scripts/dom.js';

/**
 * Creates an individual offer card
 */
function createOfferCard(imageElement, linkElement, index) {
  const offerCard = createElement('div', ['offer-card', `offer-card-${index}`]);
  
  // Add special class for first (featured) offer
  if (index === 0) {
    addClassesToElements([offerCard], ['offer-card-featured']);
  }
  
  const link = linkElement.querySelector('a');
  const linkUrl = link ? link.getAttribute('href') : '#';
  
  // Create clickable card wrapper
  const cardLink = createElement('a', ['offer-card-link']);
  cardLink.setAttribute('href', linkUrl);
  cardLink.setAttribute('aria-label', `View offer ${index + 1}`);
  
  // Extract and optimize image
  const picture = imageElement.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const altText = img ? img.getAttribute('alt') : 'Offer';
    
    // Clone picture element
    const clonedPicture = picture.cloneNode(true);
    addClassesToElements([clonedPicture], ['offer-image']);
    
    cardLink.append(clonedPicture);
  }
  
  offerCard.append(cardLink);
  return offerCard;
}

/**
 * Main decorate function for offer-list block
 */
export default function decorate(block) {
  const originalRows = [...block.children];
  
  // Clear block content
  block.innerHTML = '';
  addClassesToElements([block], ['offer-list-grid']);
  
  const offerCards = [];
  
  // Process rows in pairs (image + link)
  for (let i = 0; i < originalRows.length; i += 2) {
    const imageRow = originalRows[i];
    const linkRow = originalRows[i + 1];
    
    if (imageRow && linkRow) {
      const offerCard = createOfferCard(
        imageRow.children[0],
        linkRow.children[0],
        i / 2
      );
      offerCards.push(offerCard);
    }
  }
  
  // Append all offer cards to block
  offerCards.forEach(card => block.append(card));
}
