'use strict';

export function createNewCssFileInBlob(fileContent, mediaQueries) {
  const savedClasses = Object.keys(localStorage);

  const resetStyles =
    ':where(html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video){margin:0;padding:0;border:0}*,::after,::before{box-sizing:border-box}:where(a,a:link,a:visited,a:hover){text-decoration:none;color:inherit}:where(h1,h2,h3,h4,h5,h6,p){font-size:inherit;font-weight:inherit}:where(img){vertical-align:top}:where(address){font-style:normal}:where(mark){color:inherit;background-color:transparent}:where(input,textarea,button,select){font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:0}:where(button){padding:0;border:none;background-color:transparent}:where(input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration){-webkit-appearance:none;-moz-appearance:none}:where(textarea){overflow:auto;vertical-align:top;resize:vertical}:where(label,button){cursor:pointer}:where(legend){display:block}:where(input::-ms-clear){display:none}:where(article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section){display:block}:where(body){line-height:1}:where(ol,ul){list-style:none}:where(blockquote,q){quotes:none}:where(table){border-collapse:collapse;border-spacing:0}:where(fieldset){border:0;margin:0;padding:0}:where(textarea){resize:vertical}';

  fileContent += resetStyles;

  for (const className of savedClasses) {
    const elementStyle = localStorage.getItem(className);

    fileContent += `${elementStyle}`;
  }

  fileContent += mediaQueries;

  filterDoubleBraces(fileContent);

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

  return fileContent;
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

function filterDoubleBraces(css) {
  const regex = /(\}\})/g;
  return css.replace(regex, '}');
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
