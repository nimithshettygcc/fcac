import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // LEFT SECTION - Featured offer (Cyber Monday)
  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-left';

  // RIGHT SECTION - Stacked offers
  const rightSection = document.createElement('div');
  rightSection.className = 'offer-list-right';

  // Process each pair (image + link)
  for (let i = 0; i < rows.length; i += 2) {
    const imageRow = rows[i];
    const linkRow = rows[i + 1];
    
    if (!imageRow || !linkRow) continue;
    
    const link = linkRow.querySelector('a');
    const picture = imageRow.querySelector('picture');
    
    if (!link || !picture) continue;
    
    // Create clickable wrapper
    const offerLink = document.createElement('a');
    offerLink.href = link.href;
    offerLink.className = 'offer-list-link';
    
    // Copy attributes
    [...link.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-') || attr.name === 'title') {
        offerLink.setAttribute(attr.name, attr.value);
      }
    });
    
    moveInstrumentation(link, offerLink);
    
    // Clone picture
    const pictureClone = picture.cloneNode(true);
    offerLink.appendChild(pictureClone);
    
    // First item goes to left section, others to right section
    if (i === 0) {
      moveInstrumentation(imageRow, leftSection);
      leftSection.appendChild(offerLink);
    } else {
      const offerItem = document.createElement('div');
      offerItem.className = 'offer-list-stacked-item';
      moveInstrumentation(imageRow, offerItem);
      offerItem.appendChild(offerLink);
      rightSection.appendChild(offerItem);
    }
  }

  container.appendChild(leftSection);
  container.appendChild(rightSection);
  
  block.textContent = '';
  block.appendChild(container);
}
