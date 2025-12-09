export default function decorate(block) {
  // Do NOT rewrite the DOM when in the Universal Editor (Sidekick present)
  if (window.hlx && window.hlx.sidekick) {
    return;
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
  
  // Extract banner content (rows 0-5)
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
  
  // Helper function to parse store hours text
  function parseStoreHours(hoursText) {
    if (!hoursText) return [];
    
    // Remove "Store Hours: Day(s) Hours " prefix
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
  
  // Helper function to parse address
  function parseAddress(addressText) {
    if (!addressText) return { lines: [], phone: '' };
    
    // Expected format: "406 Gallatin Ave Nashville, TN 615.823.6093"
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
  
  // Extract service details data
  const serviceData = {
    oilChange: {
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
      heading: getFirstText(nestedDivs[46]) || 'SCHEDULE SERVICE',
      storeLabel: getFirstText(nestedDivs[47]) || 'YOUR NEAREST STORE:',
      storeAddressRaw: getFirstText(nestedDivs[48]) || '',
      storeMap: nestedDivs[49]?.querySelector('img')?.src || '',
      storeHoursRaw: getFirstText(nestedDivs[50]) || '',
      storeDetailsLink: getFirstLink(nestedDivs[51]) || '#',
      storeDetailsText: getFirstText(nestedDivs[52]) || 'STORE DETAILS',
      changeStoreLink: getFirstLink(nestedDivs[53]) || '#',
      changeStoreText: getFirstText(nestedDivs[54]) || 'CHANGE STORE',
      appointmentLink: getFirstLink(nestedDivs[55]) || '#',
      appointmentText: getFirstText(nestedDivs[56]) || 'SCHEDULE AN APPOINTMENT',
    },
    alignment: {
      heading: 'ALIGNMENT SERVICE',
      storeLabel: 'YOUR NEAREST STORE:',
      storeAddressRaw: '406 Gallatin Ave Nashville, TN 615.823.6093',
      storeMap: '',
      storeHoursRaw:
        'Store Hours: Day(s) Hours MON-FRI: 7:00am-7:00pm SAT: 7:00am-6:00pm SUN: 8:00am-5:00pm Christmas Eve: 8:00am-4:00pm Christmas: Closed',
      storeDetailsLink: '#',
      storeDetailsText: 'STORE DETAILS',
      changeStoreLink: '#',
      changeStoreText: 'CHANGE STORE',
      appointmentLink: '#',
      appointmentText: 'SCHEDULE AN APPOINTMENT',
    },
  };
  
  // Clear block
  block.innerHTML = '';
  
  // Create main container
  const heroSection = document.createElement('section');
  heroSection.className = 'hero-fcac-section';
  
  // Create image wrap (background)
  const imageWrap = document.createElement('div');
  imageWrap.className = 'hero-image-wrap';
  
  if (heroPicture) {
    const clonedPicture = heroPicture.cloneNode(true);
    imageWrap.appendChild(clonedPicture);
  }
  
  // Create widget wrap (overlay on left)
  const widgetWrap = document.createElement('div');
  widgetWrap.className = 'hero-widget-wrap';
  
  // Create main tabs (top horizontal)
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
  
  // Create tab navigation (left vertical - for Get Services)
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
  
  // Create tab content (forms/content)
  const tabContent = document.createElement('div');
  tabContent.className = 'hero-tab-content';
  
  // Shop Tires Section
  const tireSection = document.createElement('section');
  tireSection.className = 'tire-search-widget active';
  
  // Inner tabs for By Vehicle / By Tire Size
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
  
  // Inner tab content
  const innerTabContent = document.createElement('div');
  innerTabContent.className = 'inner-tab-content';
  
  const requiredText = document.createElement('p');
  requiredText.className = 'required-text';
  requiredText.textContent = 'All fields are required';
  
  // By Vehicle Form
  const byVehicleSection = document.createElement('section');
  byVehicleSection.className = 'active';
  
  const vehicleForm = document.createElement('form');
  vehicleForm.className = 'search-by-vehicle';
  
  // Year
  const yearField = document.createElement('div');
  yearField.className = 'form-field';
  const yearLabel = document.createElement('label');
  yearLabel.setAttribute('for', 'year');
  yearLabel.textContent = 'Year';
  const yearSelectDiv = document.createElement('div');
  yearSelectDiv.className = 'custom-select';
  const yearSelect = document.createElement('select');
  yearSelect.id = 'year';
  yearSelect.name = 'year';
  const yearOption = document.createElement('option');
  yearOption.value = '';
  yearOption.textContent = '--Select--';
  yearSelect.appendChild(yearOption);
  yearSelectDiv.appendChild(yearSelect);
  yearField.appendChild(yearLabel);
  yearField.appendChild(yearSelectDiv);
  
  // Make
  const makeField = document.createElement('div');
  makeField.className = 'form-field';
  const makeLabel = document.createElement('label');
  makeLabel.setAttribute('for', 'make');
  makeLabel.textContent = 'Make';
  const makeSelectDiv = document.createElement('div');
  makeSelectDiv.className = 'custom-select';
  const makeSelect = document.createElement('select');
  makeSelect.id = 'make';
  makeSelect.name = 'make';
  makeSelect.disabled = true;
  const makeOption = document.createElement('option');
  makeOption.value = '';
  makeOption.textContent = '--Select--';
  makeSelect.appendChild(makeOption);
  makeSelectDiv.appendChild(makeSelect);
  makeField.appendChild(makeLabel);
  makeField.appendChild(makeSelectDiv);
  
  // Model
  const modelField = document.createElement('div');
  modelField.className = 'form-field';
  const modelLabel = document.createElement('label');
  modelLabel.setAttribute('for', 'model');
  modelLabel.textContent = 'Model';
  const modelSelectDiv = document.createElement('div');
  modelSelectDiv.className = 'custom-select';
  const modelSelect = document.createElement('select');
  modelSelect.id = 'model';
  modelSelect.name = 'model';
  modelSelect.disabled = true;
  const modelOption = document.createElement('option');
  modelOption.value = '';
  modelOption.textContent = '--Select--';
  modelSelect.appendChild(modelOption);
  modelSelectDiv.appendChild(modelSelect);
  modelField.appendChild(modelLabel);
  modelField.appendChild(modelSelectDiv);
  
  // Submodel
  const submodelField = document.createElement('div');
  submodelField.className = 'form-field';
  const submodelLabel = document.createElement('label');
  submodelLabel.setAttribute('for', 'submodel');
  submodelLabel.textContent = 'Submodel';
  const submodelSelectDiv = document.createElement('div');
  submodelSelectDiv.className = 'custom-select';
  const submodelSelect = document.createElement('select');
  submodelSelect.id = 'submodel';
  submodelSelect.name = 'submodel';
  submodelSelect.disabled = true;
  const submodelOption = document.createElement('option');
  submodelOption.value = '';
  submodelOption.textContent = '--Select--';
  submodelSelect.appendChild(submodelOption);
  submodelSelectDiv.appendChild(submodelSelect);
  submodelField.appendChild(submodelLabel);
  submodelField.appendChild(submodelSelectDiv);
  
  // Zip Code
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
  zipInput.disabled = true;
  const whyLink = document.createElement('a');
  whyLink.href = '#';
  whyLink.className = 'why-link';
  whyLink.textContent = 'Why?';
  zipWrapper.appendChild(zipInput);
  zipWrapper.appendChild(whyLink);
  zipField.appendChild(zipLabel);
  zipField.appendChild(zipWrapper);
  
  // Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn-submit';
  submitBtn.textContent = getTirePricingBtn;
  submitBtn.disabled = true;
  
  vehicleForm.appendChild(yearField);
  vehicleForm.appendChild(makeField);
  vehicleForm.appendChild(modelField);
  vehicleForm.appendChild(submodelField);
  vehicleForm.appendChild(zipField);
  vehicleForm.appendChild(submitBtn);
  
  byVehicleSection.appendChild(vehicleForm);
  
  // By Tire Size Form
  const byTireSizeSection = document.createElement('section');
  
  const tireSizeForm = document.createElement('form');
  tireSizeForm.className = 'search-by-vehicle';
  
  // Cross Section
  const crossSectionField = document.createElement('div');
  crossSectionField.className = 'form-field';
  const crossSectionLabel = document.createElement('label');
  crossSectionLabel.setAttribute('for', 'cross-section');
  crossSectionLabel.textContent = 'Cross Section';
  const crossSectionSelectDiv = document.createElement('div');
  crossSectionSelectDiv.className = 'custom-select';
  const crossSectionSelect = document.createElement('select');
  crossSectionSelect.id = 'cross-section';
  crossSectionSelect.name = 'cross-section';
  const crossSectionOption = document.createElement('option');
  crossSectionOption.value = '';
  crossSectionOption.textContent = '--Select--';
  crossSectionSelect.appendChild(crossSectionOption);
  crossSectionSelectDiv.appendChild(crossSectionSelect);
  crossSectionField.appendChild(crossSectionLabel);
  crossSectionField.appendChild(crossSectionSelectDiv);
  
  // Aspect Ratio
  const aspectRatioField = document.createElement('div');
  aspectRatioField.className = 'form-field';
  const aspectRatioLabel = document.createElement('label');
  aspectRatioLabel.setAttribute('for', 'aspect-ratio');
  aspectRatioLabel.textContent = 'Aspect Ratio';
  const aspectRatioSelectDiv = document.createElement('div');
  aspectRatioSelectDiv.className = 'custom-select';
  const aspectRatioSelect = document.createElement('select');
  aspectRatioSelect.id = 'aspect-ratio';
  aspectRatioSelect.name = 'aspect-ratio';
  aspectRatioSelect.disabled = true;
  const aspectRatioOption = document.createElement('option');
  aspectRatioOption.value = '';
  aspectRatioOption.textContent = '--Select--';
  aspectRatioSelect.appendChild(aspectRatioOption);
  aspectRatioSelectDiv.appendChild(aspectRatioSelect);
  aspectRatioField.appendChild(aspectRatioLabel);
  aspectRatioField.appendChild(aspectRatioSelectDiv);
  
  // Rim Diameter
  const rimDiameterField = document.createElement('div');
  rimDiameterField.className = 'form-field';
  const rimDiameterLabel = document.createElement('label');
  rimDiameterLabel.setAttribute('for', 'rim-diameter');
  rimDiameterLabel.textContent = 'Rim Diameter';
  const rimDiameterSelectDiv = document.createElement('div');
  rimDiameterSelectDiv.className = 'custom-select';
  const rimDiameterSelect = document.createElement('select');
  rimDiameterSelect.id = 'rim-diameter';
  rimDiameterSelect.name = 'rim-diameter';
  rimDiameterSelect.disabled = true;
  const rimDiameterOption = document.createElement('option');
  rimDiameterOption.value = '';
  rimDiameterOption.textContent = '--Select--';
  rimDiameterSelect.appendChild(rimDiameterOption);
  rimDiameterSelectDiv.appendChild(rimDiameterSelect);
  rimDiameterField.appendChild(rimDiameterLabel);
  rimDiameterField.appendChild(rimDiameterSelectDiv);
  
  // Zip Code for Tire Size
  const zipFieldTireSize = document.createElement('div');
  zipFieldTireSize.className = 'form-field';
  const zipLabelTireSize = document.createElement('label');
  zipLabelTireSize.setAttribute('for', 'zipcode-tire-size');
  zipLabelTireSize.textContent = 'Zip Code';
  const zipWrapperTireSize = document.createElement('div');
  zipWrapperTireSize.className = 'zip-wrapper';
  const zipInputTireSize = document.createElement('input');
  zipInputTireSize.type = 'text';
  zipInputTireSize.id = 'zipcode-tire-size';
  zipInputTireSize.name = 'zip-tire-size';
  zipInputTireSize.value = zipCode;
  zipInputTireSize.className = 'zip-input';
  zipInputTireSize.disabled = true;
  const whyLinkTireSize = document.createElement('a');
  whyLinkTireSize.href = '#';
  whyLinkTireSize.className = 'why-link';
  whyLinkTireSize.textContent = 'Why?';
  zipWrapperTireSize.appendChild(zipInputTireSize);
  zipWrapperTireSize.appendChild(whyLinkTireSize);
  zipFieldTireSize.appendChild(zipLabelTireSize);
  zipFieldTireSize.appendChild(zipWrapperTireSize);
  
  // Submit Button for Tire Size
  const submitBtnTireSize = document.createElement('button');
  submitBtnTireSize.type = 'submit';
  submitBtnTireSize.className = 'btn-submit';
  submitBtnTireSize.textContent = getTirePricingBtn;
  submitBtnTireSize.disabled = true;
  
  tireSizeForm.appendChild(crossSectionField);
  tireSizeForm.appendChild(aspectRatioField);
  tireSizeForm.appendChild(rimDiameterField);
  tireSizeForm.appendChild(zipFieldTireSize);
  tireSizeForm.appendChild(submitBtnTireSize);
  
  byTireSizeSection.appendChild(tireSizeForm);
  
  innerTabContent.appendChild(requiredText);
  innerTabContent.appendChild(byVehicleSection);
  innerTabContent.appendChild(byTireSizeSection);
  
  innerTabs.appendChild(innerTabNav);
  innerTabs.appendChild(innerTabContent);
  
  tireSection.appendChild(innerTabs);
  
  tabContent.appendChild(tireSection);
  
  // Create Service Detail View (hidden initially)
  const serviceDetailView = document.createElement('section');
  serviceDetailView.className = 'service-detail-view';
  serviceDetailView.style.display = 'none';
  
  tabContent.appendChild(serviceDetailView);
  
  // Function to create service detail content
  function createServiceDetail(serviceName, data) {
    serviceDetailView.innerHTML = '';
    
    const addressData = parseAddress(data.storeAddressRaw);
    const hoursData = parseStoreHours(data.storeHoursRaw);
    
    const header = document.createElement('div');
    header.className = 'service-detail-header';
    
    const title = document.createElement('h2');
    title.textContent = data.heading;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'service-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
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
      mapImg.alt = 'Store location map';
      
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
        
        hourRow.appendChild(daySpan);
        hourRow.appendChild(timeSpan);
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
    
    buttonsDiv.appendChild(storeDetailsBtn);
    buttonsDiv.appendChild(changeStoreBtn);
    
    const appointmentDiv = document.createElement('div');
    appointmentDiv.className = 'service-appointment';
    
    const appointmentBtn = document.createElement('a');
    appointmentBtn.href = data.appointmentLink;
    appointmentBtn.className = 'btn-primary';
    appointmentBtn.textContent = data.appointmentText;
    
    appointmentDiv.appendChild(appointmentBtn);
    
    closeBtn.addEventListener('click', () => {
      serviceDetailView.style.display = 'none';
      topNav.style.display = 'block';
      tabNav.style.display = 'block';
    });
    
    serviceDetailView.appendChild(header);
    serviceDetailView.appendChild(storeInfo);
    serviceDetailView.appendChild(buttonsDiv);
    serviceDetailView.appendChild(appointmentDiv);
  }
  
  // Assemble widget
  widgetWrap.appendChild(topNav);
  widgetWrap.appendChild(tabNav);
  widgetWrap.appendChild(tabContent);
  
  // Create copy overlay (right side)
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
  
  descriptionDiv.appendChild(descriptionContent);
  descriptionDiv.appendChild(ctaButton);
  
  copyOverlay.appendChild(mainHeading);
  copyOverlay.appendChild(descriptionDiv);
  
  // Assemble everything
  heroSection.appendChild(imageWrap);
  heroSection.appendChild(widgetWrap);
  heroSection.appendChild(copyOverlay);
  
  block.appendChild(heroSection);
  
  // Tab switching logic
  const topNavItems = topNavList.querySelectorAll('li');
  
  topNavItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      topNavItems.forEach((li) => li.classList.remove('active'));
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
  
  // Service item click handler
  const serviceItems = tabNavList.querySelectorAll('li');
  serviceItems.forEach((item) => {
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
  
  // Inner tab switching
  const innerTabItems = innerTabList.querySelectorAll('li');
  const innerTabSections = innerTabContent.querySelectorAll('section');
  
  innerTabItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      innerTabItems.forEach((li) => li.classList.remove('active'));
      item.classList.add('active');
      
      innerTabSections.forEach((section, sIndex) => {
        section.classList.toggle('active', sIndex === index);
      });
    });
  });
  
  // By Vehicle Form Logic
  yearSelect.addEventListener('change', function onYearChange() {
    makeSelect.disabled = this.value === '';
    if (this.value === '') {
      makeSelect.value = '';
      modelSelect.value = '';
      submodelSelect.value = '';
      modelSelect.disabled = true;
      submodelSelect.disabled = true;
    }
    checkVehicleForm();
  });
  
  makeSelect.addEventListener('change', function onMakeChange() {
    modelSelect.disabled = this.value === '';
    if (this.value === '') {
      modelSelect.value = '';
      submodelSelect.value = '';
      submodelSelect.disabled = true;
    }
    checkVehicleForm();
  });
  
  modelSelect.addEventListener('change', function onModelChange() {
    submodelSelect.disabled = this.value === '';
    if (this.value === '') {
      submodelSelect.value = '';
    }
    checkVehicleForm();
  });
  
  submodelSelect.addEventListener('change', checkVehicleForm);
  zipInput.addEventListener('input', checkVehicleForm);
  
  function checkVehicleForm() {
    const allFilled =
      yearSelect.value !== '' &&
      makeSelect.value !== '' &&
      modelSelect.value !== '' &&
      submodelSelect.value !== '' &&
      zipInput.value.trim() !== '';
    submitBtn.disabled = !allFilled;
  }
  
  // By Tire Size Form Logic
  crossSectionSelect.addEventListener('change', function onCrossSectionChange() {
    aspectRatioSelect.disabled = this.value === '';
    if (this.value === '') {
      aspectRatioSelect.value = '';
      rimDiameterSelect.value = '';
      rimDiameterSelect.disabled = true;
    }
    checkTireSizeForm();
  });
  
  aspectRatioSelect.addEventListener('change', function onAspectRatioChange() {
    rimDiameterSelect.disabled = this.value === '';
    if (this.value === '') {
      rimDiameterSelect.value = '';
    }
    checkTireSizeForm();
  });
  
  rimDiameterSelect.addEventListener('change', checkTireSizeForm);
  zipInputTireSize.addEventListener('input', checkTireSizeForm);
  
  function checkTireSizeForm() {
    const allFilled =
      crossSectionSelect.value !== '' &&
      aspectRatioSelect.value !== '' &&
      rimDiameterSelect.value !== '' &&
      zipInputTireSize.value.trim() !== '';
    submitBtnTireSize.disabled = !allFilled;
  }
  
  // Prevent form submissions
  vehicleForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  
  tireSizeForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}
