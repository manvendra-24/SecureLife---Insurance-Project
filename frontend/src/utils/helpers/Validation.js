import validator from 'validator';

export const required = (value) => {
  if (validator.isEmpty(value)) {
    return "This field is required";
  }
};

export const isEmail = (value) => {
  if (!validator.isEmail(value)) {
    return "Invalid email format";
  }
};

export const isAlpha = (value) => {
  if (!validator.isAlpha(value)) {
    return "Only alphabetic characters are allowed";
  }
};

export const isAlphaNumNoSpace = (value) => {
  if (!validator.isAlphanumeric(value) || validator.contains(value, ' ')) {
    return "Only alphanumeric characters without spaces are allowed";
  }
};

export const checkSize = (value, min, max) => {
  if (!validator.isLength(value, { min, max })) {
    return `Must be between ${min} and ${max} characters`;
  }
};

export const noSpace = (value) => {
    if (validator.contains(value, ' ')) {
      return "No spaces are allowed";
    }
  };

export const onlyPositive = (value) => {
  const numberValue = Number(value);
  if (isNaN(numberValue) || numberValue <= 0) {
    return 'Value must be a positive number';
  }
  return '';
};


  export const isInRange = (value, min, max) => {
    if (isNaN(value)) {
      return "Must be a number";
    }
    if (value < min || value > max) {
      return `Must be between ${min} and ${max}`;
    }
    return undefined;
  };
  

  export const isAlphaWithSpace = (value) => {
    if (!/^[A-Za-z\s]+$/.test(value)) {
      return "Only alphabetic characters and spaces are allowed";
    }
    return undefined;
  };
  

  export const greaterThan = (value1, value2) => {
    if (value1 > value2) {
      return "Correct minimum and maximum values";
    }
    return undefined;
  };


  export const isFutureDate = (value) => {
    const selectedDate = new Date(value);
    const today = new Date();
    if (selectedDate > today) {
      return 'Date of birth cannot be in the future';
    }
    return undefined;
  };
  
  export const isTenDigits = (value) => {
    if (!/^\d{10}$/.test(value)) {
      return 'Phone number must be exactly 10 digits';
    }
    return undefined;
  };
  
  export const isAlphanumeric16 = (value) => {
    if (!/^[A-Za-z0-9]{16}$/.test(value)) {
      return 'Bank account details must be 16 alphanumeric characters without special characters';
    }
    return undefined;
  };