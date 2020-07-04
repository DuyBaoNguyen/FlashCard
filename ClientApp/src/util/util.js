export function transformStatistics(statistics) {
  for (let item of statistics) {
    item.day = new Date(item.dateTime).toString().substr(0, 3);
  }
  return statistics;
}

export const filterCards = (source, filteredValue) => {
  switch (filteredValue) {
    case 'remembered':
      return source.filter(card => card.remembered);
    case 'not-remembered':
      return source.filter(card => !card.remembered);
    default:
      return [...source];
  }
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  let message = null;

  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
    if (!isValid) {
      message = message || 'This field is required.';
    }
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (!isValid) {
      message = message || `At least ${rules.minLength} character${rules.minLength > 1 ? 's' : ''}.`;
    }
  }
  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
    if (!isValid) {
      message = message || `Exceeds ${rules.maxLength} characters.`;
    }
  }
  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?./;
    isValid = pattern.test(value) && isValid;
    if (!isValid) {
      message = message || 'Contains invalid character.';
    }
  }
  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
    if (!isValid) {
      message = message || 'This field requires number characters.';
    }
  }
  if (rules.pattern) {
    isValid = rules.pattern.test(value) && isValid;
    if (!isValid) {
      message = message || 'Contains invalid character.';
    }
  }

  return { valid: isValid, message: message };
};