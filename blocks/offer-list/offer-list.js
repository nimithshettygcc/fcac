import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Left section - Banner (first row)
  const leftSection = document.createElement('div');
  leftSection.className = 'offer-list-item offer-list-banner';
  if (rows[0]) {
    moveInstrumentation(rows[0], leftSection);
    const bannerText = document.createElement('div');
    bannerText.className = 'offer-list-banner-text';
    while (rows[0].firstElementChild) {
      bannerText.appendChild(rows[0].firstElementChild);
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

    const cols = [...rows[1].children];
    cols.forEach((col, idx) => {
      if (idx === 0) {
        discountEl.appendChild(col);
      } else {
        detailsEl.appendChild(col);
      }
    });

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

    const cols = [...rows[2].children];
    cols.forEach((col) => {
      const pic = col.querySelector('picture, img');
      if (pic) {
        rightHalf.appendChild(col);
      } else {
        leftHalf.appendChild(col);
      }
    });

    // Optimize images
    rightHalf.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture')?.replaceWith(optimizedPic);
    });

    topOffer.appendChild(leftHalf);
    topOffer.appendChild(rightHalf);
    rightSection.appendChild(topOffer);
  }

  // Bottom stacked offer (fourth row if exists)
  if (rows[3]) {
    const bottomOffer = document.createElement('div');
    bottomOffer.className = 'offer-list-stacked-item offer-list-stacked-bottom';
    moveInstrumentation(rows[3], bottomOffer);

    const leftHalf = document.createElement('div');
    leftHalf.className = 'offer-list-stacked-left';
    const rightHalf = document.createElement('div');
    rightHalf.className = 'offer-list-stacked-right';

    const cols = [...rows[3].children];
    cols.forEach((col) => {
      const pic = col.querySelector('picture, img');
      if (pic) {
        rightHalf.appendChild(col);
      } else {
        leftHalf.appendChild(col);
      }
    });

    // Optimize images
    rightHalf.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture')?.replaceWith(optimizedPic);
    });

    bottomOffer.appendChild(leftHalf);
    bottomOffer.appendChild(rightHalf);
    rightSection.appendChild(bottomOffer);
  }

  container.appendChild(rightSection);
  block.textContent = '';
  block.appendChild(container);
}
