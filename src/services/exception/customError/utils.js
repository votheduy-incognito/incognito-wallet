
/**
 * 
 * @param {number} number 
 * Make sure `number` is unique!!!
 */
export const genCode = (type, number) => {
  return `${type}(${number})`;
};


/**
 * 
 * @param {number} number 
 * Make sure `number` is unique!!!
 */
export const codeCreator = (type) => {
  const codes = {};
  return (number) => {
    if (codes[number]) throw new Error(`Code ${number} is existed! You didn't read the method description, did you? FY!!!!!!!!!!`);
    codes[number] = true;
    return genCode(type, number);
  };
};