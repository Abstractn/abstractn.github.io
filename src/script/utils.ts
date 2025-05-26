export const queryParam = {
  get: (key: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
  },
  set: (key: string, value: string) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathName = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    searchParams.set(key, value);
    const queryParameters = searchParams.toString();
    const newUrl = `${protocol}//${host}${pathName}?${queryParameters}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  },
  delete: (key: string) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathName = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.delete(key);
    const queryParameters = searchParams.toString();
    const newUrl = queryParameters.length ?
      `${protocol}//${host}${pathName}?${queryParameters}` :
      `${protocol}//${host}${pathName}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  },
};