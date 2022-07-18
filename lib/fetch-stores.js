import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
});

const getCoffeeStorePhotos = async () => {
  const response = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 6,
  });

  return response.response.results.map((item) => item.urls['small']);
};

const getApiUrl = (query, longlat, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${longlat}&limit=${limit}`;
};

export const fetchStores = async (
  latlong = '43.653833032607096%2C-79.37896808855945',
  limit = 6
) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  let res = await fetch(getApiUrl('coffee', latlong, limit), options);

  res = await res.json();

  res = res.results;

  const imgUrls = await getCoffeeStorePhotos();
  res = res.map((item, index) => {
    const { neighborhood, address } = item.location;
    return {
      id: item.fsq_id,
      name: item.name,
      imgUrl: imgUrls[index],
      address,
      neighborhood: neighborhood?.length > 0 ? neighborhood[0] : '',
    };
  });

  return res;
};
