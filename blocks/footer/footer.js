import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('=== FOOTER DECORATE START ===');
  console.log('Block:', block);
  console.log('Block children:', block.children.length);
  console.log('Block HTML preview:', block.innerHTML.substring(0, 300));
  
  // Get the wrapper div (first child of block)
  const wrapper = block.children[0];
  if (!wrapper) {
    console.error('No wrapper found!');
    return;
  }
  
  console.log('Wrapper:', wrapper);
  console.log('Wrapper children:', wrapper.children.length);
  
  // Get all section containers
  const sectionContainers = [...wrapper.children];
  console.log('Section containers:', sectionContainers.length);
  
  sectionContainers.forEach((container, i) => {
    console.log(`\nContainer ${i}:`, container);
    console.log(`  Classes:`, container.className);
    console.log(`  Has .section:`, !!container.querySelector('.section'));
    console.log(`  Has .default-content-wrapper:`, !!container.querySelector('.default-content-wrapper'));
    console.log(`  HTML preview:`, container.innerHTML.substring(0, 100));
  });
  
  if (sectionContainers.length === 0) {
    console.error('No section containers found!');
    return;
  }

  // Create main footer structure
  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const footerNav = document.createElement('div');
  footerNav.className = 'footer-nav';

  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  // Process each section container
  sectionContainers.forEach((container, index) => {
    console.log(`\n--- Processing container ${index} ---`);
    
    // Find content wrapper inside section
    const contentWrapper = container.querySelector('.default-content-wrapper');
    
    if (!contentWrapper) {
      console.warn(`No content wrapper in container ${index}`);
      return;
    }
    
    console.log(`Content wrapper found with ${contentWrapper.children.length} children`);

    // Create column
    const column = document.createElement('div');
    column.className = 'footer-column';
    
    // Move content (not clone) to preserve all elements
    let moved = 0;
    while (contentWrapper.firstChild) {
      column.appendChild(contentWrapper.firstChild);
      moved++;
    }
    
    console.log(`Moved ${moved} elements to column`);

    // Distribute to sections
    if (index <= 4) {
      console.log(`-> Adding to footer-top`);
      footerTop.appendChild(column);
    } else if (index >= 5 && index <= 8) {
      console.log(`-> Adding to footer-nav`);
      footerNav.appendChild(column);
    } else if (index >= 9) {
      console.log(`-> Adding to footer-bottom`);
      footerBottom.appendChild(column);
    }
  });

  console.log('\n=== FINAL COUNTS ===');
  console.log('Footer-top columns:', footerTop.children.length);
  console.log('Footer-nav columns:', footerNav.children.length);
  console.log('Footer-bottom columns:', footerBottom.children.length);

  // Clear and rebuild
  block.innerHTML = '';
  
  // Create footer wrapper
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  
  footer.appendChild(footerTop);
  footer.appendChild(footerNav);
  footer.appendChild(footerBottom);

  // Add copyright
  const copyright = document.createElement('div');
  copyright.className = 'footer-copyright';
  copyright.textContent = '© 2025 Firestone Complete Auto Care. All Rights Reserved.';
  footerBottom.appendChild(copyright);
  
  block.appendChild(footer);
  
  console.log('=== FOOTER DECORATE END ===\n');
}
