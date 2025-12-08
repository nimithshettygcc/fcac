export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 18) return;

  // --- 1. Extract Content ---
  const title = rows[0].querySelector('p');
  const desc = rows[1].querySelector('p');
  const tdgLink = rows[2].querySelector('a');
  const tdgCtaText = rows[3].querySelector('p');
  const heroPic = rows[4].querySelector('picture');
  const storeBarContainer = rows[5]; 
  
  const storeLabel = rows[6].querySelector('p');
  const storeInfo = rows[7]; 
  const storeDetailsLink = rows[8].querySelector('a');
  const storeDetailsText = rows[9].querySelector('p');
  const changeStoreLink = rows[10].querySelector('a');
  const changeStoreText = rows[11].querySelector('p');
  const schedLink = rows[12].querySelector('a');
  const schedText = rows[13].querySelector('p');
  const hoursSection = rows[14]; 
  const dirLink = rows[15].querySelector('a');
  const dirText = rows[16].querySelector('p');
  const mapPic = rows[17].querySelector('picture');

  block.textContent = '';

  // --- HERO SECTION ---
  const top = document.createElement('div');
  top.className = 'tg-top';

  const hero = document.createElement('div');
  hero.className = 'tg-hero';
  if (heroPic) hero.append(heroPic);

  const copy = document.createElement('div');
  copy.className = 'tg-copy';
  
  const titleEl = document.createElement('h2');
  titleEl.className = 'tg-title';
  titleEl.innerHTML = title ? title.innerHTML : '';
  
  const descEl = document.createElement('p');
  descEl.className = 'tg-desc';
  descEl.innerHTML = desc ? desc.innerHTML : '';
  
  const tdgCta = document.createElement('a');
  tdgCta.className = 'tg-primary-cta';
  if (tdgLink) tdgCta.href = tdgLink.href;
  tdgCta.textContent = tdgCtaText ? tdgCtaText.textContent : 'Shop All Tires';

  copy.append(titleEl, descEl, tdgCta);
  top.append(hero, copy);

  // --- STORE BAR ---
  const storeWrapper = document.createElement('div');
  storeWrapper.className = 'tg-store-wrapper';
  
  const iconSpan = storeBarContainer.querySelector('.icon');
  const originalLink = storeBarContainer.querySelector('a') || storeBarContainer.querySelector('p');
  
  const storeBarContent = document.createElement('div');
  storeBarContent.className = 'tg-store-bar-content';

  const locIconWrapper = document.createElement('span');
  locIconWrapper.className = 'icon-location-wrapper';
  if (iconSpan) locIconWrapper.append(iconSpan);
  else locIconWrapper.innerHTML = '📍';

  const storeBarBtn = document.createElement('div');
  storeBarBtn.className = 'tg-store-bar';
  
  const stateInfo = document.createElement('span');
  stateInfo.className = 'tg-bar-state-info';
  stateInfo.innerHTML = originalLink ? originalLink.innerHTML : 'Select Store';

  const stateClose = document.createElement('span');
  stateClose.className = 'tg-bar-state-close';
  stateClose.innerHTML = 'CLOSE'; 

  storeBarBtn.append(stateInfo, stateClose);

  const arrowIcon = document.createElement('span');
  arrowIcon.className = 'tg-arrow-icon';
  arrowIcon.innerHTML = '▲'; 

  storeBarContent.append(locIconWrapper, storeBarBtn, arrowIcon);
  storeWrapper.append(storeBarContent);

  // --- EXPANDED PANEL ---
  const panel = document.createElement('div');
  panel.className = 'tg-store-panel';
  panel.setAttribute('aria-hidden', 'true'); 

  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'tg-store-info';

  // -- Column 1: Contact --
  const colLeft = document.createElement('div');
  colLeft.className = 'tg-col-contact';

  if (storeLabel) {
      const lbl = document.createElement('p');
      lbl.className = 'tg-store-label';
      lbl.innerHTML = storeLabel.innerHTML;
      colLeft.append(lbl);
  }

  // PHONE
  const phone = document.createElement('h2');
  phone.className = 'tg-store-phone';
  const phoneSrc = storeInfo ? storeInfo.querySelector('h2, strong, h3') : null;
  if (phoneSrc) {
    phone.innerHTML = phoneSrc.innerHTML;
  } else if (storeInfo) {
     const allText = storeInfo.textContent;
     const phoneMatch = allText.match(/(\d{3}[.-]\d{3}[.-]\d{4})/);
     if(phoneMatch) phone.textContent = phoneMatch[0];
  }
  colLeft.append(phone);

  // ADDRESS
  const addrBlock = document.createElement('div');
  addrBlock.className = 'tg-address-block';
  
  if (storeInfo) {
      let ps = [...storeInfo.querySelectorAll('p')].filter(p => {
         return p !== phoneSrc && (!phoneSrc || !p.contains(phoneSrc)); 
      });

      if (ps.length >= 2) {
          const lastIndex = ps.length - 1;
          const lastP = ps[lastIndex];
          const secondLastP = ps[lastIndex - 1];
          if (lastP.textContent.length < 20) {
              secondLastP.innerHTML += ` ${lastP.innerHTML}`;
              ps.pop();
          }
      }

      ps.forEach(p => {
          const line = document.createElement('div'); 
          line.className = 'tg-addr-line';
          line.textContent = p.textContent; 
          addrBlock.append(line);
      });
  }
  colLeft.append(addrBlock);

  // LINKS
  const linksRow = document.createElement('div');
  linksRow.className = 'tg-store-links';
  const detLink = document.createElement('a');
  detLink.textContent = storeDetailsText ? storeDetailsText.textContent : 'Store Details';
  detLink.href = storeDetailsLink ? storeDetailsLink.href : '#';
  const chgLink = document.createElement('a');
  chgLink.textContent = changeStoreText ? changeStoreText.textContent : 'Change Store';
  chgLink.href = changeStoreLink ? changeStoreLink.href : '#';
  linksRow.append(detLink, chgLink);
  colLeft.append(linksRow);

  // CTA
  const schedBtn = document.createElement('a');
  schedBtn.className = 'tg-secondary-cta';
  schedBtn.textContent = schedText ? schedText.textContent : 'Schedule Appointment';
  schedBtn.href = schedLink ? schedLink.href : '#';
  colLeft.append(schedBtn);

  // -- Column 2: Hours (FIXED "MON-FRI" BREAKING) --
  const colRight = document.createElement('div');
  colRight.className = 'tg-col-hours';

  const hoursDiv = document.createElement('div');
  hoursDiv.className = 'tg-hours-wrapper';
  
  if (hoursSection) {
      const hTitle = hoursSection.querySelector('h2, h3, strong');
      if(hTitle) {
          const t = document.createElement('h4');
          t.className = 'tg-hours-title';
          t.textContent = hTitle.textContent;
          hoursDiv.append(t);
      }

      const hTextP = hoursSection.querySelector('p:last-of-type'); 
      if (hTextP) {
          const ul = document.createElement('ul');
          ul.className = 'tg-hours-list';
          
          let rawText = hTextP.textContent.trim();
          
          // --- PROTECT MON-FRI RANGES ---
          // Temporarily replace "MON-FRI" with a placeholder "WEEKDAY_RANGE"
          // so the splitter doesn't see "FRI" and split it.
          rawText = rawText.replace(/MON-FRI/gi, 'WEEKDAY_RANGE');

          // Split logic: Look for Day names or Holidays (or our placeholder)
          const splitRegex = /(WEEKDAY_RANGE|MON|TUE|WED|THU|FRI|SAT|SUN|Christmas)/gi;
          const preparedText = rawText.replace(splitRegex, '|$1');
          
          const splitLines = preparedText.split('|');

          splitLines.forEach(line => {
              // Restore the text: Replace placeholder back to "MON-FRI"
              let cleanLine = line.replace(/WEEKDAY_RANGE/g, 'MON-FRI').trim();
              
              if(cleanLine.length > 2) { 
                  const li = document.createElement('li');
                  
                  // Holiday styling check
                  if (cleanLine.toLowerCase().includes('christmas') || 
                      cleanLine.toLowerCase().includes('closed') ||
                      cleanLine.toLowerCase().includes('holiday')) {
                      li.className = 'tg-hour-row tg-holiday';
                  } else {
                      li.className = 'tg-hour-row';
                  }

                  // Split Day vs Time at first colon
                  const parts = cleanLine.split(/:(.+)/); 
                  
                  if (parts.length > 1) {
                      const daySpan = document.createElement('span');
                      daySpan.className = 'tg-day';
                      daySpan.textContent = parts[0] + ':'; // "MON-FRI:"

                      const timeSpan = document.createElement('span');
                      timeSpan.className = 'tg-time';
                      timeSpan.textContent = parts[1].trim(); // "7:00am-7:00pm"

                      li.append(daySpan, timeSpan);
                  } else {
                      li.textContent = cleanLine;
                  }

                  ul.append(li);
              }
          });
          hoursDiv.append(ul);
      }
  }
  colRight.append(hoursDiv);

  // Directions
  const dirBtn = document.createElement('a');
  dirBtn.className = 'tg-directions';
  dirBtn.innerHTML = `<span>${dirText ? dirText.textContent : 'Get Directions'}</span>`;
  dirBtn.href = dirLink ? dirLink.href : '#';
  colRight.append(dirBtn);

  infoWrapper.append(colLeft, colRight);

  const map = document.createElement('div');
  map.className = 'tg-store-map';
  if (mapPic) map.append(mapPic);

  panel.append(infoWrapper, map);
  block.append(top, storeWrapper, panel);

  storeBarContent.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = block.classList.toggle('tg-store-open');
    panel.setAttribute('aria-hidden', !isOpen);
  });
}