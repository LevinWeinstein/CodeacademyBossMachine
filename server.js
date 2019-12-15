const express = require('express');
const app = express();

module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
const cors = require('cors')
const corsOptions = {
  origin: 'index.html',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


// Add middware for parsing request bodies here:
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

app.get('/', (req, res, next) => {
  res.redirect('/api');
})


// This conditional is here for testing purposes:
if (!module.parent) { 
  app.listen(PORT);
}
