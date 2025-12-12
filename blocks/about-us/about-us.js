export default function decorate(block) {
  // 1. Extract Elements
  const rows = [...block.children];

  const logoPic = rows[0]?.querySelector('picture');
  const mainHeadline = rows[1]?.textContent.trim();

  const quoteDiv = rows[2]?.querySelector('div');
  const quoteText = quoteDiv?.querySelector('p:first-child')?.textContent.trim();
  const quoteAuthor = quoteDiv?.querySelector('p:last-child')?.textContent.trim();

  const bottomHeadline = rows[3]?.textContent.trim();
  const bottomBodyContainer = rows[4]?.querySelector('div');
  const bottomParagraphs = bottomBodyContainer ? bottomBodyContainer.innerHTML : '';

  const featureRows = [rows[5], rows[6], rows[7]];

  // ICONS HTML
  const iconsHtml = [
    // 1. Technician SVG
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="icon-technicians">
       <path d="M31.9,57.5C18,57.5,6.7,46.2,6.7,32.3C6.7,18.4,18,7.1,31.9,7.1s25.2,11.3,25.2,25.2C57.1,46.2,45.8,57.5,31.9,57.5z M31.9,9C19,9,8.6,19.5,8.6,32.3c0,12.8,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3C55.2,19.5,44.7,9,31.9,9z"></path>
       <circle cx="27.3" cy="36.2" r="1.9"></circle>
       <path d="M36.4,34.3c-1,0-1.9,0.8-1.9,1.9c0,1,0.9,1.9,1.9,1.9c1,0,1.9-0.9,1.9-1.9C38.3,35.1,37.5,34.3,36.4,34.3z"></path>
       <path d="M31.8,41.1c-1.5,0-2.7,0-2.7,1c0,1,1.2,1.9,2.7,1.9c1.5,0,2.7-0.8,2.7-1.9C34.5,41.1,33.3,41.1,31.8,41.1z"></path>
       <path d="M43.6,26.8c-0.4-2.6-1.4-7.2-3.9-9.1c-1.3-1-3.4-1.9-5.8-2.2c0,0,0,0,0,0c0-0.6-0.9-1-2.1-1c-1.1,0-2.1,0.4-2.1,1 c0,0,0,0,0,0c-2.5,0.3-4.6,1.2-5.8,2.2c-2.5,2-3.5,6.5-3.9,9.1c-1,1.4-1.5,3.2-1.5,5.2c0,2.4,0.8,4.9,2.2,7.1c1,4.1,3.5,7.4,6.7,9 c0.5,1.2,1.6,2.3,4.4,2.3c2.8,0,4-1.1,4.4-2.3c3.2-1.6,5.7-4.9,6.7-9c1.3-2.2,2.1-4.7,2.1-7.1C45.1,29.9,44.6,28.2,43.6,26.8z M27.6,22c0.8,0,1.5,0.4,1.8,1.1l3.8,0c0.5-0.1,1-0.4,1.4-0.7c0.4-0.3,0.8-0.5,1.2-0.5c0.9,0,1.8,0.7,2.2,1.3l0,0L38,23.6 l-1.4-0.4c-0.1,0-0.2,0-0.3,0.2c-0.1,0.1-0.2,0.4-0.3,0.6c0,0.2-0.1,0.3-0.1,0.5c0,0.3,0.1,0.5,0.2,0.5l1.4,0.4l-0.1,0.5l-0.1,0 c-0.2,0.1-1.7,0.5-2.1,0.3c-0.2-0.1-0.5-0.3-0.8-0.5c-0.3-0.2-0.6-0.5-0.8-0.5c-0.3-0.1-0.4-0.1-0.6-0.1h-3.7c-0.4,0.6-1,1-1.8,1 c-1.1,0-2.1-0.9-2.1-2.1C25.5,22.9,26.5,22,27.6,22z M35.6,46.2c-2.3,0.7-2.6-0.6-3.7-0.6c-1.2,0-1.4,1.3-3.7,0.6 c-3.5-1.8-5.9-6-5.9-10.9c0-1.5,0.2-2.9,0.7-4.3l0.9,0.9c0.3,0.2,0.8,0.4,1.2,0.3l6-0.6c0.4,0,1,0,1.4,0l6,0.6 c0.4,0.1,0.9-0.1,1.2-0.3l1.1-1.2c0.5,1.4,0.7,2.9,0.7,4.5C41.5,40.2,39.1,44.4,35.6,46.2z"></path>
       <polygon points="28.2,25.1 28.9,24 28.2,23 27,23 26.4,24 27,25.1"></polygon>
    </svg>`,
    // 2. Promise SVG
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="icon-fixed-right-promise">
       <path d="M31.9,57.5C18,57.5,6.7,46.2,6.7,32.3C6.7,18.4,18,7.1,31.9,7.1s25.2,11.3,25.2,25.2C57.1,46.2,45.8,57.5,31.9,57.5z M31.9,9C19,9,8.6,19.5,8.6,32.3c0,12.8,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3C55.2,19.5,44.7,9,31.9,9z"></path>
       <path d="M39.1,24.2c0.3-0.3,0.7-0.9,0.9-1.3l0.4-0.9c0.2-0.4,0.6-0.9,1-1.2l3.5-2.4l1.7,1.6l-2.5,3.6c-0.3,0.4-0.8,0.8-1.2,1 L42.2,25c-0.4,0.2-1,0.6-1.3,0.9L32.8,34L31,32.3L39.1,24.2z"></path>
       <path d="M18.7,42.3l7.2-7.2c0.4-0.4,0.8-0.6,1.1-0.7c1.4-0.3,3.3,3.7,2.5,5l-6.8,6.8c-0.9,0.9-1.8,0.5-2.1,0.2l0,0l-2.1-2.1 C18.2,44.1,17.9,43.2,18.7,42.3z"></path>
       <path d="M17,24.9l0.1,0.2c0.2,0.5,2.3,4.4,3.8,5c0.7,0.2,1.6,0.4,2.6,0.5c1,0.1,2.1,0.3,2.6,0.5c0.7,0.5,1,0.7,1.5,1.1l7.2,7.2 c-0.5,2-0.1,4.2,1.5,5.8c2.3,2.3,6.2,2.3,8.5,0c2.3-2.3,2.3-6.2,0-8.5c-1.6-1.6-3.9-2.1-5.9-1.5l-7.4-7.4c-1-1.3-1.3-2.9-1.6-4.3 c-0.3-1.4-0.6-2.8-1.4-3.6c-1.9-1.9-5.3-2.3-7.1-2l-0.2,0l-0.7,1.2l3.7,2.2c0.2,0.1,0.3,0.4,0.2,0.9c-0.1,0.6-0.3,1.2-0.7,1.8 c-0.2,0.4-0.5,0.8-0.8,1c-0.6,0.6-1.2,0.8-1.4,0.6l-3.7-2.2L17,24.9z M37,41.9l0.9-3.5l3.5-0.9L44,40L43,43.5l-3.5,0.9L37,41.9z"></path>
    </svg>`,
    // 3. Locations SVG
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="icon-locations">
       <path d="M31.9,57.5C18,57.5,6.7,46.2,6.7,32.3C6.7,18.4,18,7.1,31.9,7.1s25.2,11.3,25.2,25.2C57.1,46.2,45.8,57.5,31.9,57.5z M31.9,9C19,9,8.6,19.5,8.6,32.3c0,12.8,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3C55.2,19.5,44.7,9,31.9,9z"></path>
       <path d="M31.3,14.4c0.3,0,0.6,0,0.9,0c0,0,0.1,0,0.1,0c0.3,0,0.6,0,0.9,0.1c0.7,0.1,1.3,0.3,2,0.5c1.3,0.5,2.4,1.2,3.5,2.1 c1.1,1,1.9,2.3,2.5,3.7c0.4,1,0.6,2,0.6,3.1c0,0,0,0.1,0,0.1c0,0.2,0,0.5,0,0.7c0,0,0,0.1,0,0.1c0,0.3,0,0.5-0.1,0.8 c-0.1,0.6-0.2,1.2-0.4,1.9c-0.3,1.1-0.7,2.2-1,3.3c-0.6,1.8-1.3,3.6-2.1,5.4c-1.3,3.1-2.7,6.2-4.1,9.3c-0.7,1.6-1.5,3.1-2.2,4.7 c0,0,0,0.1-0.1,0.1c0,0,0-0.1-0.1-0.1c-1.2-2.4-2.3-4.8-3.4-7.3c-1.1-2.3-2.1-4.6-3-7c-0.8-1.8-1.5-3.7-2.1-5.6 c-0.4-1.3-0.8-2.5-1.1-3.8c-0.1-0.5-0.2-1.1-0.3-1.6c0-0.1,0-0.1,0-0.2c0-0.2,0-0.5,0-0.7c0,0,0-0.1,0-0.1c0-0.2,0-0.4,0.1-0.6 c0.1-0.6,0.2-1.2,0.4-1.8c0.6-2,1.8-3.6,3.4-4.9c1.7-1.3,3.6-2,5.7-2.1C31.3,14.4,31.3,14.4,31.3,14.4z M31.8,28.9 c2.5,0,4.5-2,4.5-4.5c0-2.4-2-4.5-4.4-4.5c-2.5,0-4.5,2-4.5,4.5C27.3,26.8,29.2,28.9,31.8,28.9z"></path>
    </svg>`
  ];

  // 2. Setup
  block.textContent = '';
  const container = document.createElement('div');
  container.className = 'au-container';
  const whiteCard = document.createElement('div');
  whiteCard.className = 'au-white-card';

  // Header
  const headerSection = document.createElement('div');
  headerSection.className = 'au-header';
  if (logoPic) {
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'au-logo';
    logoWrapper.append(logoPic);
    headerSection.append(logoWrapper);
  }
  if (mainHeadline) {
    const title = document.createElement('h2');
    title.className = 'au-title';
    title.textContent = mainHeadline;
    headerSection.append(title);
  }
  whiteCard.append(headerSection);

  // Features
  const featuresGrid = document.createElement('div');
  featuresGrid.className = 'au-features';

  featureRows.forEach((row, index) => {
    if (!row) return;
    const cols = row.querySelectorAll('div');
    const fTitle = cols[1]?.textContent.trim();
    const fDesc = cols[2]?.textContent.trim();
    const fLink = cols[3]?.querySelector('a')?.href;
    const fCtaText = cols[4]?.textContent.trim();

    const card = document.createElement('div');
    card.className = 'au-feature-card';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'au-icon-circle';
    iconWrapper.innerHTML = iconsHtml[index] || iconsHtml[0];

    const h3 = document.createElement('h3');
    h3.textContent = fTitle;

    const p = document.createElement('p');
    p.textContent = fDesc;

    const cta = document.createElement('a');
    cta.href = fLink || '#';
    cta.className = 'au-cta';
    // Use innerHTML to create the span for the red arrow
    const label = fCtaText ? fCtaText : 'LEARN MORE';
    cta.innerHTML = `${label} <span class="au-cta-arrow">&gt;</span>`;

    card.append(iconWrapper, h3, p, cta);
    featuresGrid.append(card);
  });
  whiteCard.append(featuresGrid);
  container.append(whiteCard);

  // Quote Box
  if (quoteText) {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'au-quote-wrapper';
    const quoteBox = document.createElement('div');
    quoteBox.className = 'au-quote-box';
    const qText = document.createElement('p');
    qText.className = 'au-quote-text';
    qText.textContent = quoteText;
    const qAuthor = document.createElement('p');
    qAuthor.className = 'au-quote-author';
    qAuthor.textContent = quoteAuthor;
    quoteBox.append(qText, qAuthor);
    quoteWrapper.append(quoteBox);
    container.append(quoteWrapper);
  }

  // Bottom Content
  const bottomSection = document.createElement('div');
  bottomSection.className = 'au-bottom';
  if (bottomHeadline) {
    const h2 = document.createElement('h2');
    h2.className = 'au-bottom-title';
    h2.textContent = bottomHeadline;
    bottomSection.append(h2);
  }
  if (bottomParagraphs) {
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'au-bottom-body';
    bodyDiv.innerHTML = bottomParagraphs;
    bottomSection.append(bodyDiv);
  }
  container.append(bottomSection);
  block.append(container);
}