import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('=== OFFER-LIST DEBUG START ===');
  console.log('Block:', block);
  console.log('Block children count:', block.children.length);
  
  const rows = [...block.children];
  
  // Log each row
  rows.forEach((row, index) => {
    console.log(`Row ${index}:`, row);
    console.log(`  - Has picture:`, !!row.querySelector('picture'));
    console.log(`  - Has link:`, !!row.querySelector('a'));
    console.log(`  - innerHTML preview:`, row.innerHTML.substring(0, 100));
  });
  
  if (rows.length === 0) {
    console.warn('No rows found in block');
    return;
  }

  const container = document.createElement('div');
  container.className = 'offer-list-container';

  // Process rows in pairs (image + link)
  for (let i = 0; i < rows.length; i += 2) {
    console.log(`\n--- Processing pair ${i/2} (rows ${i} and ${i+1}) ---`);
    
    const imageRow = rows[i];
    const linkRow = rows[i + 1];
    
    if (!imageRow) {
      console.warn(`Image row ${i} is undefined`);
      continue;
    }
    
    if (!linkRow) {
      console.warn(`Link row ${i+1} is undefined`);
      continue;
    }
    
    console.log('Image row:', imageRow);
    console.log('Link row:', linkRow);
    
    const offerItem = document.createElement('div');
    offerItem.className = 'offer-list-item';
    
    if (i === 0) {
      offerItem.classList.add('offer-list-featured');
      console.log('Added featured class to first item');
    }
    
    moveInstrumentation(imageRow, offerItem);
    
    // Get link
    const link = linkRow.querySelector('a');
    console.log('Found link:', link ? link.href : 'NO LINK');
    
    // Get picture - try multiple approaches
    let picture = imageRow.querySelector('picture');
    console.log('Found picture (direct):', !!picture);
    
    if (!picture) {
      // Try finding in nested divs
      const allDivs = imageRow.querySelectorAll('div');
      console.log('Searching in nested divs, found:', allDivs.length);
      allDivs.forEach((div, idx) => {
        const pic = div.querySelector('picture');
        if (pic) {
          console.log(`Found picture in nested div ${idx}`);
          picture = pic;
        }
      });
    }
    
    if (!link) {
      console.error(`❌ No link found in row ${i+1}`);
    }
    
    if (!picture) {
      console.error(`❌ No picture found in row ${i}`);
      console.log('Full imageRow HTML:', imageRow.innerHTML);
      continue;
    }
    
    console.log('✅ Creating offer with picture and link');
    
    // Create clickable wrapper
    const offerLink = document.createElement('a');
    offerLink.href = link ? link.href : '#';
    offerLink.className = 'offer-list-link';
    offerLink.setAttribute('aria-label', `View offer ${(i/2) + 1}`);
    
    if (link) {
      // Copy link attributes
      [...link.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-') || attr.name === 'title') {
          offerLink.setAttribute(attr.name, attr.value);
        }
      });
      moveInstrumentation(link, offerLink);
    }
    
    // Clone picture instead of moving it
    const pictureClone = picture.cloneNode(true);
    console.log('Cloned picture, img src:', pictureClone.querySelector('img')?.src);
    
    offerLink.appendChild(pictureClone);
    offerItem.appendChild(offerLink);
    container.appendChild(offerItem);
    
    console.log(`✅ Offer item ${i/2} added to container`);
  }

  console.log('\n=== Final container has', container.children.length, 'items ===');
  
  block.textContent = '';
  block.appendChild(container);
  
  console.log('=== OFFER-LIST DEBUG END ===\n');
}
