import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Helper to extract text content from a row
  const getTextContent = (row) => {
    const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null, false);
    const texts = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (text && !text.match(/^https?:\/\//)) {
        texts.push(text);
      }
    }
    return texts.join(' ').split(/\n/).filter((t) => t.trim());
  };

  // Left section - Banner (first row with image)
  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-item offer-list-banner';
  if (rows[0]) {
    moveInstrumentation(rows[0], leftSection);
    const bannerText = document.createElement('div');
    bannerText.className = 'offer-list-banner-text';
    
    const pic = rows[0].querySelector('picture');
    const link = rows[0].querySelector('a');
    const textLines = getTextContent(rows[0]);
    
    // If there's a link wrapping the image, make banner clickable
    if (link && pic && pic.closest('a')) {
      const bannerLink = document.createElement('a');
      bannerLink.href = link.href;
      bannerLink.className = 'offer-list-banner-link';
      moveInstrumentation(link, bannerLink);
      
      // Add text lines
      textLines.forEach((line) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'offer-list-banner-line';
        lineEl.textContent = line;
        bannerLink.appendChild(lineEl);
      });
      
      // If no text, use alt text or default
      if (textLines.length === 0) {
        const img = pic.querySelector('img');
        if (img && img.alt) {
          const lineEl = document.createElement('div');
          lineEl.className = 'offer-list-banner-line';
          lineEl.textContent = img.alt.replace(/-/g, ' ').toUpperCase();
          bannerLink.appendChild(lineEl);
        }
      }
      
      bannerText.appendChild(bannerLink);
    } else if (pic) {
      // Just add the picture
      const img = pic.querySelector('img');
      if (textLines.length > 0) {
        textLines.forEach((line) => {
          const lineEl = document.createElement('div');
          lineEl.className = 'offer-list-banner-line';
          lineEl.textContent = line;
          bannerText.appendChild(lineEl);
        });
      } else if (img && img.alt) {
        const lineEl = document.createElement('div');
        lineEl.className = 'offer-list-banner-line';
        lineEl.textContent = img.alt.replace(/-/g, ' ').toUpperCase();
        bannerText.appendChild(lineEl);
      }
    } else {
      // No picture, just move children
      while (rows[0].firstElementChild) {
        bannerText.appendChild(rows[0].firstElementChild);
      }
    }
    
    leftSection.appendChild(bannerText);
  }
  container.appendChild(leftSection);

  // Middle section - Large offer (second row)
  const middleSection = document.createElement('div');
  middleSection.className = 'offer-list-item offer-list-large';
  if (rows[1]) {
    moveInstrumentation(rows[1], middleSection);
    
    const discountEl = document.createElement('div');
    discountEl.className = 'offer-list-discount';
    const detailsEl = document.createElement('div');
    detailsEl.className = 'offer-list-details';

    const link = rows[1].querySelector('a');
    const textParts = getTextContent(rows[1]);
    
    if (textParts.length > 0) {
      const firstLine = textParts[0];
      discountEl.innerHTML = firstLine
        .replace(/\$(\d+)\s*OFF/gi, '<span class="offer-list-amount">$$1</span> <span class="offer-list-off">OFF</span>')
        .replace(/\$(\d+)/g, '<span class="offer-list-amount">$$1</span>');
    }

    // Add remaining text as details
    textParts.slice(1).forEach((text) => {
      const detailLine = document.createElement('div');
      detailLine.className = 'offer-list-detail-line';
      detailLine.textContent = text;
      detailsEl.appendChild(detailLine);
    });

    // Add CTA button
    if (link) {
      const ctaButton = document.createElement('a');
      ctaButton.href = link.href;
      ctaButton.className = 'offer-list-cta';
      ctaButton.textContent = 'GET DETAILS';
      moveInstrumentation(link, ctaButton);
      detailsEl.appendChild(ctaButton);
    }

    middleSection.appendChild(discountEl);
    middleSection.appendChild(detailsEl);
  }
  container.appendChild(middleSection);

  // Right section - Stacked offers
  const rightSection = document.createElement('div');
  rightSection.className = 'offer-list-item offer-list-stacked';

  // Top stacked offer (third row)
  if (rows[2]) {
    const topOffer = document.createElement('div');
    topOffer.className = 'offer-list-stacked-item offer-list-stacked-top';
    moveInstrumentation(rows[2], topOffer);

    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';

    const textParts = getTextContent(rows[2]);
    
    if (textParts.length > 0) {
      const discountEl = document.createElement('div');
      discountEl.className = 'offer-list-discount';
      discountEl.innerHTML = textParts[0].replace(/\$(\d+)/g, '<span class="offer-list-amount">$$1</span>');
      leftHalf.appendChild(discountEl);
    }

    const descEl = document.createElement('div');
    descEl.className = 'offer-list-description';
    textParts.slice(1).forEach((text) => {
      const line = document.createElement('div');
      line.className = 'offer-list-description-line';
      line.textContent = text;
      descEl.appendChild(line);
    });
    leftHalf.appendChild(descEl);

    // Find and optimize image
    const pic = rows[2].querySelector('picture');
    if (pic) {
      const iconEl = document.createElement('div');
      iconEl.className = 'offer-list-icon';
      const img = pic.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconEl.appendChild(optimizedPic);
      }
      rightHalf.appendChild(iconEl);
    }

    // Add CTA button
    const link = rows[2].querySelector('a');
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

  // Bottom stacked offer (fourth row)
  if (rows[3]) {
    const bottomOffer = document.createElement('div');
    bottomOffer.className = 'offer-list-stacked-item offer-list-stacked-bottom';
    moveInstrumentation(rows[3], bottomOffer);

    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';

    const textParts = getTextContent(rows[3]);
    
    if (textParts.length > 0) {
      const discountEl = document.createElement('div');
      discountEl.className = 'offer-list-discount';
      discountEl.innerHTML = textParts[0].replace(/\$(\d+)/g, '<span class="offer-list-amount">$$1</span>');
      leftHalf.appendChild(discountEl);
    }

    const descEl = document.createElement('div');
    descEl.className = 'offer-list-description';
    textParts.slice(1).forEach((text) => {
      const line = document.createElement('div');
      line.className = 'offer-list-description-line';
      line.textContent = text;
      descEl.appendChild(line);
    });
    leftHalf.appendChild(descEl);

    // Find and optimize image
    const pic = rows[3].querySelector('picture');
    if (pic) {
      const iconEl = document.createElement('div');
      iconEl.className = 'offer-list-icon';
      const img = pic.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconEl.appendChild(optimizedPic);
      }
      rightHalf.appendChild(iconEl);
    }

    // Add CTA button
    const link = rows[3].querySelector('a');
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
