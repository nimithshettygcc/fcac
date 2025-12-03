import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('=== FOOTER DEBUG START ===');
  
  // The block has one wrapper div that contains all sections
  const wrapper = block.children[0];
  if (!wrapper) {
    console.warn('No wrapper found');
    return;
  }
  
  // Get sections from INSIDE the wrapper
  const sections = [...wrapper.querySelectorAll('.section')];
  console.log('Found sections:', sections.length);
  
  if (sections.length === 0) return;

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

    // Create column
    const column = document.createElement('div');
    column.className = 'footer-column';
    
    // Clone the content
    const contentClone = contentWrapper.cloneNode(true);
    column.appendChild(contentClone);

    // Distribute to appropriate sections
    // Top bar: 0-4 (Questions, Coupons, Credit Card, App, Social)
    if (index <= 4) {
      console.log(`  -> Added to footer-top`);
      footerTop.appendChild(column);
    }
    // Navigation: 5-8 (Tires, Services, Firestone, Blog)
    else if (index >= 5 && index <= 8) {
      console.log(`  -> Added to footer-nav`);
      footerNav.appendChild(column);
    }
    // Bottom: 9-10 (Logo, Legal)
    else if (index >= 9) {
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
