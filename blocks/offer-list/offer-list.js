import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Helper to create a clickable offer element from a pair of rows
 */
function createOffer(imageRow, linkRow) {
  const link = linkRow?.querySelector('a');
  const picture = imageRow?.querySelector('picture');

  if (!link || !picture) return null;

  // Create clickable wrapper
  const offerLink = document.createElement('a');
  offerLink.href = link.href;
  offerLink.className = 'offer-list-link';
  offerLink.title = link.title || '';

  // Copy data attributes
  [...link.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      offerLink.setAttribute(attr.name, attr.value);
    }
  });

  moveInstrumentation(link, offerLink);
  
  // Clone picture
  const clonedPicture = picture.cloneNode(true);
  
  // LIGHTHOUSE FIX: Ensure img has explicit width/height if missing
  const img = clonedPicture.querySelector('img');
  if (img) {
      if (!img.getAttribute('width')) img.setAttribute('width', '100%');
      if (!img.getAttribute('height')) img.setAttribute('height', '100%');
  }

  offerLink.appendChild(clonedPicture);

  return offerLink;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  const innerWrapper = document.createElement('div');
  innerWrapper.className = 'offer-list-inner';

  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-left';

  const rightSection = document.createElement('div');
  rightSection.className = 'offer-list-right';

  for (let i = 0; i < rows.length; i += 2) {
    const imageRow = rows[i];
    const linkRow = rows[i + 1];

    if (!imageRow || !linkRow) continue;

    const offerContent = createOffer(imageRow, linkRow);

    if (offerContent) {
      if (i === 0) {
        moveInstrumentation(imageRow, leftSection);
        leftSection.appendChild(offerContent);
      } else {
        const offerItem = document.createElement('div');
        offerItem.className = 'offer-list-stacked-item';
        moveInstrumentation(imageRow, offerItem);
        offerItem.appendChild(offerContent);
        rightSection.appendChild(offerItem);
      }
    }
  }

  innerWrapper.appendChild(leftSection);
  innerWrapper.appendChild(rightSection);
  container.appendChild(innerWrapper);
  
  block.textContent = '';
  block.appendChild(container);
}