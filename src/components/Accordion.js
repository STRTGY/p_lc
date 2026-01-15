/**
 * Accordion Component - Progressive Disclosure for long sections
 * Permite mostrar/ocultar contenido para reducir el scroll
 */

/**
 * Crea un accordion/collapsible section
 * @param {Object} config - Configuración del accordion
 * @param {string} config.title - Título del accordion
 * @param {HTMLElement|string} config.content - Contenido a mostrar/ocultar
 * @param {boolean} config.defaultOpen - Si empieza abierto (default: false)
 * @param {string} config.icon - Emoji o icono para el título
 * @returns {HTMLElement}
 */
export function Accordion({ title, content, defaultOpen = false, icon = "📋" }) {
  const container = document.createElement("div");
  container.style.cssText = `
    border: 1px solid var(--theme-foreground-faint, #e5e7eb);
    border-radius: 8px;
    margin: 1rem 0;
    overflow: hidden;
  `;

  // Header (siempre visible, clickeable)
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--theme-background-alt, #f8f9fa);
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;
  `;

  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span style="font-size: 24px;">${icon}</span>
      <span style="font-weight: 600; font-size: 16px;">${title}</span>
    </div>
    <svg style="width: 20px; height: 20px; transition: transform 0.3s; transform: rotate(${defaultOpen ? '180deg' : '0deg'});" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  `;

  // Body (contenido colapsable)
  const body = document.createElement("div");
  body.style.cssText = `
    max-height: ${defaultOpen ? '10000px' : '0'};
    overflow: hidden;
    transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out;
    padding: ${defaultOpen ? '1.5rem' : '0'} 1.5rem;
  `;

  // Si content es string, crear elemento
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else {
    body.appendChild(content);
  }

  // Toggle functionality
  let isOpen = defaultOpen;
  header.addEventListener('click', () => {
    isOpen = !isOpen;
    const arrow = header.querySelector('svg');
    arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    body.style.maxHeight = isOpen ? '10000px' : '0';
    body.style.padding = isOpen ? '1.5rem' : '0 1.5rem';
  });

  // Hover effect
  header.addEventListener('mouseenter', () => {
    header.style.background = 'var(--theme-foreground-faintest, #f0f0f0)';
  });
  header.addEventListener('mouseleave', () => {
    header.style.background = 'var(--theme-background-alt, #f8f9fa)';
  });

  container.appendChild(header);
  container.appendChild(body);

  return container;
}

/**
 * Crea un grupo de accordions donde solo uno puede estar abierto a la vez
 * @param {Array} accordions - Array de configuraciones de accordion
 * @returns {HTMLElement}
 */
export function AccordionGroup(accordions) {
  const group = document.createElement("div");
  group.style.cssText = "display: flex; flex-direction: column; gap: 0.5rem;";

  const accordionElements = [];

  accordions.forEach((config, index) => {
    const acc = Accordion({...config, defaultOpen: index === 0});
    accordionElements.push(acc);

    // Modificar el click handler para cerrar otros accordions
    const header = acc.querySelector('div[style*="cursor: pointer"]');
    const originalClickHandler = header.onclick;
    
    header.addEventListener('click', (e) => {
      // Cerrar todos los demás
      accordionElements.forEach((otherAcc, otherIndex) => {
        if (otherIndex !== index) {
          const otherHeader = otherAcc.querySelector('div[style*="cursor: pointer"]');
          const otherBody = otherAcc.querySelectorAll('div')[1];
          const otherArrow = otherHeader.querySelector('svg');
          
          otherArrow.style.transform = 'rotate(0deg)';
          otherBody.style.maxHeight = '0';
          otherBody.style.padding = '0 1.5rem';
        }
      });
    });

    group.appendChild(acc);
  });

  return group;
}

/**
 * Tabs Component - Alternativa a accordion para contenido categorizado
 * @param {Array} tabs - Array de {label, content, icon}
 * @returns {HTMLElement}
 */
export function Tabs(tabs) {
  const container = document.createElement("div");
  container.style.cssText = "margin: 1rem 0;";

  // Tab headers
  const tabHeaders = document.createElement("div");
  tabHeaders.style.cssText = `
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid var(--theme-foreground-faint, #e5e7eb);
    margin-bottom: 1rem;
  `;

  // Tab contents
  const tabContents = document.createElement("div");

  tabs.forEach((tab, index) => {
    // Create tab button
    const tabButton = document.createElement("button");
    tabButton.style.cssText = `
      padding: 0.75rem 1.5rem;
      border: none;
      background: ${index === 0 ? 'var(--theme-foreground-focus, #3b82f6)' : 'transparent'};
      color: ${index === 0 ? 'white' : 'inherit'};
      font-weight: ${index === 0 ? '600' : '400'};
      cursor: pointer;
      border-radius: 8px 8px 0 0;
      transition: all 0.2s;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;
    tabButton.innerHTML = `${tab.icon || ''} ${tab.label}`;

    // Create tab content
    const tabContent = document.createElement("div");
    tabContent.style.display = index === 0 ? 'block' : 'none';
    
    if (typeof tab.content === 'string') {
      tabContent.innerHTML = tab.content;
    } else {
      tabContent.appendChild(tab.content);
    }

    // Tab click handler
    tabButton.addEventListener('click', () => {
      // Update all buttons and contents
      Array.from(tabHeaders.children).forEach((btn, i) => {
        const isActive = i === index;
        btn.style.background = isActive ? 'var(--theme-foreground-focus, #3b82f6)' : 'transparent';
        btn.style.color = isActive ? 'white' : 'inherit';
        btn.style.fontWeight = isActive ? '600' : '400';
        
        tabContents.children[i].style.display = isActive ? 'block' : 'none';
      });
    });

    // Hover effect
    tabButton.addEventListener('mouseenter', () => {
      if (tabButton.style.background === 'transparent') {
        tabButton.style.background = 'var(--theme-background-alt, #f8f9fa)';
      }
    });
    tabButton.addEventListener('mouseleave', () => {
      if (tabButton.style.color !== 'white') {
        tabButton.style.background = 'transparent';
      }
    });

    tabHeaders.appendChild(tabButton);
    tabContents.appendChild(tabContent);
  });

  container.appendChild(tabHeaders);
  container.appendChild(tabContents);

  return container;
}

