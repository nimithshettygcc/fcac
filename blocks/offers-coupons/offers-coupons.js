export default async function decorate(block) {
  // 1. SETUP
  const rows = [...block.children];
  const titleText = rows[0]?.textContent.trim();
  
  // Force MockAPI URL (Prevents CORS errors)
  const apiUrl = 'https://674422deb4e2e04abea0f2ee.mockapi.io/api/v1/offers-coupons';

  const categories = [
    { label: 'All Offers', filter: 'all' },
    { label: 'Tire Offers', filter: 'tire' },
    { label: 'Oil Change Offers', filter: 'oil' },
    { label: 'Brakes & Battery Offers', filter: 'brakes-battery' },
    { label: 'Alignment Offers', filter: 'alignment' },
    { label: 'Firestone Credit Offers', filter: 'credit' },
    { label: 'Additional Offers', filter: 'additional' },
  ];

  block.textContent = '';
  const container = document.createElement('div');
  container.className = 'oc-container';

  if (titleText) {
    const header = document.createElement('h2');
    header.className = 'oc-title';
    header.textContent = titleText;
    container.append(header);
  }

  // Navbar
  const navBar = document.createElement('div');
  navBar.className = 'oc-navbar';
  const navList = document.createElement('div');
  navList.className = 'oc-nav-list';
  navBar.append(navList);
  container.append(navBar);

  // Carousel
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'oc-carousel-wrapper';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'oc-arrow oc-prev';
  prevBtn.innerHTML = '&#10094;';
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'oc-arrow oc-next';
  nextBtn.innerHTML = '&#10095;';
  
  const track = document.createElement('div');
  track.className = 'oc-track';
  
  carouselWrapper.append(prevBtn, track, nextBtn);
  container.append(carouselWrapper);

  // Scrollbar
  const scrollBarTrack = document.createElement('div');
  scrollBarTrack.className = 'oc-scrollbar-track';
  const scrollBarThumb = document.createElement('div');
  scrollBarThumb.className = 'oc-scrollbar-thumb';
  scrollBarTrack.append(scrollBarThumb);
  container.append(scrollBarTrack);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'oc-footer';
  const seeAll = document.createElement('a');
  seeAll.className = 'oc-btn-see-all';
  seeAll.textContent = 'SEE ALL OFFERS';
  seeAll.href = '#';
  footer.append(seeAll);
  container.append(footer);
  block.append(container);

  // --- HELPER: ICON LOGIC (FIXED) ---
  const getIconName = (tags = [], category = '') => {
    // To fix console 404 errors, we default to the Tire icon for now.
    // Uncomment the specific lines below only when those files exist in your /icons/ folder.
    
    // const t = (tags || []).join(' ').toLowerCase();
    // const c = (category || '').toLowerCase();
    
    // if (t.includes('oil') || c.includes('oil')) return 'oil-icon-offers-bsro-global.svg';
    // if (t.includes('brake')) return 'brake-icon-offers-bsro-global.svg';
    // if (t.includes('battery')) return 'battery-icon-offers-bsro-global.svg';
    // if (t.includes('alignment')) return 'alignment-icon-offers-bsro-global.svg';
    // if (t.includes('cfna') || t.includes('credit')) return 'card-icon-offers-bsro-global.svg';
    
    // Default to the one file we know exists to stop 404 errors
    return 'tire-icon-offers-bsro-global.svg';
  };

  const matchCategory = (offer, filter) => {
    const tags = (offer.tags || []).join(' ').toLowerCase();
    const cat = (offer.category || '').toLowerCase();
    switch (filter) {
      case 'all': return true;
      case 'tire': return tags.includes('offertire') || cat.includes('tire');
      case 'oil': return tags.includes('offeroil') || cat.includes('oil');
      case 'brakes-battery': return tags.includes('brake') || tags.includes('battery');
      case 'alignment': return tags.includes('alignment');
      case 'credit': return tags.includes('cfna') || tags.includes('credit');
      case 'additional': return tags.includes('additional') || tags.includes('wiper') || tags.includes('fluid');
      default: return false;
    }
  };

  // --- UI STATE ---
  const updateUIState = () => {
    if (track.scrollLeft <= 5) prevBtn.classList.add('disabled');
    else prevBtn.classList.remove('disabled');

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 5) nextBtn.classList.add('disabled');
    else nextBtn.classList.remove('disabled');

    const trackWidth = scrollBarTrack.clientWidth;
    const visibleRatio = track.clientWidth / track.scrollWidth;
    let thumbWidth = visibleRatio * trackWidth;
    if (thumbWidth < 30) thumbWidth = 30;
    if (thumbWidth > trackWidth) thumbWidth = trackWidth;

    const scrollRatio = track.scrollLeft / maxScroll;
    const availableTrack = trackWidth - thumbWidth;
    const thumbLeft = scrollRatio * availableTrack;

    scrollBarThumb.style.width = `${thumbWidth}px`;
    scrollBarThumb.style.transform = `translateX(${thumbLeft}px)`;
  };

  // Drag Logic
  let isDragging = false;
  let startX;
  let startScrollLeft;

  scrollBarThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    startScrollLeft = track.scrollLeft;
    scrollBarThumb.classList.add('dragging');
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    scrollBarThumb.classList.remove('dragging');
    document.body.style.userSelect = '';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - startX;
    const trackWidth = scrollBarTrack.clientWidth;
    const thumbWidth = scrollBarThumb.clientWidth;
    const availableTrack = trackWidth - thumbWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (availableTrack > 0) {
        const walk = (x / availableTrack) * maxScroll;
        track.scrollLeft = startScrollLeft + walk;
    }
  });

  track.addEventListener('scroll', updateUIState);
  window.addEventListener('resize', updateUIState);

  // --- FETCH & RENDER ---
  try {
    const resp = await fetch(apiUrl);
    const json = await resp.json();
    let allOffers = [];

    // Parse Data
    if (Array.isArray(json) && json.length > 0 && json[0].data) {
        const data = json[0].data;
        allOffers = [...(data.coupons || []), ...(data.tirePromotions || [])];
    } else if (json.data) {
        const data = json.data;
        allOffers = [...(data.coupons || []), ...(data.tirePromotions || [])];
    } else if (Array.isArray(json)) {
        allOffers = json;
    }

    const renderOffers = (filter) => {
      track.innerHTML = '';
      const filtered = allOffers.filter((o) => matchCategory(o, filter));

      if (filtered.length === 0) {
          track.innerHTML = '<p style="padding:20px; text-align:center; width:100%;">No offers available.</p>';
          return;
      }

      filtered.forEach((offer) => {
        const card = document.createElement('div');
        card.className = 'oc-card';

        const thumb = offer.thumbnail || {};
        const titleSmall = thumb.title || 'INSTANT SAVINGS';
        const price = thumb.offerPriceText || offer.price || '';
        const desc = thumb.offerSubText || offer.subText || '';
        const details = offer.offerDetails || '';
        const expiry = offer.offerEndDate || '';
        const daysLeft = '22 days left!';
        
        const iconName = getIconName(offer.tags, offer.category);
        const iconSrc = `/icons/${iconName}`;
        const fallbackIcon = '/icons/tire-icon-offers-bsro-global.svg';
        const expiryIconSrc = `/icons/offer-expire-icon.svg`;

        card.innerHTML = `
          <div class="oc-icon-ribbon"></div>
          <div class="oc-container-inner">
            <div class="oc-icon-arc">
              <img src="${iconSrc}" alt="icon" class="oc-icon" onerror="this.src='${fallbackIcon}'; this.onerror=null;">
            </div>
            <div class="oc-body-wrap">
              <div class="oc-body-copy">
                <h2 class="oc-title">${titleSmall}</h2>
                <h2 class="oc-discount-copy">${price}</h2>
                <h2 class="oc-subtitle">${desc}</h2>
                ${details ? `<h3 class="oc-summary">${details}</h3>` : ''}
              </div>
            </div>
            <div class="oc-separator"></div>
            <div class="oc-footer-wrap">
              <div class="oc-ctas">
                <button class="oc-phone-cta">Send to Me</button>
                <button class="oc-print-cta">Print</button>
              </div>
              <div class="oc-footer-copy">
                <a href="#" class="oc-details-cta">See Details</a>
                <div class="oc-expiry-wrap">
                  <img src="${expiryIconSrc}" alt="clock" class="oc-expiry-icon" onerror="this.style.display='none'">
                  <span class="oc-expiry-date">Exp. ${expiry} <span>(${daysLeft})</span></span>
                </div>
              </div>
            </div>
          </div>
        `;
        track.append(card);
      });

      setTimeout(updateUIState, 50); 
    };

    // Init Tabs
    categories.forEach((cat, index) => {
      const count = allOffers.filter((o) => matchCategory(o, cat.filter)).length;
      if (count === 0 && cat.filter !== 'all') return;
      const btn = document.createElement('button');
      btn.className = `oc-tab ${index === 0 ? 'active' : ''}`;
      btn.innerHTML = `${cat.label} <span>(${count})</span>`;
      btn.onclick = () => {
        document.querySelectorAll('.oc-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderOffers(cat.filter);
      };
      navList.append(btn);
    });

    renderOffers('all');

    const scrollVal = 300; 
    prevBtn.onclick = () => track.scrollBy({ left: -scrollVal, behavior: 'smooth' });
    nextBtn.onclick = () => track.scrollBy({ left: scrollVal, behavior: 'smooth' });

  } catch (e) {
    console.error('Failed to load offers', e);
    track.innerHTML = '<p style="padding:20px; text-align:center;">Unable to load offers.</p>';
  }
}

  /* Cache busting update */