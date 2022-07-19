const { findRecordByFilter, table } = require('../../lib/air-table');

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records[0]);
        } else {
          res.json({ message: `id could not be found` });
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.error('Error finding a store', err);
      res.status(500);
      res.json({ message: 'Error finding a store' });
    }
  }
};
