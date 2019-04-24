/**
 * Prevent redux type maybe duplicate
 * @param {string} namespace
 * @param {string} type
 */
export const genNamspace = (namespace:string = throw new Error('namespace is required!')) => 
  (type:string = throw new Error('type is required!')) => {
    try {
      const _namespace = namespace || '';
      const _type = type || '';
      return `${String(_namespace).toUpperCase()}/${String(_type).toUpperCase()}`;
    } catch(e) {
      console.warn(e);
      return null;
    }
  };