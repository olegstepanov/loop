import {randomInRange} from '../global/utils'
import _ from 'lodash'
import $ from 'jquery'

const COLOR_PATTERNS = [
  ['#c9d8c5', '#387229', '#5ff736'],
  ['#f2ece1', '#5b5037', '#f2ad0c'],
  ['#bce0f2', '#105577', '#0491d8']
];

var currentPattern = -1;
var currentColors = null;

const toHexString = (rgbString) => {
  var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  console.log(parts);
  delete (parts[0]);
  for (var i = 1; i <= 3; ++i) {
      parts[i] = parseInt(parts[i]).toString(16);
      if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  const hexString ='#'+parts.join('').toLowerCase();
  return hexString;
}

const eveluateCurrentPattern = () => {
  var currentBgcolor = toHexString($(document.body).css('backgroundColor'));
  console.log(currentBgcolor);
  var currentPattern = -1;
  for (var i = 0; i < COLOR_PATTERNS.length; i++)
    if (_.isEqual(COLOR_PATTERNS[i][0], currentBgcolor)) {
      currentPattern = i;
      break;
    }
  return currentPattern;
}

const pickPattern = () => {
  while(true) {
    const pattern = randomInRange(0, COLOR_PATTERNS.length);
    if (pattern != currentPattern)
      return pattern;
  }
}

const findBackgroundAnimationRule = () => {
  for (const stylesheet of Array.from(document.styleSheets)) {
    if (stylesheet.cssRules === null) continue;
    for (const rule of Array.from(stylesheet.cssRules)) {
      if (rule.name == 'backgroundAnimation')
        return rule;
    }
  }
  return null;
}

const animateTo = (newColors) => {
  const rule = findBackgroundAnimationRule();
  if (rule == null) {
    console.error("Could not find @keyframes rule for backgroundAnimation");
    return;
  }

  rule.deleteRule('0%');
  rule.deleteRule('100%');

  if (currentColors !== null) {
    rule.appendRule('0% { background-color: ' + currentColors.backgroundColor +
                    '; color: ' + currentColors.color + '; fill: ' + currentColors.fill + '}');
  }

  rule.appendRule('100% { background-color: ' + newColors.backgroundColor +
                  '; color: ' + newColors.color + '; fill: ' + newColors.fill + '}')

  currentColors = newColors;

  $(document.body).css({ animationName: 'backgroundAnimation' });
}

const setNextColors = () => {
  const pattern = pickPattern();
  const colors = COLOR_PATTERNS[pattern];

  animateTo({
    backgroundColor: colors[0],
    color: colors[1],
    fill: colors[1]
  });

  currentPattern = pattern;
}

const invertColors = () => {
  const pattern = currentPattern;
  const colors = COLOR_PATTERNS[pattern];

  animateTo({
    backgroundColor: colors[1],
    color: colors[2],
    fill: colors[2]
  });
}

export {setNextColors, invertColors}
