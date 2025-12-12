export default function decorate(block) {
    const rows = [...block.children];
  
    // --- 1. Extract Data ---
    const titleText = rows[0]?.textContent.trim();
    // Row 1 (index 1) is often empty spacer, skip it
    const viewMoreText = rows[2]?.textContent.trim();
    // Article rows start from index 3
    const articleRows = rows.slice(3);
  
    // --- 2. Setup Container ---
    block.textContent = '';
    const container = document.createElement('div');
    container.classList.add('articles-inner-container');
  
    // --- 3. Build Header (Title Only) ---
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('articles-header');
  
    if (titleText) {
      const h2 = document.createElement('h2');
      h2.className = 'articles-title';
      h2.textContent = titleText;
      headerDiv.append(h2);
    }
    container.append(headerDiv);
  
    // --- 4. Build Grid Section ---
    const gridDiv = document.createElement('div');
    gridDiv.classList.add('articles-grid');
  
    articleRows.forEach((row) => {
      const cols = row.querySelectorAll('div');
      if (cols.length < 4) return;
  
      // Extract Data
      const pic = cols[0]?.querySelector('picture');
      const category = cols[1]?.textContent.trim();
      const title = cols[2]?.textContent.trim();
      const linkHref = cols[3]?.querySelector('a')?.href;
  
      // Card Wrapper
      const card = document.createElement('a');
      card.className = 'article-card';
      card.href = linkHref || '#';
  
      // Image
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'article-image';
      if (pic) imgWrapper.append(pic);
      card.append(imgWrapper);
  
      // Content
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'article-content';
  
      const catSpan = document.createElement('span');
      catSpan.className = 'article-category';
      catSpan.textContent = category;
  
      const h3 = document.createElement('h3');
      h3.className = 'article-heading';
      h3.textContent = title;
  
      contentWrapper.append(catSpan, h3);
      card.append(contentWrapper);
      gridDiv.append(card);
    });
  
    container.append(gridDiv);
  
    // --- 5. Build Bottom Button Section ---
    if (viewMoreText) {
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'articles-button-wrapper';
  
      const viewMoreBtn = document.createElement('a');
      viewMoreBtn.className = 'articles-view-more-btn';
      viewMoreBtn.href = 'https://www.firestonecompleteautocare.com/blog/'; 
      viewMoreBtn.textContent = viewMoreText; // Text is capitalized via CSS
  
      buttonWrapper.append(viewMoreBtn);
      container.append(buttonWrapper);
    }
  
    block.append(container);
  }