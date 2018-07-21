var express  = require('express');
const mongoose = require('mongoose');
var Battle = require('./model');

// export MONGOLAB_URI="mongodb://dhope21:abhijeet21@ds147391.mlab.com:47391/gotbattle"
// mongoose connection
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

// returns the list of all battels
app.get('/list', (req, res) => {
  Battle.find({}, function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});

// returns the total list of battles
app.get('/count',(req,res) => {
  Battle.count({}, function(err, data) {
    if (err) throw err;
    res.send({"count":data});
  });
});


// allows to search in the list of battles
app.get('/search',(req,res) => {
  let query = updateQuery(req.query);
  console.log("query", query);
  Battle.find(query, function(err, data) {
    if (err) throw err;
    res.send(data);
  });
  // res.send({"url": req.query,"db":query});
});


function updateQuery(urlQuery){
  console.log("urlQuery",urlQuery);
  var urlKeys = Object.keys(urlQuery);
  var modelKeys = Object.keys(Battle.schema_object);
  var dbQuery={$and:[]}
  for (let j = 0; j < urlKeys.length; j++) {
    var orQuery = {$or:[]};
    for (let i = 0; i < modelKeys.length; i++) {
      let queryCounter=0;
      if(modelKeys[i]==urlKeys[j]){
        dbQuery.$and.push({
          [modelKeys[i]]:urlQuery[urlKeys[j]
        ]});
      }else if(modelKeys[i].indexOf(urlKeys[j]) > -1){
        console.log(modelKeys[i],urlKeys[j]);
        orQuery.$or.push({
          [modelKeys[i]]:urlQuery[urlKeys[j]]
        });
      }
    }
    if(orQuery.$or.length>0) dbQuery.$and.push(orQuery);
  }
  // console.log("keys",urlKeys,dbQuery);
  return dbQuery;
}

app.listen(3000, () => console.log('Example app listening on port 3000!'));



