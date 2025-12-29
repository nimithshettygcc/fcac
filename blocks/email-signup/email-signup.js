export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: Image
  const picture = rows[0]?.querySelector('picture');

  // Row 1: Headline Text
  let headlineText = rows[1]?.textContent.trim();
  
  // FIX: Force specific line break between "EXCLUSIVE" and "OFFERS"
  if (headlineText) {
    // Case-insensitive replace to insert the break
    headlineText = headlineText.replace(/EXCLUSIVE\s+OFFERS/i, 'EXCLUSIVE<br>OFFERS');
  }

  const inputPlaceholder = 'Enter Your Email';
  
  // Row 3: Button Text
  const buttonText = rows[3]?.textContent.trim() || "LET'S GO";
  
  // Row 4: Privacy Policy
  const privacyContent = rows[4]?.querySelector('div')?.innerHTML;

  // Clear existing block content
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'es-container';

  // --- Left Column: Image ---
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'es-image-wrapper';
  if (picture) {
    imageWrapper.append(picture);
  }
  container.append(imageWrapper);

  // --- Right Column: Content ---
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'es-content-wrapper';

  // Headline
  if (headlineText) {
    const title = document.createElement('h2');
    title.className = 'es-title';
    // Render HTML to allow the <br> tag to work
    title.innerHTML = headlineText; 
    contentWrapper.append(title);
  }

  // Input Form Wrapper
  const formRow = document.createElement('div');
  formRow.className = 'es-form-row';

  // Input Field
  const input = document.createElement('input');
  input.type = 'email';
  input.className = 'es-input';
  input.placeholder = inputPlaceholder;
  input.setAttribute('aria-label', 'Email Address');

  // Submit Button
  const btn = document.createElement('button');
  btn.className = 'es-btn';
  btn.textContent = buttonText;

  formRow.append(input, btn);
  contentWrapper.append(formRow);

  // Privacy Text
  if (privacyContent) {
    const privacyDiv = document.createElement('div');
    privacyDiv.className = 'es-privacy';
    privacyDiv.innerHTML = privacyContent;
    contentWrapper.append(privacyDiv);
  }

  container.append(contentWrapper);
  block.append(container);
}