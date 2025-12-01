import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Helper to extract promo data from a row
  const getPromoData = (row) => {
    const link = row.querySelector('a[data-promo-title]');
    const pic = row.querySelector('picture');
    const img = pic?.querySelector('img');
    
    return {
      link,
      pic,
      img,
      title: link?.getAttribute('data-promo-title') || '',
      href: link?.href || '',
    };
  };

  // Helper to parse title text into discount and description
  const parseTitle = (title) => {
    if (!title) return { discount: '', description: [] };
    
    // Extract dollar amounts
    const dollarMatch = title.match(/\$(\d+)/);
    const discount = dollarMatch ? `$${dollarMatch[1]}` : '';
    
    // Split by common separators and clean up
    const parts = title
      .split(/[|:]/)
      .map((p) => p.trim())
      .filter((p) => p && !p.match(/^https?:\/\//));
    
    // First part is usually the main offer, rest is description
    const description = parts.slice(1);
    
    return { discount, description, fullText: parts[0] || title };
  };

  // Left section - Banner (first row)
  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-item offer-list-banner';
  if (rows[0]) {
    moveInstrumentation(rows[0], leftSection);
    const promo = getPromoData(rows[0]);
    const bannerText = document.createElement('div');
    bannerText.className = 'offer-list-banner-text';
    
    if (promo.link) {
      const bannerLink = document.createElement('a');
      bannerLink.href = promo.href;
      bannerLink.className = 'offer-list-banner-link';
      moveInstrumentation(promo.link, bannerLink);
      
      // Extract text from title (e.g., "Cyber Monday Sale")
      const titleParts = promo.title.split(':')[0].split('|')[0].trim();
      const lines = titleParts.split(/\s+/).filter((w) => w);
      
      // Group into banner lines (e.g., "CYBER", "MONDAY", "SALE")
      if (lines.length >= 3) {
        lines.forEach((line) => {
          const lineEl = document.createElement('div');
          lineEl.className = 'offer-list-banner-line';
          lineEl.textContent = line.toUpperCase();
          bannerLink.appendChild(lineEl);
        });
      } else {
        // Single line
        const lineEl = document.createElement('div');
        lineEl.className = 'offer-list-banner-line';
        lineEl.textContent = titleParts.toUpperCase();
        bannerLink.appendChild(lineEl);
      }
      
      bannerText.appendChild(bannerLink);
    }
    
    leftSection.appendChild(bannerText);
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
    
    const promo = getPromoData(rows[1]);
    const parsed = parseTitle(promo.title);
    
    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';
    
    // Discount
    if (parsed.discount) {
      const discountEl = document.createElement('div');
      discountEl.className = 'offer-list-discount';
      discountEl.innerHTML = `<span class="offer-list-amount">${parsed.discount}</span>`;
      leftHalf.appendChild(discountEl);
    }
    
    // Description
    const descEl = document.createElement('div');
    descEl.className = 'offer-list-description';
    
    // Extract "IN SAVINGS ON A" type text
    const savingsMatch = promo.title.match(/IN SAVINGS ON A (.+)/i);
    if (savingsMatch) {
      const line1 = document.createElement('div');
      line1.className = 'offer-list-description-line';
      line1.textContent = 'GET UP TO';
      descEl.appendChild(line1);
      
      const line2 = document.createElement('div');
      line2.className = 'offer-list-description-line';
      line2.textContent = savingsMatch[1].toUpperCase();
      descEl.appendChild(line2);
    } else if (parsed.fullText) {
      const parts = parsed.fullText.split(/\s+/).slice(1); // Skip the dollar amount
      parts.forEach((part) => {
        if (part && part.length > 2) {
          const line = document.createElement('div');
          line.className = 'offer-list-description-line';
          line.textContent = part.toUpperCase();
          descEl.appendChild(line);
        }
      });
    }
    
    leftHalf.appendChild(descEl);
    
    // Image/Icon
    if (promo.pic && promo.img) {
      const iconEl = document.createElement('div');
      iconEl.className = 'offer-list-icon';
      const optimizedPic = createOptimizedPicture(promo.img.src || promo.img.srcset, promo.img.alt || '', false, [{ width: '100' }]);
      moveInstrumentation(promo.img, optimizedPic.querySelector('img'));
      iconEl.appendChild(optimizedPic);
      rightHalf.appendChild(iconEl);
    }
    
    // CTA button
    if (promo.link) {
      const ctaButton = document.createElement('a');
      ctaButton.href = promo.href;
      ctaButton.className = 'offer-list-cta';
      ctaButton.textContent = 'GET DETAILS';
      moveInstrumentation(promo.link, ctaButton);
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
    
    const promo = getPromoData(rows[2]);
    const parsed = parseTitle(promo.title);
    
    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';
    
    // Discount
    if (parsed.discount) {
      const discountEl = document.createElement('div');
      discountEl.className = 'offer-list-discount';
      discountEl.innerHTML = `<span class="offer-list-amount">${parsed.discount}</span>`;
      leftHalf.appendChild(discountEl);
    }
    
    // Description
    const descEl = document.createElement('div');
    descEl.className = 'offer-list-description';
    
    const savingsMatch = promo.title.match(/IN SAVINGS ON A (.+)/i);
    if (savingsMatch) {
      const line1 = document.createElement('div');
      line1.className = 'offer-list-description-line';
      line1.textContent = 'GET UP TO';
      descEl.appendChild(line1);
      
      const line2 = document.createElement('div');
      line2.className = 'offer-list-description-line';
      line2.textContent = savingsMatch[1].toUpperCase();
      descEl.appendChild(line2);
    } else if (parsed.fullText) {
      const parts = parsed.fullText.split(/\s+/).slice(1);
      parts.forEach((part) => {
        if (part && part.length > 2) {
          const line = document.createElement('div');
          line.className = 'offer-list-description-line';
          line.textContent = part.toUpperCase();
          descEl.appendChild(line);
        }
      });
    }
    
    leftHalf.appendChild(descEl);
    
    // Image/Icon
    if (promo.pic && promo.img) {
      const iconEl = document.createElement('div');
      iconEl.className = 'offer-list-icon';
      const optimizedPic = createOptimizedPicture(promo.img.src || promo.img.srcset, promo.img.alt || '', false, [{ width: '100' }]);
      moveInstrumentation(promo.img, optimizedPic.querySelector('img'));
      iconEl.appendChild(optimizedPic);
      rightHalf.appendChild(iconEl);
    }
    
    // CTA button
    if (promo.link) {
      const ctaButton = document.createElement('a');
      ctaButton.href = promo.href;
      ctaButton.className = 'offer-list-cta';
      ctaButton.textContent = 'GET DETAILS';
      moveInstrumentation(promo.link, ctaButton);
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
