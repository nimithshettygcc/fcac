import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Left section - Cyber Monday Sale offer (first row)
  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-item offer-list-left';
  if (rows[0]) {
    moveInstrumentation(rows[0], leftSection);
    
    // Find link and picture in the row (search at any depth)
    const link = rows[0].querySelector('a[data-promo-title], a.tile-link, a');
    const pic = rows[0].querySelector('picture');
    
    if (link && pic) {
      // Create clickable offer with image
      const offerLink = document.createElement('a');
      offerLink.href = link.href;
      offerLink.className = 'offer-list-left-link';
      moveInstrumentation(link, offerLink);
      
      // Clone and add the picture
      const clonedPic = pic.cloneNode(true);
      offerLink.appendChild(clonedPic);
      
      leftSection.appendChild(offerLink);
    } else if (pic) {
      // Just picture, wrap in link if available
      if (link) {
        const offerLink = document.createElement('a');
        offerLink.href = link.href;
        offerLink.className = 'offer-list-left-link';
        moveInstrumentation(link, offerLink);
        offerLink.appendChild(pic.cloneNode(true));
        leftSection.appendChild(offerLink);
      } else {
        leftSection.appendChild(pic.cloneNode(true));
      }
    } else if (link) {
      // Just link, move it
      const offerLink = link.cloneNode(true);
      moveInstrumentation(link, offerLink);
      leftSection.appendChild(offerLink);
    } else {
      // Fallback: move all children
      while (rows[0].firstElementChild) {
        leftSection.appendChild(rows[0].firstElementChild);
      }
    }
  }
  container.appendChild(leftSection);

  // Right section - Stacked offers (second and third rows)
  const rightSection = document.createElement('div');
  rightSection.className = 'offer-list-item offer-list-stacked';

  // Top stacked offer (second row)
  if (rows[1]) {
    const topOffer = document.createElement('div');
    topOffer.className = 'offer-list-stacked-item offer-list-stacked-top';
    moveInstrumentation(rows[1], topOffer);
    
    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';
    
    // Extract data (search at any depth)
    const link = rows[1].querySelector('a[data-promo-title], a.tile-link, a');
    const pic = rows[1].querySelector('picture');
    const title = link?.getAttribute('data-promo-title') || rows[1].textContent.trim() || '';
    
    // Parse title for discount
    const dollarMatch = title.match(/\$(\d+)/);
    if (dollarMatch) {
      const discountEl = document.createElement('div');
      discountEl.className = 'offer-list-discount';
      discountEl.innerHTML = `<span class="offer-list-amount">$${dollarMatch[1]}</span>`;
      leftHalf.appendChild(discountEl);
    }
    
    // Description
    const descEl = document.createElement('div');
    descEl.className = 'offer-list-description';
    
    const savingsMatch = title.match(/IN SAVINGS ON A (.+)/i);
    if (savingsMatch) {
      const line1 = document.createElement('div');
      line1.className = 'offer-list-description-line';
      line1.textContent = 'GET UP TO';
      descEl.appendChild(line1);
      
      const line2 = document.createElement('div');
      line2.className = 'offer-list-description-line';
      line2.textContent = savingsMatch[1].toUpperCase();
      descEl.appendChild(line2);
    } else if (title) {
      // Extract meaningful text parts
      const parts = title.split(/\s+/).filter((p) => p && !p.match(/^\$/) && p.length > 2);
      parts.slice(1, 5).forEach((part) => {
        const line = document.createElement('div');
        line.className = 'offer-list-description-line';
        line.textContent = part.toUpperCase();
        descEl.appendChild(line);
      });
    }
    
    leftHalf.appendChild(descEl);
    
    // Image/Icon - make it clickable
    if (pic) {
      const iconEl = document.createElement('div');
      iconEl.className = 'offer-list-icon';
      
      if (link) {
        // Wrap icon in link
        const iconLink = document.createElement('a');
        iconLink.href = link.href;
        iconLink.className = 'offer-list-icon-link';
        moveInstrumentation(link, iconLink);
        
        const clonedPic = pic.cloneNode(true);
        iconLink.appendChild(clonedPic);
        iconEl.appendChild(iconLink);
      } else {
        iconEl.appendChild(pic.cloneNode(true));
      }
      
      rightHalf.appendChild(iconEl);
    }
    
    // CTA button
    if (link) {
      const ctaButton = document.createElement('a');
      ctaButton.href = link.href;
      ctaButton.className = 'offer-list-cta';
      ctaButton.textContent = 'GET DETAILS';
      moveInstrumentation(link, ctaButton);
      rightHalf.appendChild(ctaButton);
    }
    
    topOffer.appendChild(leftHalf);
    topOffer.appendChild(rightHalf);
    rightSection.appendChild(topOffer);
  }

  // Bottom stacked offer (third row)
  if (rows[2]) {
    const bottomOffer = document.createElement('div');
    bottomOffer.className = 'offer-list-stacked-item offer-list-stacked-bottom';
    moveInstrumentation(rows[2], bottomOffer);
    
    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';
    
    // Extract data (search at any depth)
    const link = rows[2].querySelector('a[data-promo-title], a.tile-link, a');
    const pic = rows[2].querySelector('picture');
    const title = link?.getAttribute('data-promo-title') || rows[2].textContent.trim() || '';
    
    // Parse title for discount
    const dollarMatch = title.match(/\$(\d+)/);
    if (dollarMatch) {
      const discountEl = document.createElement('div');
      discountEl.className = 'offer-list-discount';
      discountEl.innerHTML = `<span class="offer-list-amount">$${dollarMatch[1]}</span>`;
      leftHalf.appendChild(discountEl);
    }
    
    // Description
    const descEl = document.createElement('div');
    descEl.className = 'offer-list-description';
    
    const savingsMatch = title.match(/IN SAVINGS ON A (.+)/i);
    if (savingsMatch) {
      const line1 = document.createElement('div');
      line1.className = 'offer-list-description-line';
      line1.textContent = 'GET UP TO';
      descEl.appendChild(line1);
      
      const line2 = document.createElement('div');
      line2.className = 'offer-list-description-line';
      line2.textContent = savingsMatch[1].toUpperCase();
      descEl.appendChild(line2);
    } else if (title) {
      const parts = title.split(/\s+/).filter((p) => p && !p.match(/^\$/) && p.length > 2);
      parts.slice(1, 5).forEach((part) => {
        const line = document.createElement('div');
        line.className = 'offer-list-description-line';
        line.textContent = part.toUpperCase();
        descEl.appendChild(line);
      });
    }
    
    leftHalf.appendChild(descEl);
    
    // Image/Icon - make it clickable
    if (pic) {
      const iconEl = document.createElement('div');
      iconEl.className = 'offer-list-icon';
      
      if (link) {
        // Wrap icon in link
        const iconLink = document.createElement('a');
        iconLink.href = link.href;
        iconLink.className = 'offer-list-icon-link';
        moveInstrumentation(link, iconLink);
        
        const clonedPic = pic.cloneNode(true);
        iconLink.appendChild(clonedPic);
        iconEl.appendChild(iconLink);
      } else {
        iconEl.appendChild(pic.cloneNode(true));
      }
      
      rightHalf.appendChild(iconEl);
    }
    
    // CTA button
    if (link) {
      const ctaButton = document.createElement('a');
      ctaButton.href = link.href;
      ctaButton.className = 'offer-list-cta';
      ctaButton.textContent = 'GET DETAILS';
      moveInstrumentation(link, ctaButton);
      rightHalf.appendChild(ctaButton);
    }
    
    bottomOffer.appendChild(leftHalf);
    bottomOffer.appendChild(rightHalf);
    rightSection.appendChild(bottomOffer);
  }

  container.appendChild(rightSection);
  block.textContent = '';
  block.appendChild(container);
}
