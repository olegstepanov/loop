import {randomInRange} from '../global/utils'
import _ from 'lodash'
import $ from 'jquery'

const COLOR_PATTERNS = [
  ['#c9d8c5', '#387229', '#5ff736'],
  ['#f2ece1', '#5b5037', '#f2ad0c'],
  ['#bce0f2', '#105577', '#0491d8']
];

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

const getCurrentPattern = () => {
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

const pickColors = () => {
  const currentPattern = getCurrentPattern();
  while(true) {
    const pattern = randomInRange(0, COLOR_PATTERNS.length);
    if (pattern != currentPattern)
      return COLOR_PATTERNS[pattern];
  }
}

const setNextColors = () => {
  const pattern = pickColors();
  $(document.body).css({
    backgroundColor: pattern[0],
    color: pattern[1],
    fill: pattern[1]
  })
}

const invertColors = () => {
  const pattern = COLOR_PATTERNS[getCurrentPattern()];
  console.log(pattern);
  $(document.body).css({
    backgroundColor: pattern[1],
    color: pattern[2],
    fill: pattern[2]
  })
}

export {setNextColors, invertColors}
