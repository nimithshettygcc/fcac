import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const sections = [...block.children];
  if (sections.length === 0) return;

  // Create main footer structure
  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const footerNav = document.createElement('div');
  footerNav.className = 'footer-nav';

  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  // Process sections
  sections.forEach((section, index) => {
    const content = section.querySelector('.default-content-wrapper');
    if (!content) return;

    const column = document.createElement('div');
    column.className = 'footer-column';
    moveInstrumentation(section, column);

    // Clone the content
    const contentClone = content.cloneNode(true);
    column.appendChild(contentClone);

    // Top bar sections (0-4): Questions, Coupons, Credit Card, App, Social
    if (index <= 4) {
      footerTop.appendChild(column);
    }
    // Navigation sections (5-8): Tires, Services, Firestone, Blog
    else if (index >= 5 && index <= 8) {
      footerNav.appendChild(column);
    }
    // Bottom sections (9-10): Logo and Legal links
    else if (index >= 9) {
      footerBottom.appendChild(column);
    }
  });

  // Clear and rebuild
  block.textContent = '';
  block.appendChild(footerTop);
  block.appendChild(footerNav);
  block.appendChild(footerBottom);

  // Add copyright text if not present
  const copyright = document.createElement('div');
  copyright.className = 'footer-copyright';
  copyright.textContent = '© 2025 Firestone Complete Auto Care. All Rights Reserved.';
  footerBottom.appendChild(copyright);
}
