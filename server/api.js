const express = require('express');
const apiRouter = express.Router();
const dbMethods = require('./db.js')

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

['minions', 'ideas'].forEach(category => {
  apiRouter.get(`/${category}`, getFromDb);
  apiRouter.get(`/${category}/:id`, getFromDb);
  apiRouter.put(`/${category}/:id`, putToDb)
});



const fields = {
  'minions': ['name', 'title', 'weakness', 'salary'],
  'ideas': ['name', 'description', 'weeklyRevenue', 'numWeeks'],
};



/*

apiRouter.put('/minions/:id', (req, res, next) => {
 const object = req.item;

 for (let item of ["name", "title", "weakness", "salary"]){
   let value = req.body[item];

   if (value){
     if (item === "salary") value = parseInt(value);
     object[item] = value;
   }
 }
 dbMethods.updateInstanceInDatabase('minions', object);
 res.send(object);
});
*/

//apiRouter.get('/minions/:id', getFromDb);
//apiRouter.get('/ideas/:id', getFromDb);

module.exports = apiRouter;
