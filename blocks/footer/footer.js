import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Load footer fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Put fragment content into block temporarily
  block.textContent = '';
  const tempWrapper = document.createElement('div');
  while (fragment.firstElementChild) {
    tempWrapper.append(fragment.firstElementChild);
  }
  block.append(tempWrapper);

  // Get the wrapper
  const wrapper = block.children[0];
  if (!wrapper) return;
  
  const sectionContainers = [...wrapper.children];
  if (sectionContainers.length === 0) return;

  // Create footer structure
  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const footerNav = document.createElement('div');
  footerNav.className = 'footer-nav';

  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  // Social media icon names mapping
  const socialMediaNames = ['Facebook', 'Twitter', 'Instagram', 'TikTok'];

  // Variable to store copyright text from DOM
  let copyrightText = '© 2025 Firestone Complete Auto Care. All Rights Reserved.';

  // Process each section
  sectionContainers.forEach((container, index) => {
    const contentWrapper = container.querySelector('.default-content-wrapper');
    if (!contentWrapper) return;

    const column = document.createElement('div');
    column.className = 'footer-column';
    
    // Special handling for Get Coupons section (index 1)
    if (index === 1) {
      column.classList.add('footer-column-coupons');
      
      // Create heading
      const heading = document.createElement('p');
      heading.textContent = 'GET COUPONS';
      column.appendChild(heading);
      
      // Create email form
      const form = document.createElement('form');
      form.className = 'coupon-form';
      
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'email-input-wrapper';
      
      const input = document.createElement('input');
      input.type = 'email';
      input.placeholder = 'Enter Email';
      input.className = 'email-input';
      input.setAttribute('aria-label', 'Enter Your Email');
      
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'email-submit-btn';
      button.innerHTML = '&gt;';
      button.setAttribute('aria-label', 'Submit Email');
      
      inputWrapper.appendChild(input);
      inputWrapper.appendChild(button);
      form.appendChild(inputWrapper);
      column.appendChild(form);
    }
    // Special handling for Credit Card section (index 2)
    else if (index === 2) {
      column.classList.add('footer-column-credit');
      
      const picture = contentWrapper.querySelector('picture');
      const allLinks = contentWrapper.querySelectorAll('a');
      
      // Create heading FIRST (outside of horizontal layout)
      const heading = document.createElement('p');
      heading.textContent = 'FIRESTONE CREDIT CARD';
      column.appendChild(heading);
      
      // Create wrapper for horizontal content (image + links)
      const contentDiv = document.createElement('div');
      contentDiv.className = 'footer-column-credit-content';
      
      if (picture) {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'footer-img-left';
        const clonedPicture = picture.cloneNode(true);
        const img = clonedPicture.querySelector('img');
        if (img && !img.alt) {
          img.alt = 'Firestone Credit Card';
        }
        imgWrapper.appendChild(clonedPicture);
        contentDiv.appendChild(imgWrapper);
      }
      
      const textWrapper = document.createElement('div');
      textWrapper.className = 'footer-text-right';
      
      // Add all links
      allLinks.forEach(link => {
        const linkPara = document.createElement('p');
        linkPara.appendChild(link.cloneNode(true));
        textWrapper.appendChild(linkPara);
      });
      
      contentDiv.appendChild(textWrapper);
      column.appendChild(contentDiv);
    }
    // Special handling for App section (index 3)
    else if (index === 3) {
      column.classList.add('footer-column-app');
      
      const picture = contentWrapper.querySelector('picture');
      const allParagraphs = contentWrapper.querySelectorAll('p');
      
      // Create heading FIRST (outside of horizontal layout)
      const heading = document.createElement('p');
      heading.textContent = 'MY FIRESTONE APP';
      column.appendChild(heading);
      
      // Create wrapper for horizontal content (image + text)
      const contentDiv = document.createElement('div');
      contentDiv.className = 'footer-column-app-content';
      
      // Image on LEFT
      if (picture) {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'footer-img-left';
        const clonedPicture = picture.cloneNode(true);
        const img = clonedPicture.querySelector('img');
        if (img && !img.alt) {
          img.alt = 'My Firestone App';
        }
        imgWrapper.appendChild(clonedPicture);
        contentDiv.appendChild(imgWrapper);
      }
      
      // Text on RIGHT
      const textWrapper = document.createElement('div');
      textWrapper.className = 'footer-text-right';
      
      // Add only text paragraphs (skip heading and paragraphs with pictures)
      allParagraphs.forEach((para, idx) => {
        if (idx > 0 && !para.querySelector('picture')) {
          textWrapper.appendChild(para.cloneNode(true));
        }
      });
      
      contentDiv.appendChild(textWrapper);
      column.appendChild(contentDiv);
    }
    // Special handling for Social Media section (index 4)
    else if (index === 4) {
      column.classList.add('footer-column-social');
      
      // Create heading
      const heading = document.createElement('p');
      heading.textContent = 'SOCIAL MEDIA';
      column.appendChild(heading);
      
      // Create wrapper for icons
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'social-icons-wrapper';
      
      // Get all links (social icons)
      const allLinks = contentWrapper.querySelectorAll('a');
      allLinks.forEach((link, linkIndex) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'social-icon-item';
        
        const iconLink = link.cloneNode(true);
        iconLink.classList.add('icon');
        
        // Add alt text to the image
        const img = iconLink.querySelector('img');
        if (img) {
          const altText = socialMediaNames[linkIndex] || `Social Media ${linkIndex + 1}`;
          img.alt = altText;
          iconLink.setAttribute('aria-label', `Visit us on ${altText}`);
        }
        
        iconDiv.appendChild(iconLink);
        iconWrapper.appendChild(iconDiv);
      });
      
      column.appendChild(iconWrapper);
    }
    // Special handling for footer-bottom sections - Remove pictures/logos and extract copyright
    else if (index >= 9) {
      // Check if this section contains copyright text (usually the last section)
      const allParagraphs = contentWrapper.querySelectorAll('p');
      allParagraphs.forEach(para => {
        const text = para.textContent.trim();
        // Look for copyright symbol or "All Rights Reserved"
        if (text.includes('©') || text.toLowerCase().includes('all rights reserved')) {
          copyrightText = text;
          para.remove(); // Remove from content so it doesn't appear in links section
        }
      });
      
      // Remove all picture elements from footer-bottom
      const pictures = contentWrapper.querySelectorAll('picture');
      pictures.forEach(pic => pic.remove());
      
      // Add remaining content (links)
      while (contentWrapper.firstChild) {
        column.appendChild(contentWrapper.firstChild);
      }
    }
    // Default handling for other sections
    else {
      while (contentWrapper.firstChild) {
        column.appendChild(contentWrapper.firstChild);
      }
    }

    // Distribute to sections
    if (index <= 4) {
      footerTop.appendChild(column);
    } else if (index >= 5 && index <= 8) {
      footerNav.appendChild(column);
    } else if (index >= 9) {
      footerBottom.appendChild(column);
    }
  });

  // Add Firestone logo to footer-nav (bottom right) - Clickable
  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.firestonecompleteautocare.com/';
  logoLink.className = 'footer-nav-logo';
  logoLink.setAttribute('aria-label', 'Visit Firestone Complete Auto Care');
  logoLink.setAttribute('target', '_blank');
  logoLink.setAttribute('rel', 'noopener noreferrer');
  
  const logoImg = document.createElement('img');
  logoImg.src = '/media_1a35b41be6f4d749dc2fc70e26fe1abb0bede6a22.svg?width=2000&format=webply&optimize=medium';
  logoImg.alt = 'Firestone Logo';
  logoImg.loading = 'lazy';
  
  logoLink.appendChild(logoImg);
  footerNav.appendChild(logoLink);

  // Clear and rebuild
  block.innerHTML = '';
  
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  
  footer.appendChild(footerTop);
  footer.appendChild(footerNav);
  footer.appendChild(footerBottom);

  // Add copyright with text from DOM
  const copyright = document.createElement('div');
  copyright.className = 'footer-copyright';
  copyright.textContent = copyrightText;
  footerBottom.appendChild(copyright);
  
  block.appendChild(footer);
}
