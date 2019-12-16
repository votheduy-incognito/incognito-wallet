
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
    if (codes[number]) throw new Error(`Code ${number} is existed!`);
    codes[number] = true;
    return genCode(type, number);
  };
};