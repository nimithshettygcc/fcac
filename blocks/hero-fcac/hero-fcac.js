export default function decorate(block) {
  // Do NOT rewrite the DOM when in the Universal Editor (Sidekick present)
  if (window.hlx && window.hlx.sidekick) {
    return;
  }

  // --- FIX 1: Remove default margins from the parent section wrapper ---
  const parentSection = block.closest('.section');
  if (parentSection) {
    parentSection.style.margin = '0';
    parentSection.style.padding = '0';
    parentSection.style.maxWidth = '100%';
  }

  // Get all direct child divs (rows)
  const rows = [...block.children];

  // Helper function to get text from first paragraph only
  const getFirstText = (row) => {
    const p = row?.querySelector('p');
    return p ? p.textContent.trim() : '';
  };

  // Helper function to get link from row
  const getFirstLink = (row) => {
    const a = row?.querySelector('a');
    return a ? a.href : '#';
  };

  // Extract banner content
  const heading = getFirstText(rows[0]) || 'Cyber Monday Sale';
  const subheading = getFirstText(rows[1]) || 'Tire & Service Offers';
  const description = getFirstText(rows[2]) || '';
  const ctaLink = getFirstLink(rows[3]) || '#';
  const ctaText = getFirstText(rows[4]) || 'GET DETAILS';
  const heroPicture = rows[5]?.querySelector('picture');

  // Row 6 contains ALL the nested content
  const nestedDivs = rows[6] ? [...rows[6].children] : [];

  // Extract Shop Tires content
  const shopTiresTab = getFirstText(nestedDivs[0]) || 'SHOP TIRES';
  const byVehicleTab = getFirstText(nestedDivs[1]) || 'BY VEHICLE';
  const zipCode = getFirstText(nestedDivs[6]) || '37206';
  const getTirePricingBtn = getFirstText(nestedDivs[8]) || 'GET TIRE PRICING';

  // Get Services tab
  const getServicesTab = getFirstText(nestedDivs[16]) || 'GET SERVICES';

  // Service names and icons
  const oilChangeText = getFirstText(nestedDivs[17]) || 'OIL CHANGE';
  const oilChangeIcon = nestedDivs[19]?.querySelector('img')?.src || '';
  const brakesText = getFirstText(nestedDivs[31]) || 'BRAKES';
  const brakesIcon = nestedDivs[32]?.querySelector('img')?.src || '';
  const batteriesText = getFirstText(nestedDivs[44]) || 'BATTERIES';
  const batteriesIcon = nestedDivs[45]?.querySelector('img')?.src || '';
  const alignmentText = getFirstText(nestedDivs[57]) || 'ALIGNMENT';
  const alignmentIcon = nestedDivs[58]?.querySelector('img')?.src || '';

  // Helpers
  function parseStoreHours(hoursText) {
    if (!hoursText) return [];
    const cleanText = hoursText.replace(/^Store Hours:\s*Day\(s\)\s*Hours\s*/i, '');
    const hours = [];
    const patterns = [
      { match: /MON-FRI:\s*([\d:apm-]+)/i, day: 'MON-FRI:', special: false },
      { match: /SAT:\s*([\d:apm-]+)/i, day: 'SAT:', special: false },
      { match: /SUN:\s*([\d:apm-]+)/i, day: 'SUN:', special: false },
      { match: /Christmas Eve:\s*([\d:apm-]+)/i, day: 'Christmas Eve:', special: true },
      { match: /Christmas:\s*(\w+)/i, day: 'Christmas:', special: true }
    ];
    patterns.forEach((pattern) => {
      const match = cleanText.match(pattern.match);
      if (match) {
        hours.push({
          day: pattern.day,
          time: match[1],
          special: pattern.special,
        });
      }
    });
    return hours;
  }

  function parseAddress(addressText) {
    if (!addressText) return { lines: [], phone: '' };
    const phoneMatch = addressText.match(/(\d{3}[.\-]?\d{3}[.\-]?\d{4})/);
    const phone = phoneMatch ? phoneMatch[1] : '';
    let address = addressText.replace(/\d{3}[.\-]?\d{3}[.\-]?\d{4}/, '').trim();
    const parts = address.split(/(?=[A-Z][a-z]+,)/);
    const lines = [];
    if (parts.length > 1) {
      lines.push(parts[0].trim());
      lines.push(parts[1].trim());
    } else {
      const commaParts = address.split(',');
      if (commaParts.length >= 2) {
        lines.push(commaParts[0].trim());
        lines.push(commaParts.slice(1).join(',').trim());
      } else {
        lines.push(address);
      }
    }
    return { lines, phone };
  }

  const serviceData = {
    oilChange: {
      type: 'details',
      heading: getFirstText(nestedDivs[18]) || 'GET AN OIL CHANGE',
      storeLabel: getFirstText(nestedDivs[20]) || 'YOUR NEAREST STORE:',
      storeAddressRaw: getFirstText(nestedDivs[22]) || '',
      storeMap: nestedDivs[23]?.querySelector('img')?.src || '',
      storeHoursRaw: getFirstText(nestedDivs[24]) || '',
      storeDetailsLink: getFirstLink(nestedDivs[25]) || '#',
      storeDetailsText: getFirstText(nestedDivs[26]) || 'STORE DETAILS',
      changeStoreLink: getFirstLink(nestedDivs[27]) || '#',
      changeStoreText: getFirstText(nestedDivs[28]) || 'CHANGE STORE',
      appointmentLink: getFirstLink(nestedDivs[29]) || '#',
      appointmentText: getFirstText(nestedDivs[30]) || 'SCHEDULE AN APPOINTMENT',
    },
    brakes: {
      type: 'details',
      heading: getFirstText(nestedDivs[33]) || 'SCHEDULE SERVICE',
      storeLabel: getFirstText(nestedDivs[34]) || 'YOUR NEAREST STORE:',
      storeAddressRaw: getFirstText(nestedDivs[35]) || '',
      storeMap: nestedDivs[36]?.querySelector('img')?.src || '',
      storeHoursRaw: getFirstText(nestedDivs[37]) || '',
      storeDetailsLink: getFirstLink(nestedDivs[38]) || '#',
      storeDetailsText: getFirstText(nestedDivs[39]) || 'STORE DETAILS',
      changeStoreLink: getFirstLink(nestedDivs[40]) || '#',
      changeStoreText: getFirstText(nestedDivs[41]) || 'CHANGE STORE',
      appointmentLink: getFirstLink(nestedDivs[42]) || '#',
      appointmentText: getFirstText(nestedDivs[43]) || 'SCHEDULE AN APPOINTMENT',
    },
    batteries: {
      type: 'form',
      heading: 'SEARCH FOR BATTERIES',
      buttonText: 'GET BATTERY PRICING',
      btnId: 'batteries-submit-btn',
      fourthField: 'Engine'
    },
    // --- FIX 2: ALIGNMENT DATA MATCHING SCREENSHOT ---
    alignment: {
      type: 'form',
      heading: 'ALIGNMENT SERVICE', // Matches red header in screenshot
      buttonText: 'GET ALIGNMENT PRICING',
      btnId: 'alignment-submit-btn',
      fourthField: 'Submodel' // Matches 4th dropdown in screenshot
    },
  };

  // Clear block
  block.innerHTML = '';

  // Create main container
  const heroSection = document.createElement('section');
  heroSection.className = 'hero-fcac-section';

  // Create image wrap
  const imageWrap = document.createElement('div');
  imageWrap.className = 'hero-image-wrap';
  if (heroPicture) {
    const clonedPicture = heroPicture.cloneNode(true);
    imageWrap.appendChild(clonedPicture);
  }

  // Create widget wrap
  const widgetWrap = document.createElement('div');
  widgetWrap.className = 'hero-widget-wrap';

  // Top Nav
  const topNav = document.createElement('div');
  topNav.className = 'hero-top-nav';
  const topNavList = document.createElement('ul');

  const shopTiresLi = document.createElement('li');
  shopTiresLi.className = 'shop-tires active';
  const shopTiresLink = document.createElement('a');
  shopTiresLink.href = '#';
  shopTiresLink.textContent = shopTiresTab;
  shopTiresLi.appendChild(shopTiresLink);

  const getServicesLi = document.createElement('li');
  getServicesLi.className = 'get-services';
  const getServicesLink = document.createElement('a');
  getServicesLink.href = '#';
  getServicesLink.textContent = getServicesTab;
  getServicesLi.appendChild(getServicesLink);

  topNavList.appendChild(shopTiresLi);
  topNavList.appendChild(getServicesLi);
  topNav.appendChild(topNavList);

  // Tab Nav (Side)
  const tabNav = document.createElement('div');
  tabNav.className = 'hero-tab-nav';
  tabNav.style.display = 'none';
  const tabNavList = document.createElement('ul');

  const services = [
    { name: oilChangeText, icon: oilChangeIcon, key: 'oilChange', active: true },
    { name: brakesText, icon: brakesIcon, key: 'brakes' },
    { name: batteriesText, icon: batteriesIcon, key: 'batteries' },
    { name: alignmentText, icon: alignmentIcon, key: 'alignment' },
  ];

  services.forEach((service) => {
    const serviceLi = document.createElement('li');
    if (service.active) serviceLi.className = 'active';
    serviceLi.dataset.service = service.key;
    const serviceLink = document.createElement('a');
    serviceLink.href = '#';
    if (service.icon) {
      const iconImg = document.createElement('img');
      iconImg.src = service.icon;
      iconImg.className = 'icon';
      iconImg.alt = service.name;
      serviceLink.appendChild(iconImg);
    }
    const textSpan = document.createElement('span');
    textSpan.textContent = service.name;
    const arrowSpan = document.createElement('span');
    arrowSpan.innerHTML = '›';
    arrowSpan.style.fontSize = '24px';
    serviceLink.appendChild(textSpan);
    serviceLink.appendChild(arrowSpan);
    serviceLi.appendChild(serviceLink);
    tabNavList.appendChild(serviceLi);
  });
  tabNav.appendChild(tabNavList);

  // Tab Content Area
  const tabContent = document.createElement('div');
  tabContent.className = 'hero-tab-content';

  // --- Shop Tires Section ---
  const tireSection = document.createElement('section');
  tireSection.className = 'tire-search-widget active';

  const innerTabs = document.createElement('div');
  innerTabs.className = 'hero-inner-tabs';
  const innerTabNav = document.createElement('div');
  innerTabNav.className = 'inner-tab-nav';
  const innerTabList = document.createElement('ul');

  const byVehicleLi = document.createElement('li');
  byVehicleLi.className = 'active';
  const byVehicleLink = document.createElement('a');
  byVehicleLink.href = '#';
  byVehicleLink.textContent = byVehicleTab;
  byVehicleLi.appendChild(byVehicleLink);

  const byTireSizeLi = document.createElement('li');
  const byTireSizeLink = document.createElement('a');
  byTireSizeLink.href = '#';
  byTireSizeLink.textContent = 'BY TIRE SIZE';
  byTireSizeLi.appendChild(byTireSizeLink);

  innerTabList.appendChild(byVehicleLi);
  innerTabList.appendChild(byTireSizeLi);
  innerTabNav.appendChild(innerTabList);

  const innerTabContent = document.createElement('div');
  innerTabContent.className = 'inner-tab-content';
  const requiredText = document.createElement('p');
  requiredText.className = 'required-text';
  requiredText.textContent = 'All fields are required';

  // Helper for Shop Tires selects (with Labels)
  function createSelectField(id, label, disabled = false) {
    const field = document.createElement('div');
    field.className = 'form-field';
    const lbl = document.createElement('label');
    lbl.setAttribute('for', id);
    lbl.textContent = label;
    const selectDiv = document.createElement('div');
    selectDiv.className = 'custom-select';
    const select = document.createElement('select');
    select.id = id;
    select.name = id;
    select.disabled = disabled;
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '--Select--';
    select.appendChild(option);
    selectDiv.appendChild(select);
    field.appendChild(lbl);
    field.appendChild(selectDiv);
    return { field, select };
  }

  // By Vehicle Form
  const byVehicleSection = document.createElement('section');
  byVehicleSection.className = 'active';
  const vehicleForm = document.createElement('form');
  vehicleForm.className = 'search-by-vehicle';

  const { field: yearField, select: yearSelect } = createSelectField('year', 'Year', false);
  const { field: makeField, select: makeSelect } = createSelectField('make', 'Make', true);
  const { field: modelField, select: modelSelect } = createSelectField('model', 'Model', true);
  const { field: submodelField, select: submodelSelect } = createSelectField('submodel', 'Submodel', true);

  const zipField = document.createElement('div');
  zipField.className = 'form-field';
  const zipLabel = document.createElement('label');
  zipLabel.setAttribute('for', 'zipcode');
  zipLabel.textContent = 'Zip Code';
  const zipWrapper = document.createElement('div');
  zipWrapper.className = 'zip-wrapper';
  const zipInput = document.createElement('input');
  zipInput.type = 'text';
  zipInput.id = 'zipcode';
  zipInput.name = 'zip';
  zipInput.value = zipCode;
  zipInput.className = 'zip-input';
  const whyLink = document.createElement('a');
  whyLink.href = '#';
  whyLink.className = 'why-link';
  whyLink.textContent = 'Why?';
  zipWrapper.appendChild(zipInput);
  zipWrapper.appendChild(whyLink);
  zipField.appendChild(zipLabel);
  zipField.appendChild(zipWrapper);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-submit';
  submitBtn.textContent = getTirePricingBtn;
  submitBtn.disabled = true;

  vehicleForm.append(yearField, makeField, modelField, submodelField, zipField, submitBtn);
  byVehicleSection.appendChild(vehicleForm);

  // By Tire Size Form
  const byTireSizeSection = document.createElement('section');
  const tireSizeForm = document.createElement('form');
  tireSizeForm.className = 'search-by-vehicle';

  const { field: crossSectionField, select: crossSectionSelect } = createSelectField('cross-section', 'Cross Section', false);
  const { field: aspectRatioField, select: aspectRatioSelect } = createSelectField('aspect-ratio', 'Aspect Ratio', true);
  const { field: rimDiameterField, select: rimDiameterSelect } = createSelectField('rim-diameter', 'Rim Diameter', true);

  const zipFieldTireSize = zipField.cloneNode(true);
  const zipInputTireSize = zipFieldTireSize.querySelector('input');
  zipInputTireSize.id = 'zipcode-tire-size';
  const submitBtnTireSize = submitBtn.cloneNode(true);

  tireSizeForm.append(crossSectionField, aspectRatioField, rimDiameterField, zipFieldTireSize, submitBtnTireSize);
  byTireSizeSection.appendChild(tireSizeForm);

  innerTabContent.append(requiredText, byVehicleSection, byTireSizeSection);
  innerTabs.append(innerTabNav, innerTabContent);
  tireSection.appendChild(innerTabs);
  tabContent.appendChild(tireSection);

  // Service Detail View
  const serviceDetailView = document.createElement('section');
  serviceDetailView.className = 'service-detail-view';
  serviceDetailView.style.display = 'none';
  tabContent.appendChild(serviceDetailView);

  // Function to create service detail content
  function createServiceDetail(serviceName, data) {
    serviceDetailView.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'service-detail-header';
    const title = document.createElement('h2');
    title.textContent = data.heading;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'service-close-btn';
    closeBtn.innerHTML = '×';
    header.append(title, closeBtn);

    closeBtn.addEventListener('click', () => {
      serviceDetailView.style.display = 'none';
      topNav.style.display = 'block';
      tabNav.style.display = 'block';
    });

    serviceDetailView.appendChild(header);

    if (data.type === 'form') {
      // --- Render Form (Batteries & Alignment) ---
      const contentContainer = document.createElement('div');
      contentContainer.style.padding = '0'; 

      const reqText = document.createElement('p');
      reqText.className = 'required-text';
      reqText.textContent = 'All fields are required';
      
      // Exact Computed Style for "All fields required"
      reqText.style.boxSizing = 'border-box';
      reqText.style.color = 'rgb(51, 51, 51)';
      reqText.style.display = 'block';
      reqText.style.fontFamily = "'Avenir', Arial, sans-serif";
      reqText.style.fontSize = '14px';
      reqText.style.fontWeight = '400';
      reqText.style.height = '19.9896px';
      reqText.style.lineHeight = '20px';
      reqText.style.marginBlockEnd = '14px';
      reqText.style.marginBlockStart = '14px';
      reqText.style.marginInlineEnd = '0px';
      reqText.style.marginInlineStart = '0px';
      reqText.style.width = '345px';

      const formDiv = document.createElement('div');
      formDiv.className = 'search-by-vehicle';
      formDiv.style.gap = '10px';

      // No Label Dropdowns
      function createNoLabelSelect(id, placeholder, disabled=false) {
        const field = document.createElement('div');
        field.className = 'form-field';
        field.style.height = 'auto'; 
        
        const selectDiv = document.createElement('div');
        selectDiv.className = 'custom-select';
        
        const select = document.createElement('select');
        select.id = `${serviceName}-${id}`;
        select.name = `${serviceName}-${id}`;
        select.disabled = disabled;
        
        const option = document.createElement('option');
        option.value = '';
        option.textContent = placeholder; 
        
        select.appendChild(option);
        selectDiv.appendChild(select);
        field.appendChild(selectDiv);
        return { field, select };
      }

      const { field: yearF, select: yearS } = createNoLabelSelect('year', 'Year', false);
      const { field: makeF, select: makeS } = createNoLabelSelect('make', 'Make', true);
      const { field: modelF, select: modelS } = createNoLabelSelect('model', 'Model', true);
      const { field: fourthF, select: fourthS } = createNoLabelSelect(data.fourthField.toLowerCase(), data.fourthField, true);

      yearS.addEventListener('change', () => { makeS.disabled = !yearS.value; if(!yearS.value) makeS.value = ''; });
      makeS.addEventListener('change', () => { modelS.disabled = !makeS.value; if(!makeS.value) modelS.value = ''; });
      modelS.addEventListener('change', () => { fourthS.disabled = !modelS.value; if(!modelS.value) fourthS.value = ''; });

      // Zip Code (No label, just input)
      const zipWrapper = document.createElement('div');
      zipWrapper.className = 'zip-wrapper';
      zipWrapper.style.marginTop = '5px'; 
      
      const zipInput = document.createElement('input');
      zipInput.type = 'text';
      zipInput.className = 'zip-input';
      zipInput.value = '37206';
      // FIX: Grey out zip code for Batteries/Alignment
      zipInput.disabled = true;
      
      const whyLink = document.createElement('a');
      whyLink.href = '#';
      whyLink.className = 'why-link';
      whyLink.textContent = 'Why?';
      
      zipWrapper.appendChild(zipInput);
      zipWrapper.appendChild(whyLink);

      const formSubmit = document.createElement('button');
      formSubmit.className = 'btn-submit';
      // Specific ID for Grey button styling
      formSubmit.id = data.btnId;
      formSubmit.textContent = data.buttonText;
      formSubmit.style.marginTop = '20px';
      
      // Default Disabled State
      formSubmit.disabled = true;

      fourthS.addEventListener('change', () => {
        if(fourthS.value) {
           formSubmit.disabled = false;
           formSubmit.style.backgroundColor = '#d81e05';
           formSubmit.style.color = '#fff';
           formSubmit.style.border = '2px solid #6f3f3f';
           formSubmit.style.cursor = 'pointer';
           formSubmit.style.opacity = '1';
        }
      });

      formDiv.append(yearF, makeF, modelF, fourthF, zipWrapper, formSubmit);
      contentContainer.append(reqText, formDiv);
      serviceDetailView.appendChild(contentContainer);

    } else {
      // --- Render Details ---
      const addressData = parseAddress(data.storeAddressRaw);
      const hoursData = parseStoreHours(data.storeHoursRaw);

      const storeInfo = document.createElement('div');
      storeInfo.className = 'service-store-info';

      const storeLabel = document.createElement('h3');
      storeLabel.textContent = data.storeLabel;
      storeInfo.appendChild(storeLabel);

      const storeDetailsWrapper = document.createElement('div');
      storeDetailsWrapper.className = 'store-details-wrapper';

      const addressDiv = document.createElement('div');
      addressDiv.className = 'store-address-info';
      addressData.lines.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        addressDiv.appendChild(p);
      });
      storeDetailsWrapper.appendChild(addressDiv);

      if (data.storeMap) {
        const mapWrapper = document.createElement('div');
        mapWrapper.className = 'store-map-wrapper';
        const mapImg = document.createElement('img');
        mapImg.src = data.storeMap;
        mapWrapper.appendChild(mapImg);
        storeDetailsWrapper.appendChild(mapWrapper);
      }
      storeInfo.appendChild(storeDetailsWrapper);

      const contactRow = document.createElement('div');
      contactRow.className = 'store-contact-row';
      if (addressData.phone) {
        const phoneLink = document.createElement('a');
        phoneLink.href = `tel:${addressData.phone.replace(/[^\d]/g, '')}`;
        phoneLink.className = 'store-phone';
        phoneLink.textContent = addressData.phone;
        contactRow.appendChild(phoneLink);
      }
      const directionsLink = document.createElement('a');
      directionsLink.href = '#';
      directionsLink.className = 'directions-link';
      directionsLink.textContent = 'DIRECTIONS';
      contactRow.appendChild(directionsLink);
      storeInfo.appendChild(contactRow);

      if (hoursData.length > 0) {
        const hoursDiv = document.createElement('div');
        hoursDiv.className = 'store-hours';
        const hoursTitle = document.createElement('h4');
        hoursTitle.textContent = 'Store Hours:';
        hoursDiv.appendChild(hoursTitle);
        const hoursList = document.createElement('div');
        hoursList.className = 'hours-list';
        hoursData.forEach((hour) => {
          const hourRow = document.createElement('div');
          const daySpan = document.createElement('span');
          daySpan.className = hour.special ? 'day special' : 'day';
          daySpan.textContent = hour.day;
          const timeSpan = document.createElement('span');
          timeSpan.className = hour.special ? 'time special' : 'time';
          timeSpan.textContent = hour.time;
          hourRow.append(daySpan, timeSpan);
          hoursList.appendChild(hourRow);
        });
        hoursDiv.appendChild(hoursList);
        storeInfo.appendChild(hoursDiv);
      }

      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'service-buttons';
      const storeDetailsBtn = document.createElement('a');
      storeDetailsBtn.href = data.storeDetailsLink;
      storeDetailsBtn.className = 'btn-outline';
      storeDetailsBtn.textContent = data.storeDetailsText;
      const changeStoreBtn = document.createElement('a');
      changeStoreBtn.href = data.changeStoreLink;
      changeStoreBtn.className = 'btn-outline';
      changeStoreBtn.textContent = data.changeStoreText;
      buttonsDiv.append(storeDetailsBtn, changeStoreBtn);

      const appointmentDiv = document.createElement('div');
      appointmentDiv.className = 'service-appointment';
      const appointmentBtn = document.createElement('a');
      appointmentBtn.href = data.appointmentLink;
      appointmentBtn.className = 'btn-primary';
      appointmentBtn.textContent = data.appointmentText;
      appointmentDiv.appendChild(appointmentBtn);

      serviceDetailView.append(storeInfo, buttonsDiv, appointmentDiv);
    }
  }

  // Assemble widget
  widgetWrap.append(topNav, tabNav, tabContent);

  // Copy Overlay
  const copyOverlay = document.createElement('div');
  copyOverlay.className = 'hero-copy-overlay';
  const mainHeading = document.createElement('h1');
  mainHeading.textContent = `${heading} `;
  const subheadSpan = document.createElement('span');
  subheadSpan.className = 'subhead';
  subheadSpan.textContent = subheading;
  mainHeading.appendChild(subheadSpan);
  const descriptionDiv = document.createElement('div');
  descriptionDiv.className = 'description';
  const descriptionContent = document.createElement('div');
  descriptionContent.className = 'description-content';
  const descP = document.createElement('p');
  descP.textContent = description;
  descriptionContent.appendChild(descP);
  const ctaButton = document.createElement('a');
  ctaButton.href = ctaLink;
  ctaButton.className = 'btn-cta';
  ctaButton.textContent = ctaText;
  descriptionDiv.append(descriptionContent, ctaButton);
  copyOverlay.append(mainHeading, descriptionDiv);

  heroSection.append(imageWrap, widgetWrap, copyOverlay);
  block.appendChild(heroSection);

  // --- EVENT LISTENERS ---

  // Top Nav Switching
  topNavList.querySelectorAll('li').forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      topNavList.querySelectorAll('li').forEach((li) => li.classList.remove('active'));
      item.classList.add('active');
      if (index === 0) {
        tabNav.style.display = 'none';
        serviceDetailView.style.display = 'none';
        tireSection.style.display = 'block';
      } else {
        tabNav.style.display = 'block';
        serviceDetailView.style.display = 'none';
        tireSection.style.display = 'none';
      }
    });
  });

  // Services Menu Switching
  tabNavList.querySelectorAll('li').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = item.dataset.service;
      const data = serviceData[serviceKey];
      if (data) {
        createServiceDetail(serviceKey, data);
        topNav.style.display = 'none';
        tabNav.style.display = 'none';
        serviceDetailView.style.display = 'block';
      }
    });
  });

  // Inner Tabs (Shop Tires) - Use delegation
  innerTabList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    e.preventDefault();
    
    // Switch Active State
    [...innerTabList.children].forEach(child => child.classList.remove('active'));
    li.classList.add('active');

    // Switch Sections
    const index = [...innerTabList.children].indexOf(li);
    const sections = innerTabContent.querySelectorAll('section');
    sections.forEach((sec, i) => {
      if (i === index) sec.classList.add('active');
      else sec.classList.remove('active');
    });
  });

  // Shop Tires - By Vehicle Form Logic
  yearSelect.addEventListener('change', () => {
    makeSelect.disabled = !yearSelect.value;
    if(!yearSelect.value) { makeSelect.value = ''; modelSelect.value = ''; submodelSelect.value = ''; modelSelect.disabled = true; submodelSelect.disabled = true; }
    checkVehicleForm();
  });
  makeSelect.addEventListener('change', () => {
    modelSelect.disabled = !makeSelect.value;
    if(!makeSelect.value) { modelSelect.value = ''; submodelSelect.value = ''; submodelSelect.disabled = true; }
    checkVehicleForm();
  });
  modelSelect.addEventListener('change', () => {
    submodelSelect.disabled = !modelSelect.value;
    if(!modelSelect.value) { submodelSelect.value = ''; }
    checkVehicleForm();
  });
  submodelSelect.addEventListener('change', checkVehicleForm);
  zipInput.addEventListener('input', checkVehicleForm);

  function checkVehicleForm() {
    const allFilled = yearSelect.value && makeSelect.value && modelSelect.value && submodelSelect.value && zipInput.value.trim();
    submitBtn.disabled = !allFilled;
  }

  // Shop Tires - By Tire Size Form Logic
  crossSectionSelect.addEventListener('change', () => {
    aspectRatioSelect.disabled = !crossSectionSelect.value;
    if(!crossSectionSelect.value) { aspectRatioSelect.value = ''; rimDiameterSelect.value = ''; rimDiameterSelect.disabled = true; }
    checkTireSizeForm();
  });
  aspectRatioSelect.addEventListener('change', () => {
    rimDiameterSelect.disabled = !aspectRatioSelect.value;
    if(!aspectRatioSelect.value) { rimDiameterSelect.value = ''; }
    checkTireSizeForm();
  });
  rimDiameterSelect.addEventListener('change', checkTireSizeForm);
  zipInputTireSize.addEventListener('input', checkTireSizeForm);

  function checkTireSizeForm() {
    const allFilled = crossSectionSelect.value && aspectRatioSelect.value && rimDiameterSelect.value && zipInputTireSize.value.trim();
    submitBtnTireSize.disabled = !allFilled;
  }

  vehicleForm.addEventListener('submit', (e) => e.preventDefault());
  tireSizeForm.addEventListener('submit', (e) => e.preventDefault());
}