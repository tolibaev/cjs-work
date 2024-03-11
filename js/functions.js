'use strict';


export function createNewCssFileInBlob(fileContent, mediaQueries) {
  const savedClasses = Object.keys(localStorage);

  for (const className of savedClasses) {
    const elementStyle = localStorage.getItem(className);

    fileContent += `${elementStyle}`;
  }

  fileContent += mediaQueries

  // Создания нового CSS-файла
  fileContent = minifyCSS(fileContent);
  const file = new File([fileContent], 'csj.css', {type: 'text/css'});
  const blob = new Blob([file], {type: 'text/css'});
  const fileURL = URL.createObjectURL(blob);

  // Подключение нового CSS-файла к документу
  let link = document.querySelector('link[data-custom-styles]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-custom-styles', '');
    document.head.appendChild(link);
  }
  link.href = fileURL;
  
  return fileContent
}


function minifyCSS(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  css = css.replace(/\s+/g, ' ');

  const rules = css.match(/[^{}]+{[^{}]+}/g);

  if (rules) {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const properties = rule.match(/\{([^{}]+)\}/)[1].trim();
      const uniqueProperties = removeDuplicateProperties(properties);
      css = css.replace(properties, uniqueProperties);
    }
  }

  return css;
}

function removeDuplicateProperties(properties) {
  const propertyMap = {};
  let uniqueProperties = '';

  const propertyPairs = properties.split(';');
  for (let i = 0; i < propertyPairs.length; i++) {
    const pair = propertyPairs[i].trim();
    if (pair) {
      const colonIndex = pair.indexOf(':');
      const property = pair.substring(0, colonIndex).trim();
      const value = pair.substring(colonIndex + 1).trim();
      if (!propertyMap.hasOwnProperty(property)) {
        propertyMap[property] = value;
        uniqueProperties += pair + ';';
      }
    }
  }

  return uniqueProperties.trim();
}


export function handlerDataAttributies() {
  const bodyChildren = document.body.querySelectorAll('[data-bg-image]');
  bodyChildren.forEach(bodyChild => setBgImage(bodyChild));
}
handlerDataAttributies();
function setBgImage(bodyChild) {
  const imageUrl = bodyChild.getAttribute(`data-bg-image`);
  bodyChild.style.backgroundImage = `url(${imageUrl})`;
}
