import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Helper to create a clickable offer element from a pair of rows
 * @param {HTMLElement} imageRow - The row containing the image
 * @param {HTMLElement} linkRow - The row containing the link
 * @returns {HTMLElement|null} The constructed anchor tag wrapper or null if invalid
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

  // Copy relevant data attributes for tracking
  [...link.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      offerLink.setAttribute(attr.name, attr.value);
    }
  });

  // Ensure instrumentation moves correctly for UE
  moveInstrumentation(link, offerLink);

  // Clone and append the image
  offerLink.appendChild(picture.cloneNode(true));

  return offerLink;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Create main container (Full Width)
  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Create inner wrapper (Max Width / Grid)
  const innerWrapper = document.createElement('div');
  innerWrapper.className = 'offer-list-inner';

  // LEFT SECTION - Featured offer
  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-left';

  // RIGHT SECTION - Stacked offers
  const rightSection = document.createElement('div');
  rightSection.className = 'offer-list-right';

  // Iterate through rows in pairs (Image + Link)
  for (let i = 0; i < rows.length; i += 2) {
    const imageRow = rows[i];
    const linkRow = rows[i + 1];

    if (!imageRow || !linkRow) continue;

    const offerContent = createOffer(imageRow, linkRow);

    if (offerContent) {
      if (i === 0) {
        // First item -> Left Section (Featured)
        moveInstrumentation(imageRow, leftSection);
        leftSection.appendChild(offerContent);
      } else {
        // Subsequent items -> Right Section (Stacked)
        const offerItem = document.createElement('div');
        offerItem.className = 'offer-list-stacked-item';
        moveInstrumentation(imageRow, offerItem);
        offerItem.appendChild(offerContent);
        rightSection.appendChild(offerItem);
      }
    }
  }

  // Assemble the block
  innerWrapper.appendChild(leftSection);
  innerWrapper.appendChild(rightSection);
  container.appendChild(innerWrapper);
  
  block.textContent = ''; // Clear original content
  block.appendChild(container);
}