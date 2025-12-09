export default function decorate(block) {
    const rows = [...block.children];
  
    // --- 1. Extract Header & Nav (Rows 0-6) ---
    const titleText = rows[0].querySelector('p')?.textContent;
    
    // Repair Link
    const repairUrl = rows[1].querySelector('a')?.href;
    const repairText = rows[2].querySelector('p')?.textContent;
    
    // Maintain Link
    const maintUrl = rows[4].querySelector('a')?.href;
    const maintText = rows[5].querySelector('p')?.textContent;
  
    // --- 2. Extract Service Cards (Rows 7-10) ---
    const serviceRows = rows.slice(7, 11);
  
    // --- 3. Extract Feature Cards (Rows 11-12) ---
    const featureRows = rows.slice(11, 13);
  
    // Clear Block
    block.textContent = '';
  
    // ============================================
    // BUILD HEADER SECTION
    // ============================================
    const headerDiv = document.createElement('div');
    headerDiv.className = 'ts-header';
  
    if (titleText) {
      const h2 = document.createElement('h2');
      h2.className = 'ts-title';
      h2.textContent = titleText;
      headerDiv.append(h2);
    }
  
    const navDiv = document.createElement('div');
    navDiv.className = 'ts-nav';
    
    // Repair Link
    if (repairText) {
      const a1 = document.createElement('a');
      a1.href = repairUrl || '#';
      a1.textContent = repairText;
      navDiv.append(a1);
    }
  
    // Separator
    const sep = document.createElement('span');
    sep.className = 'ts-sep';
    sep.textContent = '|';
    navDiv.append(sep);
  
    // Maintain Link
    if (maintText) {
      const a2 = document.createElement('a');
      a2.href = maintUrl || '#';
      a2.textContent = maintText;
      navDiv.append(a2);
    }
    headerDiv.append(navDiv);
    block.append(headerDiv);
  
    // ============================================
    // BUILD SERVICE GRID (4 Columns)
    // ============================================
    const gridDiv = document.createElement('div');
    gridDiv.className = 'ts-service-grid';
  
    serviceRows.forEach(row => {
      const cols = [...row.children];
      // DOM Structure based on your input:
      // 0: Image, 1: Title, 2: Desc, 3: URL, 4: Link Text
      
      const card = document.createElement('div');
      card.className = 'ts-card';
  
      // Image
      const pic = cols[0].querySelector('picture');
      if (pic) {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'ts-card-image';
        imgWrapper.append(pic);
        card.append(imgWrapper);
      }
  
      // Content
      const content = document.createElement('div');
      content.className = 'ts-card-content';
  
      const title = document.createElement('h3');
      title.textContent = cols[1]?.textContent || '';
      
      const desc = document.createElement('p');
      desc.className = 'ts-card-desc';
      desc.textContent = cols[2]?.textContent || '';
  
      const link = document.createElement('a');
      link.className = 'ts-card-link';
      link.href = cols[3]?.querySelector('a')?.href || '#';
      link.textContent = cols[4]?.textContent || 'Learn More';
  
      content.append(title, desc, link);
      card.append(content);
      gridDiv.append(card);
    });
  
    block.append(gridDiv);
  
    // ============================================
    // BUILD FEATURE GRID (2 Large Cards)
    // ============================================
    const featureDiv = document.createElement('div');
    featureDiv.className = 'ts-feature-grid';
  
    featureRows.forEach((row, index) => {
      const cols = [...row.children];
      // Row 11 (Advisor): 0:Title, 1:Desc, 2:URL, 3:BtnText, 4:Empty, 5:Image
      // Row 12 (Finance): 0:Title, 1:Desc, 2:URL, 3:BtnText, 4:Empty, 5:BgImg, 6:FgImg
      
      const card = document.createElement('div');
      card.className = `ts-feature-card feature-${index}`; // index 0 = left, 1 = right
  
      // Content Wrapper (Text)
      const textWrap = document.createElement('div');
      textWrap.className = 'ts-feature-text';
  
      const h3 = document.createElement('h3');
      h3.textContent = cols[0]?.textContent || '';
  
      const p = document.createElement('p');
      p.textContent = cols[1]?.textContent || '';
  
      const btn = document.createElement('a');
      btn.className = 'ts-btn-red';
      btn.href = cols[2]?.querySelector('a')?.href || '#';
      btn.textContent = cols[3]?.textContent || 'LEARN MORE';
  
      textWrap.append(h3, p, btn);
      card.append(textWrap);
  
      // Images
      // For Financing Card (Right), there might be 2 images (bg texture + card)
      const pics = row.querySelectorAll('picture');
      if (pics.length > 0) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'ts-feature-image';
          
          pics.forEach((pic, i) => {
              // Apply specific class if it's the second image (e.g. the credit card)
              if (i === 1) pic.classList.add('ts-overlay-img'); 
              else pic.classList.add('ts-bg-img');
              imgWrap.append(pic);
          });
          card.append(imgWrap);
      }
  
      featureDiv.append(card);
    });
  
    block.append(featureDiv);
  }