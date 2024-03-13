'use strict';
import {arrayWithCssStylesWithoutNumbersValue} from './arrays/withoutNumbersValue.js';
import {arrayWithMoreNumbresValues} from './arrays/moreValues.js';
import {arrayWidthDisplayProprties} from './arrays/widthDisplayProprties.js';
import {arrayWidthTransformValues} from './arrays/widthTransformValues.js';
import {arrayWithHorizontalCssStyles} from './arrays/withHorizontalCssStyles.js';
import {arrayWithVerticalCssStyles} from './arrays/withVerticalCssStyles.js';
import {createNewCssFileInBlob} from './functions.js';
import {arrayWithFilterProperties} from './arrays/withFilterProperties.js';
import {valuesFromDataAttributes} from './arrays/inDataAttributes.js';


export function applyStyles(rootElement, options) {
  localStorage.clear();

  options.unit ??= 'px';
  options.initialWidth ??= 1920;
  options.finalWidth ??= 320;
  options.containerPadding ??= 20;
  options.maxWidthContainer ??= 1600;
  options.containerSize ??= options.maxWidthContainer + options.containerPadding * 2;

  const wrapper = document.querySelector(rootElement);
  const elements = wrapper.querySelectorAll('[class]');

  let className = '',
  fileContent = '',
  hoverStyles = '',
  activeStyles = '',
  focusStyles = '',
  focusVisibleStyles = '',
  visitedStyles = '',
  placeholderStyles = '',
  maxWidthMediaQuaries = '',
  minWidthMediaQuaries = '',
  maxHeightMediaQuaries = '',
  minHeightMediaQuaries = '',
  afterStyles = '',
  beforeStyles = '';

   let mediaQueries = '';

  const html = document.documentElement;
  const htmlFontSize = parseInt(window.getComputedStyle(html).fontSize);
  function callBuilderFunctionsWithNumbresValue(array, fun) {
   array.forEach(element => fun(`${element.property}`, `${element.abbreviation}`, options.unit));
  }
  function callBuilderFunctionsWithoutNumbresValue(array, fun) {
    array.forEach(element => fun(`${element.property}`, `${element.abbreviation}`));
  }

  for (let element of elements) {
    const classes = element.classList;
    const dataAttributes = element.dataset;

    for (className of classes) {
      callBuilderFunctionsWithNumbresValue(arrayWithMoreNumbresValues, builderPropertyWithMoreValues);
      callBuilderFunctionsWithNumbresValue(arrayWithVerticalCssStyles, builderPropertyWithVerticalValues);
      callBuilderFunctionsWithNumbresValue(arrayWithHorizontalCssStyles, builderPropertyWithHorizontalValues);
      callBuilderFunctionsWithNumbresValue(arrayWidthTransformValues, builderTransformProperties);
      callBuilderFunctionsWithNumbresValue(arrayWithFilterProperties, builderFilterProperties);
      callBuilderFunctionsWithoutNumbresValue(arrayWidthDisplayProprties, builderValuesWithDisplayProperties);
      callBuilderFunctionsWithoutNumbresValue(
        arrayWithCssStylesWithoutNumbersValue,
        builderPropertyWithoutNumbresValues
      );
    }
    for (let key in dataAttributes) {
       const value = dataAttributes[key];
       const valuesArray = value.split(' ');
       valuesArray.forEach(property => {
         const objectWithPropsAndAbbr = [...arrayWidthDisplayProprties, ...valuesFromDataAttributes].find(
           valueFromDataAttribute => {
             const abbreviationRegex = new RegExp(`^${valueFromDataAttribute.abbreviation}`);
             if (abbreviationRegex.test(property))
               return {
                 property: valueFromDataAttribute.property,
                 abbreviation: valueFromDataAttribute.abbreviation,
               };
           }
         );
         if (key === 'hover') setPseudoClasses(key, hoverStyles);
         if (key === 'active') setPseudoClasses(key, activeStyles);
         if (key === 'focus') setPseudoClasses(key, focusStyles);
         if (key === 'focusVisible') setPseudoClasses(key, focusVisibleStyles);
         if (key === 'visited') setPseudoClasses(key, visitedStyles);
         if (key === 'placeholder') setPseudoClasses(key, visitedStyles);
         if (key === 'after') setPseudoClasses(key, afterStyles);
         if (key === 'before') setPseudoClasses(key, beforeStyles);
         if (key.includes('maxW')) setPseudoClasses(key, maxWidthMediaQuaries);
         if (key.includes('minW')) setPseudoClasses(key, minWidthMediaQuaries);
         if (key.includes('maxH')) setPseudoClasses(key, maxHeightMediaQuaries);
         if (key.includes('minH')) setPseudoClasses(key, minHeightMediaQuaries);
 
         function setPseudoClasses(key, storageVariable) {
           let style = '';
           let firstClassName = element.classList[0];
           let propertyValue = property.replace(`${objectWithPropsAndAbbr.abbreviation}-`, '');
           if (objectWithPropsAndAbbr.abbreviation === 'color' || objectWithPropsAndAbbr.abbreviation === 'bg-color') {
             storageVariable += `${objectWithPropsAndAbbr.property}: #${propertyValue};`;
           }
           if (objectWithPropsAndAbbr.abbreviation === 'opacity') {
             propertyValue = propertyValue / 100;
             storageVariable += `${objectWithPropsAndAbbr.property}: ${objectWithPropsAndAbbr.abbreviation}(${propertyValue});`;
           }
 
           if (objectWithPropsAndAbbr.abbreviation === 'translate-') {
             const values = removeLetters(propertyValue.split('-'));
             const [coorX, coorY] = values;
             style = `${coorX}px ${coorY}px`;
             if (options.unit === 'rem') style = `${coorX / htmlFontSize}rem ${coorY / htmlFontSize}rem`;
             if (options.unit === 'em') style = `${coorX}em ${coorY}em`;
 
             const regex = /(vw|vh|dvw|dvh|%)$/;
 
             if (regex.test(coorX)) {
               style = `${coorX} ${coorY}px`;
               if (options.unit === 'rem') style = `${coorX} ${coorY / htmlFontSize}rem`;
               if (options.unit === 'em') style = `${coorX} ${coorY}em`;
             }
             if (regex.test(coorY)) {
               style = `${coorX}px ${coorY}`;
               if (options.unit === 'rem') style = `${coorX / htmlFontSize}rem ${coorY}`;
               if (options.unit === 'em') style = `${coorX}em ${coorY}`;
             }
             if (regex.test(coorX) && regex.test(coorY)) style = `${coorX} ${coorY}`;
 
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'translateX' ||
             objectWithPropsAndAbbr.abbreviation === 'translateY'
           ) {
             propertyValue = property.replace(`${objectWithPropsAndAbbr.abbreviation}`, '');
             const value = removeLetters(propertyValue.split('-'));
 
             style = `${value}px`;
             if (options.unit === 'rem') style = `${value / htmlFontSize}rem`;
             if (options.unit === 'em') style = `${value}em`;
 
             const regex = /(vw|vh|dvw|dvh|%)$/;
 
             if (regex.test(propertyValue)) style = `${propertyValue}`;
 
             storageVariable += `${objectWithPropsAndAbbr.property}: ${objectWithPropsAndAbbr.abbreviation}(${style});`;
           }
 
           if (objectWithPropsAndAbbr.abbreviation === 'scale-') {
             propertyValue = property.replace(`${objectWithPropsAndAbbr.abbreviation}`, '');
             const value = removeLetters(propertyValue.split('-'));
             style = `${value / 10}`;
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'scaleX' ||
             objectWithPropsAndAbbr.abbreviation === 'scaleY' ||
             objectWithPropsAndAbbr.abbreviation === 'scaleZ'
           ) {
             style = `${propertyValue / 10}`;
             storageVariable += `${objectWithPropsAndAbbr.property}: ${objectWithPropsAndAbbr.abbreviation}(${style});`;
           }
 
           if (objectWithPropsAndAbbr.abbreviation === 'rotate-') {
             propertyValue = property.replace(`${objectWithPropsAndAbbr.abbreviation}`, '');
             const value = removeLetters(propertyValue.split('-'));
             style = `${value}deg`;
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'rotateX' ||
             objectWithPropsAndAbbr.abbreviation === 'rotateY' ||
             objectWithPropsAndAbbr.abbreviation === 'rotateZ'
           ) {
             const value = removeLetters(propertyValue.split('-'));
             style = `${value}deg`;
             storageVariable += `${objectWithPropsAndAbbr.property}: ${objectWithPropsAndAbbr.abbreviation}(${style});`;
           }
 
           if (objectWithPropsAndAbbr.abbreviation === 'skew-') {
             propertyValue = property.replace(`${objectWithPropsAndAbbr.abbreviation}`, '');
             const values = removeLetters(propertyValue.split('-'));
             if (values.length === 1) {
               const [aX] = values;
               style = `${aX}deg`;
             }
             if (values.length === 2) {
               const [aX, aY] = values;
               style = `${aX}deg, ${aY}deg`;
             }
             storageVariable += `${objectWithPropsAndAbbr.property}: skew(${style});`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'skewX' ||
             objectWithPropsAndAbbr.abbreviation === 'skewY' ||
             objectWithPropsAndAbbr.abbreviation === 'skewZ'
           ) {
             const values = removeLetters(propertyValue.split('-'));
             style = `${values}deg`;
             storageVariable += `${objectWithPropsAndAbbr.property}: ${objectWithPropsAndAbbr.abbreviation}(${style});`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'hue-rot' ||
             objectWithPropsAndAbbr.abbreviation === 'bd-hue-rot'
           ) {
             const values = removeLetters(propertyValue.split('-'));
             style = `${values}deg`;
             storageVariable += `${objectWithPropsAndAbbr.property}: hue-rotate(${style});`;
           }
 
           if (objectWithPropsAndAbbr.abbreviation === 'b-shadow') {
             const values = removeLetters(propertyValue.split('-'));
             let [offsetX, offsetY, blurRadius, spreadRadius, color] = values;
             style = `${offsetX}${options.unit} ${offsetY}${options.unit} ${blurRadius}${options.unit} ${spreadRadius}${options.unit} #${color}`;
             if (options.unit === 'rem') {
               style = `${offsetX / htmlFontSize}rem
                ${offsetY / htmlFontSize}rem
                ${blurRadius / htmlFontSize}rem
                ${spreadRadius / htmlFontSize}rem
                #${color}`;
             }
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 't-shadow' ||
             objectWithPropsAndAbbr.abbreviation === 'd-shadow'
           ) {
             const values = removeLetters(propertyValue.split('-'));
             let [offsetX, offsetY, blurRadius, color] = values;
 
             style = `${offsetX}${options.unit} ${offsetY}${options.unit} ${blurRadius}${options.unit} #${color}`;
             if (options.unit === 'rem') {
               style = `${offsetX / htmlFontSize}rem
              ${offsetY / htmlFontSize}rem
              ${blurRadius / htmlFontSize}rem
              #${color}`;
             }
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
 
             if (objectWithPropsAndAbbr.abbreviation === 'd-shadow')
               storageVariable += `${objectWithPropsAndAbbr.property}: drop-shadow(${style});`;
           }
 
           if (objectWithPropsAndAbbr.abbreviation === 'text-dec') {
             const values = removePropertyName(propertyValue, objectWithPropsAndAbbr.abbreviation);
             storageVariable += `${objectWithPropsAndAbbr.property}: ${values};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'm-' ||
             objectWithPropsAndAbbr.abbreviation === 'p-' ||
             objectWithPropsAndAbbr.abbreviation === 'w-' ||
             objectWithPropsAndAbbr.abbreviation === 'h-'
           ) {
             propertyValue = property.replace(`${objectWithPropsAndAbbr.abbreviation}`, '');
             const values = removeLetters(propertyValue.split('-'));
             const positiveRelativeUnits = /(vw|vh|dvw|dvh|%)$/;
             style = `${values[0]}`;
             if (!positiveRelativeUnits.test(values[0])) {
               style = `${values[0]}${options.unit}`;
               if (options.unit === 'rem') style = `${value / htmlFontSize}rem`;
             }
 
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'mt' ||
             objectWithPropsAndAbbr.abbreviation === 'pt' ||
             objectWithPropsAndAbbr.abbreviation === 'ml' ||
             objectWithPropsAndAbbr.abbreviation === 'pl' ||
             objectWithPropsAndAbbr.abbreviation === 'mb' ||
             objectWithPropsAndAbbr.abbreviation === 'pb' ||
             objectWithPropsAndAbbr.abbreviation === 'mr' ||
             objectWithPropsAndAbbr.abbreviation === 'pr' ||
             objectWithPropsAndAbbr.abbreviation === 'top' ||
             objectWithPropsAndAbbr.abbreviation === 'left' ||
             objectWithPropsAndAbbr.abbreviation === 'bottom' ||
             objectWithPropsAndAbbr.abbreviation === 'right' ||
             objectWithPropsAndAbbr.abbreviation === 'sc-padding' ||
             objectWithPropsAndAbbr.abbreviation === 'sc-margin' ||
             objectWithPropsAndAbbr.abbreviation === 'max-w' ||
             objectWithPropsAndAbbr.abbreviation === 'max-h' ||
             objectWithPropsAndAbbr.abbreviation === 'min-w' ||
             objectWithPropsAndAbbr.abbreviation === 'min-h' ||
             objectWithPropsAndAbbr.abbreviation === 'line-h' ||
             objectWithPropsAndAbbr.abbreviation === 'letter-s' ||
             objectWithPropsAndAbbr.abbreviation === 'word-s' ||
             objectWithPropsAndAbbr.abbreviation === 'indent' ||
             objectWithPropsAndAbbr.abbreviation === 'gap' ||
             objectWithPropsAndAbbr.abbreviation === 'col-gap' ||
             objectWithPropsAndAbbr.abbreviation === 'r-gap' ||
             objectWithPropsAndAbbr.abbreviation === 'basis' ||
             objectWithPropsAndAbbr.abbreviation === 'radius' ||
             objectWithPropsAndAbbr.abbreviation === 'bor-width' ||
             objectWithPropsAndAbbr.abbreviation === 'bor-left-width' ||
             objectWithPropsAndAbbr.abbreviation === 'bor-right-width' ||
             objectWithPropsAndAbbr.abbreviation === 'bor-top-width' ||
             objectWithPropsAndAbbr.abbreviation === 'bor-bot-width' ||
             objectWithPropsAndAbbr.abbreviation === 'basis' ||
             objectWithPropsAndAbbr.abbreviation === 'f-size'
           ) {
             const values = removeLetters(propertyValue.split('-'));
             const positiveRelativeUnits = /(vw|vh|dvw|dvh|%)$/;
             style = `${values[0]}`;
             if (!positiveRelativeUnits.test(values[0])) {
               style = `${values[0]}${options.unit}`;
               if (options.unit === 'rem') style = `${values[0] / htmlFontSize}rem`;
             }
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           const regex = /^bor-sp/;
           if (regex.test(objectWithPropsAndAbbr.abbreviation)) {
             const values = removeLetters(propertyValue.split('-'));
             const positiveRelativeUnits = /(vw|vh|dvw|dvh|%)$/;
 
             const verticalValue = /^bor-sp-x/;
             const horizontalValue = /^bor-sp-y/;
             style = `${values[0]}`;
 
             if (!positiveRelativeUnits.test(values[0])) {
               if (verticalValue.test(objectWithPropsAndAbbr.abbreviation)) {
                 style = `${values[0]}${options.unit} 0`;
                 if (options.unit === 'rem') style = `${values[0] / htmlFontSize}rem 0`;
               }
               if (horizontalValue.test(objectWithPropsAndAbbr.abbreviation)) {
                 style = `0 ${values[0]}${options.unit}`;
                 if (options.unit === 'rem') style = `0 ${values[0] / htmlFontSize}rem`;
               }
             }
             storageVariable += `${objectWithPropsAndAbbr.property}: ${style};`;
           }
 
           if (
             objectWithPropsAndAbbr.abbreviation === 'font-w' ||
             objectWithPropsAndAbbr.abbreviation === 'shrink' ||
             objectWithPropsAndAbbr.abbreviation === 'order' ||
             objectWithPropsAndAbbr.abbreviation === 'col-start' ||
             objectWithPropsAndAbbr.abbreviation === 'col-end' ||
             objectWithPropsAndAbbr.abbreviation === 'row-start' ||
             objectWithPropsAndAbbr.abbreviation === 'row-end' ||
             objectWithPropsAndAbbr.abbreviation === 'grow'
           )
             storageVariable += `${objectWithPropsAndAbbr.property}: ${propertyValue};`;
 
           if (objectWithPropsAndAbbr.abbreviation === 'g-cols' || objectWithPropsAndAbbr.abbreviation === 'g-rows')
             storageVariable += `${objectWithPropsAndAbbr.property}: repeat(${propertyValue}, minmax(0, 1fr))`;
 
           if (objectWithPropsAndAbbr.property.includes('display'))
             storageVariable += `${objectWithPropsAndAbbr.property};`;
 
           if (key === 'hover') hoverStyles = storageVariable;
           if (key === 'active') activeStyles = storageVariable;
           if (key === 'focus') focusStyles = storageVariable;
           if (key === 'focusVisible') focusVisibleStyles = storageVariable;
           if (key === 'visited') visitedStyles = storageVariable;
           if (key === 'placeholder') placeholderStyles = storageVariable;
 
           if (key === 'focusVisible') key = 'focus-visible';
 
           if (key.includes('hover')) {
             const pseudoClassMediaQuery = `@media (any-hover: hover) {.${firstClassName}:${key}{${storageVariable}}}`;
             localStorage.setItem(`.${firstClassName}:${key}`, pseudoClassMediaQuery);
           }
           if(key.includes('active') || key.includes('focus') || key.includes('focusVisible') || key.includes('visited')){
            const pseudoClassMediaQuery = `.${firstClassName}:${key}{${storageVariable}}`;
             localStorage.setItem(`.${firstClassName}:${key}`, pseudoClassMediaQuery);
           }
           if(key.includes('placeholder')){
            const pseudoClassMediaQuery = `.${firstClassName}::${key}{${storageVariable}}`;
             localStorage.setItem(`.${firstClassName}:${key}`, pseudoClassMediaQuery);
           }
           if(key.includes('after') || key.includes('before')){
            const pseudoClassMediaQuery = `.${firstClassName}::${key}{content:'';${storageVariable}}`;
             localStorage.setItem(`.${firstClassName}:${key}`, pseudoClassMediaQuery);
           }

 
           if (key.includes('maxW')) {
             const queriesValue = key.replace(/[^0-9]/g, '');
             key = 'max-width';
 
             const sizesMediaQuery = `@media (${key}: ${queriesValue}px) {.${firstClassName}{${storageVariable}}}`;

             mediaQueries += sizesMediaQuery;
           }
 
           if (key.includes('minW')) {
             const queriesValue = key.replace(/[^0-9]/g, '');
             key = 'min-width';
            
             const sizesMediaQuery = `@media (${key}: ${queriesValue}px) {.${firstClassName}{${storageVariable}}}`;
             
             mediaQueries += sizesMediaQuery;
           }
 
           if (key.includes('maxH')) {
             const queriesValue = key.replace(/[^0-9]/g, '');
             key = 'max-height';
 
             const sizesMediaQuery = `@media (${key}: ${queriesValue}px) {.${firstClassName}{${storageVariable}}}`;

             mediaQueries += sizesMediaQuery;
           }
           
           if (key.includes('minH')) {
             const queriesValue = key.replace(/[^0-9]/g, '');
             key = 'min-height';
 
             const sizesMediaQuery = `@media (${key}: ${queriesValue}px) {.${firstClassName}{${storageVariable}}}`;

             mediaQueries += sizesMediaQuery;
           }
         }
       });
       hoverStyles = '';
       activeStyles = '';
       focusStyles = '';
       focusVisibleStyles = '';
       visitedStyles = '';
       placeholderStyles = '';
       afterStyles = '';
       beforeStyles = '';
   }
  }

  function builderPropertyWithMoreValues(property, abbreviationForProperty, unit) {
    conditionsForAddingNewPropertiesWithMoreValue(property, abbreviationForProperty, unit, 'more');
  }
  function builderPropertyWithVerticalValues(property, abbreviationForProperty, unit) {
    conditionsForAddingNewPropertiesWithMoreValue(property, abbreviationForProperty, unit, 'vertical');
  }
  function builderPropertyWithHorizontalValues(property, abbreviationForProperty, unit) {
    conditionsForAddingNewPropertiesWithMoreValue(property, abbreviationForProperty, unit, 'horizontal');
  }
  function builderPropertyWithoutNumbresValues(property, abbreviationForProperty) {
    const abbr = abbreviationForProperty;
    if (className.startsWith(`${abbr}`)) {
      let elementStyle = '';

      let propertyValue = removePropertyName(className, abbr);

      elementStyle = `${property}: ${propertyValue}`;

      localStorage.setItem(className, `.${className}{${elementStyle}}`);

      if (abbr === 'mx'){
        setCssStyleInLocalStorage(`${property}-left:${propertyValue}${options.unit};${property}-right:${propertyValue}${options.unit};`);
        if(options.unit === 'rem')
          setCssStyleInLocalStorage(`${property}-left:${propertyValue / htmlFontSize}rem;${property}-right:${propertyValue / htmlFontSize}rem;`);
      } 

      if (abbr === 'my'){
        setCssStyleInLocalStorage(`${property}-top:${propertyValue}${options.unit};${property}-bottom:${propertyValue}${options.unit};`);
        if(options.unit === 'rem')
          setCssStyleInLocalStorage(`${property}-top:${propertyValue / htmlFontSize}rem;${property}-bottom:${propertyValue / htmlFontSize}rem;`);
      } 

      if (abbr === 'px'){
        setCssStyleInLocalStorage(`${property}-left:${propertyValue}${options.unit};${property}-right:${propertyValue}${options.unit};`);
        if(options.unit === 'rem')
          setCssStyleInLocalStorage(`${property}-left:${propertyValue / htmlFontSize}rem;${property}-right:${propertyValue / htmlFontSize}rem;`);
      } 

      if (abbr === 'py'){
        setCssStyleInLocalStorage(`${property}-top:${propertyValue}${options.unit};${property}-bottom:${propertyValue}${options.unit};`);
        if(options.unit === 'rem')
          setCssStyleInLocalStorage(`${property}-top:${propertyValue / htmlFontSize}rem;${property}-bottom:${propertyValue / htmlFontSize}rem;`);
      } 

      if (
        abbr === 'color' ||
        abbr === 'bg-color' ||
        abbr === 'bor-color' ||
        abbr === 'out-color' ||
        abbr === 'accent' ||
        abbr === 'caret-color'
      )
        setCssStyleInLocalStorage(`${property}: #${propertyValue}`);

      if (abbr === 'g-flow' || abbr === 'flex-dir' || abbr === 'obj-pos')
        setCssStyleInLocalStorage(`${property}: ${propertyValue.split('-').join(' ')}`);
      if(abbr === 'bg-pos'){

            propertyValue = propertyValue.split('-') 

            if(propertyValue.length === 1){
               const [value] = propertyValue
               
               
               setCssStyleInLocalStorage(`${property}: ${value}${options.unit}`);
               if(options.unit === 'rem')
               setCssStyleInLocalStorage(`${property}: ${value / htmlFontSize}${options.unit}`);
         }
         if(propertyValue.length === 2){
            const [valueX, valueY] = propertyValue
               setCssStyleInLocalStorage(`${property}: ${valueX}${options.unit} ${valueY}${options.unit}`);
               if(options.unit === 'rem')
                  setCssStyleInLocalStorage(`${property}: ${valueX / htmlFontSize}${options.unit} ${valueY / htmlFontSize}${options.unit}`);
            }
      }
      if(abbr === 'border'){
        const [borderWidth, borderStyle, borderColor] = propertyValue.split('-')

        setCssStyleInLocalStorage(`${property}: ${borderWidth}${options.unit} ${borderStyle} #${borderColor}`);
        if(options.unit === 'rem')
          setCssStyleInLocalStorage(`${property}: ${borderWidth / htmlFontSize}rem ${borderStyle} #${borderColor}`);
      }
      // transition
      if (abbr.includes('transition')) {
        const transitionValues = propertyValue.split('-');
        const [prop, duration, timinFunction, delay] = transitionValues;
        const durationInMS = +duration / 1000;
        const delayInMS = +delay / 1000;
        const style = `${prop} ${durationInMS}s ${timinFunction} ${delayInMS}s`;
        setCssStyleInLocalStorage(`${property}: ${style}`);
      }
      if (abbr === 'trans-dur' || abbr === 'trans-delay') {
        const valueInMS = +propertyValue / 1000;
        const style = `${valueInMS}s`;
        setCssStyleInLocalStorage(`${property}: ${style}`);
      }
      if (abbr === 'trans-fun') {
        if (className.includes('cub')) {
          const coordinates = propertyValue.replace(/cub|\(|\)/g, '');
          const arrayFromCoordinates = coordinates.split('-');
          const innerValues = arrayFromCoordinates.map(innerValue => innerValue / 100);
          localStorage.setItem(
            `${className}`,
            `.${className.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}{${property}: cubic-bezier(${innerValues.join(
              ', '
            )})}`
          );
        }
      }

      if (
        abbr === 'jus-con' ||
        abbr === 'align-con' ||
        abbr === 'al-items' ||
        abbr === 'al-self' ||
        abbr === 'place-con' ||
        abbr === 'aspect'
      ) {
        if (propertyValue === 'between') setCssStyleInLocalStorage(`${property}: space-between`);
        if (propertyValue === 'start') setCssStyleInLocalStorage(`${property}: flex-start`);
        if (propertyValue === 'end') setCssStyleInLocalStorage(`${property}: flex-end`);
        if (propertyValue === 'around') setCssStyleInLocalStorage(`${property}: space-around`);
        if (propertyValue === 'evenly') setCssStyleInLocalStorage(`${property}: space-evenly`);
        if (propertyValue.match(/^\d+.\d+$/))
          setCssStyleInLocalStorage(`${property}: ${propertyValue.split('-').join('/')}`);
      }

      if (abbr === 'container') {
        localStorage.setItem(
          className,
          `.${className}{${property}: ${options.containerSize}${options.unit};margin: 0 auto;padding: 0 ${options.containerPadding}${options.unit}}`
        );
        if (options.unit === 'rem') {
          localStorage.setItem(
            className,
            `.${className}{${property}: ${options.containerSize / htmlFontSize}rem;margin: 0 auto;padding: 0 ${
              options.containerPadding / htmlFontSize
            }rem}`
          );
        }
      }

      if (abbr === 'auto-cols' || abbr === 'auto-rows') {
        setCssStyleInLocalStorage(
          `${property}: ${propertyValue === 'fr' ? (propertyValue = 'minmax(0, 1fr)') : propertyValue}`
        );
      }

      if (abbr === 'line-clamp') {
        setCssStyleInLocalStorage(
          `	overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;${property}: ${propertyValue}`
        );
      }

      if (abbr === 'box') setCssStyleInLocalStorage(`${property}: ${propertyValue}-siz`);

      if (abbr === 'break') {
        if (propertyValue === 'normal') setCssStyleInLocalStorage(`overflow-wrap: ${propertyValue}; ${elementStyle}`);
        if (propertyValue === 'word') setCssStyleInLocalStorage(`overflow-wrap: ${className};`);
      }

      if (abbr === 'invert') {
        elementStyle = `${property}:${abbr}(${propertyValue})%`;
        setCssStyleInLocalStorage(elementStyle);
      }
    }

    function setCssStyleInLocalStorage(styleValue) {
      localStorage.setItem(className, `.${className}{${styleValue}}`);
    }
  }
  function builderValuesWithDisplayProperties(property, abbreviationForProperty) {
    const abbr = abbreviationForProperty;
    if (className.startsWith(`${abbr}`)) {
      if (className === abbr) localStorage.setItem(className, `.${className}{${property}}`);
    }
  }
  function builderTransformProperties(property, abbreviationForProperty, unit) {
    if (className.startsWith(`${abbreviationForProperty}-`)) {
      const abbr = abbreviationForProperty;
      let propertyValue = '';

      const values = className.split('-');

      const [firstValue, secendValue] = removeLetters(values);

      const [valueName] = values;

      if (
        !valueName.includes('rotate') &&
        !valueName.includes('scale') &&
        !valueName.includes('t-origin') &&
        !valueName.includes('hue-rot')
      ) {
        propertyValue = `${firstValue}px`;

        if (unit === 'rem') propertyValue = `${firstValue / htmlFontSize}rem`;

        if (unit === 'em') propertyValue = `${firstValue}em`;

        if (abbr === 'translate') {
          propertyValue = `${firstValue}px ${secendValue}px`;
          if (unit === 'rem') propertyValue = `${firstValue / htmlFontSize}rem ${secendValue / htmlFontSize}rem`;

          if (unit === 'em') propertyValue = `${firstValue}em ${secendValue}em`;
        }

        if (String(firstValue).match(/(vw|vh|dvw|dvh|%)$/)) {
          propertyValue = `${firstValue}`;
        }

        localStorage.setItem(className, `.${className}{${valueName}: ${propertyValue}}`);
      }

      if (valueName.includes('skew'))
        localStorage.setItem(className, `.${className}{${property}: ${valueName}(${firstValue}deg)}`);

      if (valueName.includes('rotate')) localStorage.setItem(className, `.${className}{${valueName}:${firstValue}deg}`);

      if (abbr.includes('hue-rot') || abbr.includes('bd-hue-rot'))
        localStorage.setItem(className, `.${className}{${property}: hue-rotate(${firstValue}deg)}`);

      if (valueName === 'scale') localStorage.setItem(className, `.${className}{${valueName}: ${firstValue / 10}}`);
      if (valueName === 'scaleX' || valueName === 'scaleY' || valueName === 'scaleZ')
        localStorage.setItem(className, `.${className}{${property}: ${abbr}(${firstValue / 10})}`);
      if (valueName.includes('t-origin')) {
        const [firstValue] = removePropertyName(values);
        localStorage.setItem(className, `.${className}{${property}: ${valueName}(${firstValue / 10})}`);
      }
    }
  }
  function builderFilterProperties(property, abbreviationForProperty, unit) {
    if (className.startsWith(`${abbreviationForProperty}-`)) {
      const abbr = abbreviationForProperty;
      let propertyValue = '';
      let elementStyle = '';

      const values = className.split('-');

      const [firstValue] = removeLetters(values);

      const [valueName] = values;

      propertyValue = `${firstValue}px`;

      if (unit === 'rem') propertyValue = `${firstValue / htmlFontSize}rem`;

      if (unit === 'em') propertyValue = `${firstValue}em`;

      if (String(firstValue).match(/(vw|vh|dvw|dvh)$/)) {
        propertyValue = `${firstValue}`;
      }

      // Only filter
      if (
        valueName.includes('saturate') ||
        valueName.includes('brightness') ||
        valueName.includes('contrtas') ||
        valueName.includes('opacity')
      )
        propertyValue = `${valueName}(${firstValue / 100})`;

      if (valueName === 'grayscale' || valueName === 'invert' || valueName === 'sepia')
        propertyValue = `${valueName}(${firstValue}%)`;

      // Only backdrop-filter

      elementStyle = `${property}: ${propertyValue}`;

      if (valueName === 'bd') {
        const [prefix, propertyName, value] = values;
        if (className.includes('blur')) elementStyle = `${property}: blur(${propertyValue})`;
        if (className.includes(propertyName)) elementStyle = `${property}: ${propertyName}(${value / 100})`;
        if (className.includes('grayscale') || className.includes('invert') || className.includes('sepia'))
          elementStyle = `${property}: ${propertyName}(${value}%)`;
      }

      localStorage.setItem(className, `.${className}{${elementStyle} }`);
    }
  }

  function conditionsForAddingNewPropertiesWithMoreValue(property, abbreviationForProperty, unit, condition) {
    const abbr = abbreviationForProperty;
    if (className.startsWith(`${abbr}-`)) {
      let propertyValue = '';
      let elementStyle = '';

      const value = removePropertyName(className, abbr);
      const values = value.split('-');

      const filteredValues = removeLetters(values);
      if (filteredValues.length === 1) {
        let [firstValue] = filteredValues;

        propertyValue = `${firstValue}${options.unit}`;

        if (unit === 'rem') propertyValue = `${firstValue / htmlFontSize}rem`;

        if (firstValue.match(/(vw|vh|dvw|dvh|%)$/)) {
          propertyValue = `${firstValue}`;
        }

        if (
          abbr === 'font-w' ||
          abbr === 'grow' ||
          abbr === 'shrink' ||
          abbr === 'order' ||
          abbr === 'row-start' ||
          abbr === 'row-end' ||
          abbr === 'col-start' ||
          abbr === 'col-end'
        )
          propertyValue = `${firstValue}`;
        if (abbr === 'g-cols') propertyValue = `repeat(${firstValue}, minmax(0, 1fr))`;

        conditionDirection();
      }

      if (filteredValues.length === 2) {
        const [firstValue, secondValue] = filteredValues;

        const rangeWidth = options.initialWidth - options.finalWidth;

        if (firstValue > secondValue) {
          propertyValue = `clamp(${secondValue}px, calc(${secondValue}px + (${firstValue} - ${secondValue}) * ((100vw - ${options.finalWidth}px) / (${rangeWidth}))), ${firstValue}px)`;
          if (unit === 'em') {
            propertyValue = `clamp(${secondValue}em, calc(${secondValue}em + (${firstValue} - ${secondValue}) * ((100vw - ${options.finalWidth}em) / (${rangeWidth}))), ${firstValue}em)`;
          }
          if (unit === 'rem') {
            propertyValue = `clamp(${secondValue / htmlFontSize}rem, calc(${
              secondValue / htmlFontSize
            }rem + (${firstValue} - ${secondValue}) * ((100vw - ${
              options.finalWidth / htmlFontSize
            }rem) / (${rangeWidth}))), ${firstValue / htmlFontSize}rem)`;
          }
        }

        if (firstValue < secondValue) {
          propertyValue = `clamp(${firstValue}${options.unit}, calc(${firstValue}${options.unit} + (${secondValue} - ${firstValue}) * ((100vw - ${options.finalWidth}${options.unit}) / (${rangeWidth}))), ${secondValue}${options.unit})`;
          if (unit === 'rem') {
            propertyValue = `clamp(${firstValue / htmlFontSize}rem, calc(${
              secondValue / htmlFontSize
            }rem - (${secondValue} - ${firstValue}) * ((100vw - ${
              options.finalWidth / htmlFontSize
            }rem) / (${rangeWidth}))), ${secondValue / htmlFontSize}rem)`;
          }
        }
        conditionDirection();
      }

      if (filteredValues.length === 4) {
        const [firstValue, secondValue, startWidth, endWidth] = filteredValues;
        const rangeWidth = startWidth - endWidth;

        if (firstValue > secondValue) {
          propertyValue = `clamp(${secondValue}${options.unit}, calc(${secondValue}${options.unit} + (${firstValue} - ${secondValue}) * ((100vw - ${endWidth}${options.unit}) / (${rangeWidth}))), ${firstValue}${options.unit})`;
          if (unit === 'rem') {
            propertyValue = `clamp(${secondValue / htmlFontSize}rem, calc(${
              secondValue / htmlFontSize
            }rem + (${firstValue} - ${secondValue}) * ((100vw - ${endWidth / htmlFontSize}rem) / (${rangeWidth}))), ${
              firstValue / htmlFontSize
            }rem)`;
          }
        }

        if (firstValue < secondValue) {
          propertyValue = `clamp(${firstValue}${options.unit}, calc(${secondValue}${options.unit} - (${secondValue} - ${firstValue}) * ((100vw - ${endWidth}${options.unit}) / (${rangeWidth}))), ${secondValue}${options.unit})`;
          if (unit === 'rem') {
            propertyValue = `clamp(${firstValue / htmlFontSize}rem, calc(${
              secondValue / htmlFontSize
            }rem - (${secondValue} - ${firstValue}) * ((100vw - ${endWidth / htmlFontSize}rem) / (${rangeWidth}))), ${
              secondValue / htmlFontSize
            }rem)`;
          }
        }

        conditionDirection();
      }

      if (abbr === 'b-shadow') {
        let [offsetX, offsetY, blurRadius, spreadRadius, color] = filteredValues;

        propertyValue = `${offsetX}${options.unit} ${offsetY}${options.unit} ${blurRadius}${options.unit} ${spreadRadius}${options.unit} #${color}`;
        if (options.unit === 'rem') {
          propertyValue = `${offsetX / htmlFontSize}${options.unit}
			${offsetY / htmlFontSize}${options.unit}
			${blurRadius / htmlFontSize}${options.unit}
			${spreadRadius / htmlFontSize}${options.unit}
			#${color}`;
        }

        elementStyle = `${property}: ${propertyValue}}`;

        localStorage.setItem(className, `.${className}{${elementStyle}}`);
      }
      if (abbr === 't-shadow' || abbr === 'd-shadow') {
        let [offsetX, offsetY, blurRadius, color] = filteredValues;

        propertyValue = `${offsetX}${options.unit} ${offsetY}${options.unit} ${blurRadius}${options.unit} #${color}`;
        if (options.unit === 'rem') {
          propertyValue = `${offsetX / htmlFontSize}${options.unit}
			${offsetY / htmlFontSize}${options.unit}
			${blurRadius / htmlFontSize}${options.unit}
			#${color}`;
        }

        elementStyle = `${property}: ${propertyValue}}`;
        if (abbreviationForProperty === 'd-shadow') elementStyle = `${property}: drop-shadow(${propertyValue})}`;

        localStorage.setItem(className, `.${className}{${elementStyle}}`);
      }
      function conditionDirection() {
        if (condition === 'more') {
          elementStyle = `${property}: ${propertyValue}`;
        }
        if (condition === 'vertical') {
          elementStyle = `${property}: 0 ${propertyValue}`;
        }
        if (condition === 'horizontal') {
          elementStyle = `${property}: ${propertyValue} 0`;
        }

        localStorage.setItem(className, `.${className}{${elementStyle}}`);
      }
    }
  }

  function removeLetters(values) {
    const positiveRelativeValues = /(vw|vh|dvw|dvh|%)$/;
    const negativeRelativeValues = /^n.*(?:vw|vh|dvw|dvh|%)$/;
    const filteredValues = values.filter(value => {
      const negativeValues = /^n\d+$/;
      const positiveValues = /.*/;

      if (
        negativeValues.test(value) ||
        positiveValues.test(value) ||
        positiveRelativeValues.test(value) ||
        negativeRelativeValues.test(value)
      ) {
        return true;
      }
    });

    const newValues = filteredValues.map(value => {
      if (value.match(/^n/)) value = `-${value.slice(1)}`;
      return value;
    });
    return newValues;
  }
  function removePropertyName(value, abbreviationForProperty) {
    const newValue = value.replace(`${abbreviationForProperty}-`, '');
    return newValue;
  }

  const fromBlob = createNewCssFileInBlob(fileContent, mediaQueries).split('}').map(el=>el + '}');

  if (options.isBuild === true) {
    fetch('https://fa3ed49664b21694.mokky.dev/classes')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          fetch('https://fa3ed49664b21694.mokky.dev/classes', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([]),
          })
            .then(() => {
              fetch('https://fa3ed49664b21694.mokky.dev/classes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(fromBlob),
              })
                .catch(error => {
                  // Обработка ошибки при выполнении второго запроса
                  console.error('Ошибка при отправке данных на сервер:', error);
                });
            })
            .catch(error => {
              // Обработка ошибки при выполнении первого запроса PATCH
              console.error('Ошибка при очистке данных на сервере:', error);
            });
        } else {
          fetch('https://fa3ed49664b21694.mokky.dev/classes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fromBlob),
          })
            .catch(error => {
              // Обработка ошибки при выполнении запроса POST
              console.error('Ошибка при отправке данных на сервер:', error);
            });
        }
      })
      .catch(error => {
        // Обработка ошибки при выполнении запроса GET
        console.error('Ошибка при получении данных с сервера:', error);
      });
  }
}
