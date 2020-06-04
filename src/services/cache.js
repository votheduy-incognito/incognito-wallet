const caches = {};

/**
 * Cache data
 * @param key
 * @param data
 * @param expiredTime
 */
export function cache(key, data, expiredTime) {
  caches[key] = {
    data: data,
    expiredTime: new Date().getTime() + expiredTime,
  };
}

export async function cachePromise(key, promise, expiredTime = 40000) {
  const cachedData = getCache(key);

  if (cachedData !== null) {
    return cachedData;
  }

  const data = await promise();
  cache(key, data, expiredTime);

  return data;
}

/**
 * Get cache data
 * @param key
 * @returns {null|*}
 */
export function getCache(key) {
  const cacheData = caches[key];

  if (cacheData && cacheData.expiredTime > new Date().getTime()) {
    return cacheData.data;
  }

  return null;
}
