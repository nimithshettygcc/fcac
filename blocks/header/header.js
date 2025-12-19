import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, 'false');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

const navTitleMap = {
  'tires': 'Tires',
  'find repair services': 'Auto Repair',
  'find maintenance services': 'Auto Maintenance',
  'coupons': 'Coupons',
  'find a store': 'Find A Store',
  'contact us': 'Contact Us'
};

function getMappedTitle(rawText) {
  const normalized = rawText.toLowerCase().trim();
  if (navTitleMap[normalized]) return navTitleMap[normalized];
  if (normalized.includes('tires')) return 'Tires';
  if (normalized.includes('repair')) return 'Auto Repair';
  if (normalized.includes('maintenance')) return 'Auto Maintenance';
  return rawText;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const sections = fragment ? [...fragment.children] : [];

  const flyerWrapper = document.createElement('div');
  flyerWrapper.className = 'nav-flyer';

  const primaryBar = document.createElement('div');
  primaryBar.className = 'nav-primary';
  const primaryContent = document.createElement('div');
  primaryContent.className = 'nav-primary-content';
  primaryBar.append(primaryContent);

  const brandWrapper = document.createElement('div');
  brandWrapper.className = 'nav-brand';

  const sectionsWrapper = document.createElement('div');
  sectionsWrapper.className = 'nav-sections';
  const menuList = document.createElement('ul');
  sectionsWrapper.append(menuList);

  const toolsWrapper = document.createElement('div');
  toolsWrapper.className = 'nav-tools';

  const secondaryBar = document.createElement('div');
  secondaryBar.className = 'nav-secondary';
  const secondaryContent = document.createElement('div');
  secondaryContent.className = 'nav-secondary-content';
  secondaryBar.append(secondaryContent);
  let hasSecondaryContent = false;

  const utilitySections = sections.filter(s => {
    const t = s.textContent.trim().toLowerCase();
    return t.includes('blog') || t.includes('sign in');
  });

  sections.forEach(section => {
    const rawText = section.textContent.trim();
    const textLower = rawText.toLowerCase();
    const firstLink = section.querySelector('a');
    const headings = section.querySelectorAll('h2, h3');
    const logoIcon = section.querySelector('.icon-fcac-logo-icon-global-web-bsro');

    // 1. SECONDARY BAR CHECK
    if (section.querySelector('.icon-schedule-appointment-icon-global-web-bsro')) {
      hasSecondaryContent = true;
      const paragraphs = Array.from(section.querySelectorAll('p'));
      
      paragraphs.forEach(p => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'sec-item';
        
        const iconSpan = p.querySelector('.icon');
        if(iconSpan) {
            const iconClone = iconSpan.cloneNode(true);
            
            /* ACCESSIBILITY FIX: Mark decorative icons in secondary bar */
            const img = iconClone.querySelector('img');
            if(img) img.setAttribute('alt', '');

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'sec-icon';
            iconWrapper.append(iconClone);
            itemDiv.append(iconWrapper);
        }

        const textWrapper = document.createElement('div');
        textWrapper.className = 'sec-text';

        const textContent = p.textContent.trim().toLowerCase();

        if (p.querySelector('a') && textContent.includes('schedule')) {
             itemDiv.classList.add('sec-schedule');
             const link = p.querySelector('a');
             const a = document.createElement('a');
             a.href = link.href;
             a.textContent = link.textContent;
             
             /* ACCESSIBILITY FIX: Ensure explicit label for action links */
             a.setAttribute('aria-label', 'Schedule an Appointment');
             textWrapper.append(a);
        } else {
             const nodes = Array.from(p.childNodes);
             let labelText = '';
             let valueText = '';
             
             nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    if (!labelText) labelText = node.textContent.trim();
                    else valueText = node.textContent.trim();
                }
             });

             const labelSpan = document.createElement('span');
             labelSpan.className = 'sec-label';
             labelSpan.textContent = labelText;

             const valueSpan = document.createElement('span');
             valueSpan.className = 'sec-value';
             valueSpan.textContent = valueText;
             
             textWrapper.append(labelSpan, valueSpan);
             
             if (labelText.includes('Garage')) {
                 itemDiv.classList.add('sec-garage', 'has-dropdown');
                 /* ACCESSIBILITY FIX: Add role button for interactive div */
                 itemDiv.setAttribute('role', 'button');
                 itemDiv.setAttribute('aria-label', 'My Garage');
             } else if (labelText.includes('Call')) {
                 itemDiv.classList.add('sec-contact');
             } else if (labelText.includes('Store')) {
                 itemDiv.classList.add('sec-store', 'has-dropdown');
                 /* ACCESSIBILITY FIX: Add role button */
                 itemDiv.setAttribute('role', 'button');
                 itemDiv.setAttribute('aria-label', 'My Store');
             }
        }
        
        itemDiv.append(textWrapper);
        secondaryContent.append(itemDiv);
      });
      return; 
    }

    // 2. UTILITY ICONS (Blog / Sign In)
    if (utilitySections.includes(section)) {
      const toolLink = document.createElement('a');
      toolLink.href = firstLink ? firstLink.href : '#';
      toolLink.className = 'nav-tool-item';
      
      const idx = utilitySections.indexOf(section);
      const isBlog = idx === 0; 
      
      const iconDiv = document.createElement('div');
      iconDiv.className = 'tool-icon';
      
      const existingPic = section.querySelector('picture');
      
      if (existingPic) {
          const clonedPic = existingPic.cloneNode(true);
          
          /* ACCESSIBILITY FIX: Remove redundant alt text from Blog/Sign In icons */
          const img = clonedPic.querySelector('img');
          if (img) img.setAttribute('alt', ''); // Empty alt makes it decorative
          
          iconDiv.append(clonedPic);
      } else {
          // Fallback SVGs - ensure they have no title/desc that conflicts
          if (isBlog) {
            iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2"><path d="M12 2L3 7V12C3 17 7 21 12 22C17 21 21 17 21 12V7L12 2Z"/><text x="12" y="16" font-family="Arial" font-weight="bold" font-size="12" text-anchor="middle" fill="black" stroke="none">F</text></svg>`;
          } else {
            iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke-linecap="round"/></svg>`;
          }
      }

      const label = document.createElement('span');
      label.textContent = firstLink ? firstLink.textContent.trim() : (isBlog ? 'Blog' : 'Sign In');
      
      toolLink.append(iconDiv);
      toolLink.append(label);
      toolsWrapper.append(toolLink);
      return;
    }

    // 3. FLYER Check
    if (section.querySelector('.flyer-wrapper') || (textLower.includes('black friday') && section.querySelector('picture'))) {
      const link = firstLink ? firstLink.href : '#';
      const pic = section.querySelector('picture');
      if (pic) {
        const a = document.createElement('a');
        a.href = link;
        a.append(pic);
        
        /* ACCESSIBILITY FIX: Add discernible name to image-only link */
        a.setAttribute('aria-label', 'View Black Friday Special Offers');
        
        flyerWrapper.append(a);
      }
      return;
    }

    // 4. BRAND LOGO Check
    if (logoIcon || (firstLink && firstLink.href.includes('firestonecompleteautocare.com') && rawText.length < 5)) {
      if (brandWrapper.children.length > 0) return;
      const logoLink = document.createElement('a');
      logoLink.href = 'https://www.firestonecompleteautocare.com/';
      
      /* ACCESSIBILITY FIX: Ensure Logo has label */
      logoLink.setAttribute('aria-label', 'Firestone Complete Auto Care Home');
      
      const img = document.createElement('img');
      img.src = '/icons/fcac-logo-icon-global-web-bsro.svg';
      img.alt = 'Firestone Complete Auto Care';
      img.width = 170; img.height = 30;
      logoLink.append(img);
      brandWrapper.append(logoLink);
      return;
    }

    // 5. MAIN MENU ITEMS
    let titleToMap = '';
    if (headings.length > 0) {
      titleToMap = headings[0].textContent.split('\n')[0].trim();
      if (titleToMap.startsWith('TiresShop')) titleToMap = 'Tires';
      if (titleToMap.startsWith('Shop For Tires')) titleToMap = 'Tires';
    }

    const menuTitle = getMappedTitle(titleToMap);

    if (menuTitle && titleToMap) {
      const menuItem = document.createElement('li');
      const menuLink = document.createElement('a');
      menuLink.textContent = menuTitle;
      menuLink.href = firstLink ? firstLink.href : '#';

      /* ACCESSIBILITY FIX: Differentiate identical links (Tires) */
      if (menuTitle === 'Tires') {
          menuLink.setAttribute('aria-label', 'Shop All Tires'); 
      }

      const isMega = ['Tires', 'Auto Repair', 'Auto Maintenance'].includes(menuTitle);

      if (isMega) {
        menuItem.classList.add('nav-drop');
        menuItem.setAttribute('aria-haspopup', 'true'); /* Fix: Indicate dropdown */
        menuItem.setAttribute('aria-expanded', 'false');
        
        if (isDesktop.matches) menuItem.append(menuLink);
        else {
          const span = document.createElement('span');
          span.textContent = menuTitle;
          span.className = 'nav-item-label';
          menuItem.append(span);
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'nav-dropdown-content';
        if (menuTitle === 'Auto Repair') dropdown.classList.add('auto-repair-dropdown');
        if (menuTitle === 'Auto Maintenance') dropdown.classList.add('auto-maintenance-dropdown');

        if (menuTitle === 'Tires') {
          menuItem.classList.add('tires-nav-item');
          const tiresLayout = document.createElement('div');
          tiresLayout.className = 'tires-mega-menu';

          const leftCol = document.createElement('div');
          leftCol.className = 'tires-col-left';
          const rightCol = document.createElement('div');
          rightCol.className = 'tires-col-right';

          let wrapper = section.querySelector('.sub-nav-content.tires') || section.querySelector('.default-content-wrapper') || section;
          let elements = Array.from(wrapper.children);

          let inRightCol = false;
          let currentBrandDiv = null;
          let brandsGrid = null;
          let sureDriveLinkElement = null;
          let currentBrandName = '';

          elements.forEach(el => {
            if (el.tagName === 'H3' && el.textContent.includes('Shop By Tire Brands')) {
              inRightCol = true;
              rightCol.append(el.cloneNode(true));
              brandsGrid = document.createElement('div');
              brandsGrid.className = 'brands-grid';
              rightCol.append(brandsGrid);
              return;
            }

            if (!inRightCol) {
              const clone = el.cloneNode(true);
              if (clone.tagName === 'H3' && clone.textContent.includes('Shop For Tires')) clone.textContent = 'Shop For Tires';
              if (clone.textContent.trim() !== 'Tires') leftCol.append(clone);
            } else {
              if (el.querySelector('picture')) return;

              if (el.textContent.includes('SureDrive') || el.textContent.includes('Sure Drive')) {
                const aSrc = el.querySelector('a');
                const a = document.createElement('a');
                a.href = aSrc ? aSrc.href : '#';
                a.textContent = 'Shop All SureDrive Tires';
                a.className = 'suredrive-link';
                sureDriveLinkElement = a;
                return;
              }

              if (el.tagName === 'H4') {
                currentBrandDiv = document.createElement('div');
                currentBrandDiv.className = 'brand-section';
                currentBrandDiv.append(el.cloneNode(true));
                currentBrandName = el.textContent;
                if (brandsGrid) brandsGrid.append(currentBrandDiv);
              } else if ((el.tagName === 'UL') && currentBrandDiv) {
                const ul = document.createElement('ul');
                ul.className = 'tire-model-list';

                el.querySelectorAll('li').forEach(liSource => {
                  const aSource = liSource.querySelector('a');
                  if (!aSource) return;
                  const li = document.createElement('li');
                  const a = document.createElement('a');
                  a.href = aSource.href;

                  const iconDiv = document.createElement('div');
                  iconDiv.className = 'tire-icon';
                  /* Ensure decorative icons in menu are hidden from screen readers */
                  iconDiv.setAttribute('aria-hidden', 'true');

                  if (currentBrandName.includes('Bridgestone')) {
                    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19.84px" height="18.42px" viewBox="0 0 19.84 18.42"><path d="M2.34,10.58c3.6-3.83,7.55-7.29,11.78-10.35c0.04-0.03,0.06-0.09,0.05-0.14S14.1,0,14.05,0H6.7 c-1,0.05-1.86,0.74-2.16,1.72l-2.41,8.75c-0.01,0.06,0.01,0.12,0.06,0.14S2.3,10.63,2.34,10.58z" fill="#fe0000"></path><path d="M15.27,8.49c1.87-0.33,3.76-1.11,4.43-3.93c0.73-3.05-1.53-4.72-4.12-4.55L11.6,14.39 c-0.25,0.81-0.96,1.38-1.78,1.43H8.3l2.4-8.68c0.02-0.06,0-0.12-0.05-0.15C10.6,6.95,10.54,6.96,10.5,7 c-3.78,3.42-7.28,7.17-10.46,11.2C0,18.24-0.01,18.29,0.01,18.34c0.02,0.05,0.06,0.08,0.11,0.08h10.39c4.38,0,6.78-1.4,7.65-4.76 c0.71-2.73-0.68-4.59-2.89-5.07C15.23,8.58,15.2,8.51,15.27,8.49z" fill="#000000"></path></svg>`;
                    a.append(iconDiv);
                  } else if (currentBrandName.includes('Firestone')) {
                    iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19.84px" height="18.42px" viewBox="0 0 19.84 18.42"><path d="M19.85,2.8c0,0-8.99-6.29-19.78,0c0,0-1.55,12.05,9.89,18.49C9.96,21.28,20.77,16.1,19.85,2.8z M9.97,20.15 C-0.08,14.09,1.05,3.37,1.05,3.37c9.62-5.29,17.86,0.04,17.86,0.04C19.44,15.19,9.97,20.15,9.97,20.15z" fill="#fe0000"></path><path d="M10.8,7.02c0,0-0.63,1.62-0.12,2.55c0,0,1.79-1.08,3.58-0.45l-1.08,2.7c0,0-0.87-0.63-1.73-0.09 c0,0,0.69,2.16-0.87,3.78c-1.55,1.62-3.05,1.53-3.52,1.38c0,0,0.66-1.08,0.72-2.07c0.06-0.99-0.21-1.74-0.21-1.74 s-0.48-1.02-0.54-2.55C6.97,9,7.96,7.14,8.29,6.75c0,0-1.64-0.48-4,1.08c0,0-0.42-1.86,1.19-3.63c1.61-1.77,3.97-1.17,3.97-1.17 l2.69,0.57c0,0,1.8,0.34,2.51,0.06c0.69-0.27,1.28-0.66,1.61-0.93c0,0,0.22,1.17-0.1,2.09c-0.25,0.71-0.72,1.27-1.66,1.81 C13.42,7.25,12.02,7.26,10.8,7.02" fill="#fe0000"></path></svg>`;
                    a.append(iconDiv);
                  }

                  const textDiv = document.createElement('div');
                  textDiv.className = 'tire-text';

                  let fullText = aSource.textContent.trim();
                  fullText = fullText.replace('Weather Peak', 'WeatherPeak').replace('PeakAll', 'Peak All');

                  let nameText = fullText.split(' ')[0];
                  let taglineText = fullText.substring(nameText.length).trim();

                  const nameSpan = document.createElement('span');
                  nameSpan.className = 'tire-name';
                  nameSpan.textContent = nameText;
                  textDiv.append(nameSpan);

                  if (taglineText) {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'tire-tagline';
                    tagSpan.textContent = taglineText;
                    textDiv.append(tagSpan);
                  }
                  a.append(textDiv);
                  li.append(a);
                  ul.append(li);
                });
                currentBrandDiv.append(ul);
              }
            }
          });

          if (sureDriveLinkElement && brandsGrid) {
            let targetColumn = null;
            for (let i = 0; i < brandsGrid.children.length; i++) {
              const colText = brandsGrid.children[i].textContent;
              if (colText.includes('Winterforce') || colText.includes('Firestone')) {
                targetColumn = brandsGrid.children[i];
                break;
              }
            }
            if (!targetColumn && brandsGrid.children.length > 1) {
              targetColumn = brandsGrid.children[1];
            }
            if (!targetColumn) {
              targetColumn = brandsGrid.lastElementChild;
            }
            if (targetColumn) targetColumn.append(sureDriveLinkElement);
          }

          tiresLayout.append(leftCol, rightCol);
          dropdown.append(tiresLayout);

        } else if (menuTitle === 'Auto Repair' || menuTitle === 'Auto Maintenance') {
          menuItem.classList.add(menuTitle === 'Auto Repair' ? 'auto-repair-nav-item' : 'auto-maintenance-nav-item');
          
          const layout = document.createElement('div');
          layout.className = menuTitle === 'Auto Repair' ? 'auto-repair-mega-menu' : 'auto-maintenance-mega-menu';

          const heroWrapper = document.createElement('div');
          heroWrapper.className = menuTitle === 'Auto Repair' ? 'repair-hero' : 'maintenance-hero';

          const gridWrapper = document.createElement('div');
          gridWrapper.className = menuTitle === 'Auto Repair' ? 'repair-services-grid' : 'maintenance-services-grid';
          
          const gridHeader = document.createElement('h3');
          gridHeader.textContent = menuTitle === 'Auto Repair' ? 'FIND REPAIR SERVICES' : 'FIND MAINTENANCE SERVICES';
          gridWrapper.append(gridHeader);

          const gridContainer = document.createElement('div');
          gridContainer.className = menuTitle === 'Auto Repair' ? 'services-grid-container' : 'maintenance-grid-container';
          gridWrapper.append(gridContainer);

          const ctaWrapper = document.createElement('div');
          ctaWrapper.className = menuTitle === 'Auto Repair' ? 'repair-cta' : 'maintenance-cta';

          const wrapper = section.querySelector('.default-content-wrapper') || section;
          const elements = Array.from(wrapper.children);

          elements.forEach(el => {
            const textLower = el.textContent.trim().toLowerCase();

            if (el.nodeType === Node.TEXT_NODE || (el.innerText && el.innerText.trim().startsWith(':'))) {
              return;
            }

            if (textLower.includes('schedule') || textLower.includes('save time') || el.querySelector('.button-container')) {
              const clone = el.cloneNode(true);
              clone.querySelectorAll('picture, img').forEach(img => img.remove());
              const link = clone.querySelector('a');
              if (link) {
                link.classList.add('button');
                if (clone.tagName === 'P') clone.className = 'button-container';
              }
              ctaWrapper.append(clone);
              return;
            }

            if (el.tagName === 'UL') {
              el.querySelectorAll('li').forEach(li => {
                const linkDiv = document.createElement('div');
                linkDiv.className = menuTitle === 'Auto Repair' ? 'service-item' : 'maintenance-service-item';

                const icon = li.querySelector('picture') || li.querySelector('img');
                if (icon) {
                    const clonedIcon = icon.cloneNode(true);
                    const img = clonedIcon.querySelector('img');
                    if(img) img.setAttribute('alt', ''); // Decorative icons
                    linkDiv.append(clonedIcon);
                }

                const a = li.querySelector('a');
                if (a) linkDiv.append(a.cloneNode(true));

                if (icon || a) gridContainer.append(linkDiv);
              });
            } else if (el.tagName === 'P' && el.querySelector('a')) {
              const a = el.querySelector('a').cloneNode(true);
              const linkDiv = document.createElement('div');
              linkDiv.className = menuTitle === 'Auto Repair' ? 'service-item' : 'maintenance-service-item';
              linkDiv.append(a);
              gridContainer.append(linkDiv);
            }
          });

          layout.append(heroWrapper, gridWrapper, ctaWrapper);
          dropdown.append(layout);

        } else {
          const contentClone = section.cloneNode(true);
          const cloneHeadings = contentClone.querySelectorAll('h2, h3');
          if (cloneHeadings[0] && cloneHeadings[0].textContent.includes(menuTitle)) cloneHeadings[0].remove();
          const wrapper = contentClone.querySelector('.default-content-wrapper');
          if (wrapper) dropdown.append(...wrapper.children);
          else dropdown.append(...contentClone.children);
        }

        menuItem.append(dropdown);
      } else {
        menuItem.append(menuLink);
      }
      menuList.append(menuItem);
    }
  });

  primaryContent.append(brandWrapper);
  primaryContent.append(sectionsWrapper);
  primaryContent.append(toolsWrapper);

  nav.append(flyerWrapper);
  nav.append(primaryBar);
  
  if(hasSecondaryContent) {
      nav.append(secondaryBar);
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, sectionsWrapper));
  primaryContent.prepend(hamburger);

  nav.setAttribute('aria-expanded', 'false');
  if (!isDesktop.matches) {
    menuList.querySelectorAll('.nav-drop').forEach(drop => {
      drop.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
          const expanded = drop.getAttribute('aria-expanded') === 'true';
          drop.setAttribute('aria-expanded', !expanded);
        }
      });
    });
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}