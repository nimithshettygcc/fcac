import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('✅ Offer-list decorate started');
  
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Process rows in pairs (image + link)
  for (let i = 0; i < rows.length; i += 2) {
    const imageRow = rows[i];
    const linkRow = rows[i + 1];
    
    if (!imageRow || !linkRow) continue;
    
    const offerItem = document.createElement('div');
    offerItem.className = 'offer-list-item';
    
    // Add special class for first (featured) item
    if (i === 0) {
      offerItem.classList.add('offer-list-featured');
    }
    
    moveInstrumentation(imageRow, offerItem);
    
    // Get link and picture
    const link = linkRow.querySelector('a');
    const picture = imageRow.querySelector('picture');
    
    if (!link || !picture) {
      console.warn('Missing link or picture in row', i/2);
      continue;
    }
    
    // Create clickable wrapper
    const offerLink = document.createElement('a');
    offerLink.href = link.href;
    offerLink.className = 'offer-list-link';
    offerLink.setAttribute('aria-label', `View offer ${(i/2) + 1}`);
    
    // Copy link attributes
    [...link.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-') || attr.name === 'title') {
        offerLink.setAttribute(attr.name, attr.value);
      }
    });
    
    moveInstrumentation(link, offerLink);
    
    // Move picture (not clone) to preserve responsive sources
    if (picture.parentNode) {
      picture.parentNode.removeChild(picture);
    }
    offerLink.appendChild(picture);
    
    offerItem.appendChild(offerLink);
    container.appendChild(offerItem);
  }

  block.textContent = '';
  block.appendChild(container);
  
  console.log('✅ Offer-list decorate complete - created', container.children.length, 'items');
}
