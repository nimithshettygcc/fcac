export default function decorate(block) {
  // 1. Extract Elements
  const rows = [...block.children];

  // Top header: "PRICED RIGHT, FIXED RIGHT AND WARRANTEED"
  const topHeader = rows[0]?.textContent.trim();

  // Section 1: icon, eyebrow, text
  const section1Row = rows[1];
  const section1Cols = section1Row ? [...section1Row.children] : [];
  const section1Icon = section1Cols[0]?.querySelector('picture, img, svg');
  const section1Eyebrow = section1Cols[1]?.textContent.trim();
  const section1Text = section1Cols[2]?.querySelector('div')?.innerHTML
    || section1Cols[2]?.innerHTML || '';

  // Section 2: icon, eyebrow, text
  const section2Row = rows[2];
  const section2Cols = section2Row ? [...section2Row.children] : [];
  const section2Icon = section2Cols[0]?.querySelector('picture, img, svg');
  const section2Eyebrow = section2Cols[1]?.textContent.trim();
  const section2Text = section2Cols[2]?.querySelector('div')?.innerHTML
    || section2Cols[2]?.innerHTML || '';

  // Disclaimer text field (outside white card, above red box)
  const disclaimerContainer = rows[3]?.querySelector('div');
  const disclaimerHtml = disclaimerContainer ? disclaimerContainer.innerHTML : '';

  // Bottom header: "WHY WHEEL WORKS? HERE ARE THREE REASONS."
  const bottomHeader = rows[4]?.textContent.trim();

  // Button (link, text)
  const buttonRow = rows[5];
  const buttonCols = buttonRow ? [...buttonRow.children] : [];
  const buttonLink = buttonCols[0]?.querySelector('a')?.href;
  const buttonText = buttonCols[1]?.textContent.trim();

  // Reason items (multifield) - all remaining rows
  const reasonRows = rows.slice(6);

  // Default icons (used as fallback when no icon image is supplied)
  const defaultIcons = [
    // Tire price-tag icon
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="ww-icon-double-difference">
       <path d="M31.9,57.5C18,57.5,6.7,46.2,6.7,32.3C6.7,18.4,18,7.1,31.9,7.1s25.2,11.3,25.2,25.2C57.1,46.2,45.8,57.5,31.9,57.5z M31.9,9C19,9,8.6,19.5,8.6,32.3c0,12.8,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3C55.2,19.5,44.7,9,31.9,9z"/>
       <path d="M27,18c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S32.5,18,27,18z M27,34c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6 S30.3,34,27,34z"/>
       <circle cx="27" cy="28" r="2"/>
       <path d="M44.5,30.5l-9-9c-0.4-0.4-0.9-0.6-1.4-0.6h-1.6c1.6,1.5,2.7,3.4,3.3,5.6h-0.4l8.3,8.3l-7.5,7.5l-8.3-8.3v0.7 c0,0.5,0.2,1,0.6,1.4l9,9c0.8,0.8,2,0.8,2.8,0l4.2-4.2C45.3,40,45.3,38.7,44.5,38l-1-1l1.5-1.5C46,34.7,45.7,32.6,44.5,30.5z"/>
    </svg>`,
    // Wrench/screwdriver crossed icon
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="ww-icon-fixed-right-promise">
       <path d="M31.9,57.5C18,57.5,6.7,46.2,6.7,32.3C6.7,18.4,18,7.1,31.9,7.1s25.2,11.3,25.2,25.2C57.1,46.2,45.8,57.5,31.9,57.5z M31.9,9C19,9,8.6,19.5,8.6,32.3c0,12.8,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3C55.2,19.5,44.7,9,31.9,9z"/>
       <path d="M39.1,24.2c0.3-0.3,0.7-0.9,0.9-1.3l0.4-0.9c0.2-0.4,0.6-0.9,1-1.2l3.5-2.4l1.7,1.6l-2.5,3.6c-0.3,0.4-0.8,0.8-1.2,1 L42.2,25c-0.4,0.2-1,0.6-1.3,0.9L32.8,34L31,32.3L39.1,24.2z"/>
       <path d="M18.7,42.3l7.2-7.2c0.4-0.4,0.8-0.6,1.1-0.7c1.4-0.3,3.3,3.7,2.5,5l-6.8,6.8c-0.9,0.9-1.8,0.5-2.1,0.2l0,0l-2.1-2.1 C18.2,44.1,17.9,43.2,18.7,42.3z"/>
       <path d="M17,24.9l0.1,0.2c0.2,0.5,2.3,4.4,3.8,5c0.7,0.2,1.6,0.4,2.6,0.5c1,0.1,2.1,0.3,2.6,0.5c0.7,0.5,1,0.7,1.5,1.1l7.2,7.2 c-0.5,2-0.1,4.2,1.5,5.8c2.3,2.3,6.2,2.3,8.5,0c2.3-2.3,2.3-6.2,0-8.5c-1.6-1.6-3.9-2.1-5.9-1.5l-7.4-7.4c-1-1.3-1.3-2.9-1.6-4.3 c-0.3-1.4-0.6-2.8-1.4-3.6c-1.9-1.9-5.3-2.3-7.1-2l-0.2,0l-0.7,1.2l3.7,2.2c0.2,0.1,0.3,0.4,0.2,0.9c-0.1,0.6-0.3,1.2-0.7,1.8 c-0.2,0.4-0.5,0.8-0.8,1c-0.6,0.6-1.2,0.8-1.4,0.6l-3.7-2.2L17,24.9z M37,41.9l0.9-3.5l3.5-0.9L44,40L43,43.5l-3.5,0.9L37,41.9z"/>
    </svg>`,
  ];

  // 2. Setup
  block.textContent = '';
  const container = document.createElement('div');
  container.className = 'ww-container';

  // Top: white area with header + 2 sections
  const topSection = document.createElement('div');
  topSection.className = 'ww-top';

  if (topHeader) {
    const h2 = document.createElement('h2');
    h2.className = 'ww-top-title';
    h2.textContent = topHeader;
    topSection.append(h2);
  }

  // 2 feature sections grid
  const featuresGrid = document.createElement('div');
  featuresGrid.className = 'ww-features';

  const featureData = [
    { icon: section1Icon, eyebrow: section1Eyebrow, text: section1Text },
    { icon: section2Icon, eyebrow: section2Eyebrow, text: section2Text },
  ];

  featureData.forEach((item, index) => {
    if (!item.eyebrow && !item.text && !item.icon) return;

    const card = document.createElement('div');
    card.className = 'ww-feature-card';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'ww-icon-circle';
    if (item.icon) {
      iconWrapper.append(item.icon);
    } else {
      iconWrapper.innerHTML = defaultIcons[index] || defaultIcons[0];
    }
    card.append(iconWrapper);

    if (item.eyebrow) {
      const eyebrow = document.createElement('div');
      eyebrow.className = 'ww-feature-eyebrow';
      eyebrow.textContent = item.eyebrow;
      card.append(eyebrow);
    }

    if (item.text) {
      const textEl = document.createElement('div');
      textEl.className = 'ww-feature-text';
      textEl.innerHTML = item.text;
      card.append(textEl);
    }

    featuresGrid.append(card);
  });

  topSection.append(featuresGrid);
  container.append(topSection);

  // Disclaimer text outside the white card (above red box)
  if (disclaimerHtml && disclaimerHtml.trim()) {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'ww-disclaimer';
    disclaimer.innerHTML = disclaimerHtml;
    container.append(disclaimer);
  }

  // Bottom: red box with header + reasons + button
  const bottomBox = document.createElement('div');
  bottomBox.className = 'ww-reasons-box';

  if (bottomHeader) {
    const h2 = document.createElement('h2');
    h2.className = 'ww-reasons-title';
    h2.textContent = bottomHeader;
    bottomBox.append(h2);
  }

  // Reasons multifield
  const reasonsList = document.createElement('div');
  reasonsList.className = 'ww-reasons-list';

  reasonRows.forEach((row) => {
    if (!row) return;
    const cols = [...row.children];
    const eyebrow = cols[0]?.textContent.trim();
    const textHtml = cols[1]?.querySelector('div')?.innerHTML
      || cols[1]?.innerHTML || '';

    if (!eyebrow && !textHtml) return;

    const reason = document.createElement('div');
    reason.className = 'ww-reason';

    if (eyebrow) {
      const eyebrowEl = document.createElement('div');
      eyebrowEl.className = 'ww-reason-eyebrow';
      eyebrowEl.textContent = eyebrow;
      reason.append(eyebrowEl);
    }

    if (textHtml) {
      const textEl = document.createElement('div');
      textEl.className = 'ww-reason-text';
      textEl.innerHTML = textHtml;
      reason.append(textEl);
    }

    reasonsList.append(reason);
  });

  bottomBox.append(reasonsList);

  // Button
  if (buttonText || buttonLink) {
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'ww-button-wrapper';
    const btn = document.createElement('a');
    btn.className = 'ww-button';
    btn.href = buttonLink || '#';
    btn.textContent = buttonText || 'GET MORE REASONS WHY';
    btnWrapper.append(btn);
    bottomBox.append(btnWrapper);
  }

  container.append(bottomBox);
  block.append(container);
}
