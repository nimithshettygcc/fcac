export default function decorate(block) {
  // 1. Extract Elements (one row per field; image+alt collapse to one row)
  const rows = [...block.children];

  // row 0: header
  const topHeader = rows[0]?.textContent.trim();

  // row 1: section1Icon (+alt)
  const section1Icon = rows[1]?.querySelector('picture, img, svg');
  // row 2: section1Eyebrow
  const section1Eyebrow = rows[2]?.textContent.trim();
  // row 3: section1Text
  const section1Text = rows[3]?.querySelector('div')?.innerHTML
    || rows[3]?.innerHTML || '';

  // row 4: section2Icon (+alt)
  const section2Icon = rows[4]?.querySelector('picture, img, svg');
  // row 5: section2Eyebrow
  const section2Eyebrow = rows[5]?.textContent.trim();
  // row 6: section2Text
  const section2Text = rows[6]?.querySelector('div')?.innerHTML
    || rows[6]?.innerHTML || '';

  // row 7: disclaimer
  const disclaimerHtml = rows[7]?.querySelector('div')?.innerHTML
    || rows[7]?.innerHTML || '';

  // row 8: reasonsHeader
  const bottomHeader = rows[8]?.textContent.trim();

  // rows 9-14: reason1Header, reason1Text, reason2Header, reason2Text, reason3Header, reason3Text
  const reasons = [
    {
      eyebrow: rows[9]?.textContent.trim(),
      text: rows[10]?.querySelector('div')?.innerHTML || rows[10]?.innerHTML || '',
    },
    {
      eyebrow: rows[11]?.textContent.trim(),
      text: rows[12]?.querySelector('div')?.innerHTML || rows[12]?.innerHTML || '',
    },
    {
      eyebrow: rows[13]?.textContent.trim(),
      text: rows[14]?.querySelector('div')?.innerHTML || rows[14]?.innerHTML || '',
    },
  ];

  // row 15: buttonLink (aem-content)
  const buttonLink = rows[15]?.querySelector('a')?.href;
  // row 16: buttonText
  const buttonText = rows[16]?.textContent.trim();

  // Default icons (fallback)
  const defaultIcons = [
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="ww-icon-double-difference">
       <path d="M31.9,57.5C18,57.5,6.7,46.2,6.7,32.3C6.7,18.4,18,7.1,31.9,7.1s25.2,11.3,25.2,25.2C57.1,46.2,45.8,57.5,31.9,57.5z M31.9,9C19,9,8.6,19.5,8.6,32.3c0,12.8,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3C55.2,19.5,44.7,9,31.9,9z"/>
       <path d="M27,18c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S32.5,18,27,18z M27,34c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6 S30.3,34,27,34z"/>
       <circle cx="27" cy="28" r="2"/>
       <path d="M44.5,30.5l-9-9c-0.4-0.4-0.9-0.6-1.4-0.6h-1.6c1.6,1.5,2.7,3.4,3.3,5.6h-0.4l8.3,8.3l-7.5,7.5l-8.3-8.3v0.7 c0,0.5,0.2,1,0.6,1.4l9,9c0.8,0.8,2,0.8,2.8,0l4.2-4.2C45.3,40,45.3,38.7,44.5,38l-1-1l1.5-1.5C46,34.7,45.7,32.6,44.5,30.5z"/>
    </svg>`,
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

  // Disclaimer text outside the constrained container
  const disclaimer = disclaimerHtml && disclaimerHtml.trim()
    ? (() => {
      const d = document.createElement('div');
      d.className = 'ww-disclaimer';
      d.innerHTML = disclaimerHtml;
      return d;
    })()
    : null;

  // Bottom: red box with header + reasons + button
  const bottomBox = document.createElement('div');
  bottomBox.className = 'ww-reasons-box';

  if (bottomHeader) {
    const h2 = document.createElement('h2');
    h2.className = 'ww-reasons-title';
    h2.textContent = bottomHeader;
    bottomBox.append(h2);
  }

  const reasonsList = document.createElement('div');
  reasonsList.className = 'ww-reasons-list';

  reasons.forEach((reason) => {
    if (!reason.eyebrow && !reason.text) return;

    const reasonEl = document.createElement('div');
    reasonEl.className = 'ww-reason';

    if (reason.eyebrow) {
      const eyebrowEl = document.createElement('div');
      eyebrowEl.className = 'ww-reason-eyebrow';
      eyebrowEl.textContent = reason.eyebrow;
      reasonEl.append(eyebrowEl);
    }

    if (reason.text) {
      const textEl = document.createElement('div');
      textEl.className = 'ww-reason-text';
      textEl.innerHTML = reason.text;
      reasonEl.append(textEl);
    }

    reasonsList.append(reasonEl);
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

  if (disclaimer) container.append(disclaimer);
  container.append(bottomBox);
  block.append(container);
}
