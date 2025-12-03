import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('=== FOOTER DEBUG START ===');
  console.log('Block:', block);
  console.log('Block children count:', block.children.length);
  
  const sections = [...block.children];
  
  // Log each section
  sections.forEach((section, index) => {
    console.log(`Section ${index}:`, section);
    const contentWrapper = section.querySelector('.default-content-wrapper');
    console.log(`  - Has content wrapper:`, !!contentWrapper);
    if (contentWrapper) {
      console.log(`  - Content preview:`, contentWrapper.innerHTML.substring(0, 100));
    }
  });
  
  if (sections.length === 0) {
    console.warn('No sections found');
    return;
  }

  // Create main footer structure
  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const footerNav = document.createElement('div');
  footerNav.className = 'footer-nav';

  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  // Process each section
  sections.forEach((section, index) => {
    const contentWrapper = section.querySelector('.default-content-wrapper');
    
    if (!contentWrapper) {
      console.warn(`Section ${index} has no content wrapper`);
      return;
    }

    console.log(`Processing section ${index}`);

    // Create column and move content
    const column = document.createElement('div');
    column.className = 'footer-column';
    
    // Clone all content
    const contentClone = contentWrapper.cloneNode(true);
    column.appendChild(contentClone);

    // Distribute to sections
    if (index <= 4) {
      console.log(`  -> Added to footer-top`);
      footerTop.appendChild(column);
    } else if (index >= 5 && index <= 8) {
      console.log(`  -> Added to footer-nav`);
      footerNav.appendChild(column);
    } else if (index >= 9) {
      console.log(`  -> Added to footer-bottom`);
      footerBottom.appendChild(column);
    }
  });

  console.log('Footer-top children:', footerTop.children.length);
  console.log('Footer-nav children:', footerNav.children.length);
  console.log('Footer-bottom children:', footerBottom.children.length);

  // Clear and rebuild
  block.innerHTML = '';
  block.appendChild(footerTop);
  block.appendChild(footerNav);
  block.appendChild(footerBottom);

  // Add copyright
  const copyright = document.createElement('div');
  copyright.className = 'footer-copyright';
  copyright.textContent = '© 2025 Firestone Complete Auto Care. All Rights Reserved.';
  footerBottom.appendChild(copyright);
  
  console.log('=== FOOTER DEBUG END ===');
}
