const express = require('express');
const apiRouter = express.Router();
const dbMethods = require('./db.js')
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const fields = {
  'minions': ['name', 'title', 'weakness', 'salary'],
  'ideas': ['name', 'description', 'weeklyRevenue', 'numWeeks'],
};


apiRouter.get('/', (req, res, next) => {
  res.send('Welcome to the API buddy bucko!');
});

apiRouter.param('id', (req, res, next, id) => {
  req.id = id;
  req.item = dbMethods.getFromDatabaseById(pathAsArray(req.url)[0], id);

  if (!req.item){
    res.status(404).send("Id not found");
  } else {
    next();
  }
});

const pathAsArray = (string) => { return string.split('/').filter(x => x.length > 0)};

const getFromDb = (req, res, next) => {
  const path = pathAsArray(req.url);

  if (path.length === 1){
    res.send(dbMethods.getAllFromDatabase(path[0]));
  } else if (req.id && req.item){
      res.send(req.item);
  }
  next();
};

const putToDb = (req, res, next) => {
  const path = pathAsArray(req.url);

  if (path.length === 1)
    throw new Error("Need the id in order to put");

  const currentFields = fields[path[0]];
  const object = req.item;

  for (let item of currentFields){
    let value = req.body[item];

    if (value){
      if (!Number.isNaN(Number.parseFloat(value)))
        value = Number.parseFloat(value);
      object[item] = value;
    }
  }
  dbMethods.updateInstanceInDatabase(path[0], object);
  res.send(object);
  next();
};


const postToDb = (req, res, next) => {
  const type = pathAsArray(req.url)[0];

  const result = dbMethods.addToDatabase(type, req.body);
  if (result !== null) res.status(201).send(result);
  else res.status(400).send();
};

const deleteItemFromDb = (req, res, next) => {
  const path = pathAsArray(req.url);

  const type = path[0];
  const id = req.id;

  const found = dbMethods.deleteFromDatabasebyId(type, id);
  const status = found ? 204 : 404;
  res.status(status).send();
}

['minions', 'ideas'].forEach(category => {
  apiRouter.get(`/${category}`, getFromDb);
  apiRouter.get(`/${category}/:id`, getFromDb);
  apiRouter.put(`/${category}/:id`, putToDb);
  apiRouter.delete(`/${category}/:id`, deleteItemFromDb);
});

apiRouter.post(`/minions`, postToDb);
apiRouter.post(`/ideas`, checkMillionDollarIdea, postToDb);


apiRouter.get('/meetings', (req, res, next) => {
  res.send(dbMethods.deleteAllFromDatabase('meetings'));
});

apiRouter.post('/meetings', (req, res, next) => {
  const result = dbMethods.addToDatabase('meetings', dbMethods.createMeeting());
  res.status(201).send(result);
});

apiRouter.delete('/meetings', (req, res, next) => {
  dbMethods.deleteAllFromDatabase('meetings');
  res.status(204).send();
})

module.exports = apiRouter;
