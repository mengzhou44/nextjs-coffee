import { fetchStores } from '../../lib/fetch-stores';
export default async (req, res) => {
  try {
    const { latlong, limit } = req.query;
    const stores = await fetchStores(latlong, limit);
    res.status(200);
    res.json(stores);
  } catch (err) {
    console.log('Error occured!', err);
    res.status(500);
    res.join({ message: 'Oh no! Something went wrong', err });
  }
};
