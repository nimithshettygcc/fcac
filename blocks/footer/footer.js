import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Get the wrapper div (first child of block)
  const wrapper = block.children[0];
  if (!wrapper) return;
  
  // Get all section containers
  const sectionContainers = [...wrapper.children];
  if (sectionContainers.length === 0) return;

  // Create main footer structure
  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const footerNav = document.createElement('div');
  footerNav.className = 'footer-nav';

  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  // Process each section container
  sectionContainers.forEach((container, index) => {
    // Find content wrapper inside section
    const contentWrapper = container.querySelector('.default-content-wrapper');
    if (!contentWrapper) return;

    // Create column
    const column = document.createElement('div');
    column.className = 'footer-column';
    
    // Move content (not clone) to preserve all elements
    while (contentWrapper.firstChild) {
      column.appendChild(contentWrapper.firstChild);
    }

    // Distribute to sections
    // Top bar: 0-4 (Questions, Coupons, Credit Card, App, Social)
    if (index <= 4) {
      footerTop.appendChild(column);
    }
    // Navigation: 5-8 (Tires, Services, Firestone, Blog)
    else if (index >= 5 && index <= 8) {
      footerNav.appendChild(column);
    }
    // Bottom: 9-10 (Logo, Legal)
    else if (index >= 9) {
      footerBottom.appendChild(column);
    }
  });

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
}
