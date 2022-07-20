const {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} = require('../../lib/air-table');

const createStoreRecord = async ({
  id,
  name,
  neighbourhood,
  address,
  imgUrl,
  voting,
}) => {
  const createRecords = await table.create([
    {
      fields: {
        id,
        name,
        address,
        neighbourhood,
        voting: voting ?? 0,
        imgUrl,
      },
    },
  ]);
  return getMinifiedRecords(createRecords);
};

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      
      const { id, name } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        
        if (records.length !== 0) {
          res.json(records);
        } else {
          if (name) {
            const records = await createStoreRecord(req.body);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: 'Id or name is missing' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.error('Error creating or finding a store', err);
      res.status(500);
      res.json({ message: 'Error creating or finding a store' });
    }
  }
};
