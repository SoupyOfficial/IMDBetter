//import { v4 as uuid } from 'uuid';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; 
app.set('port', (process.env.PORT || 5000)); 

const path = require("path");

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => 
{
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error

  const { userId, card } = req.body;

  const newCard = {Card:card,UserId:userId};
  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/register', async(req, res, next) =>
{
  // incoming: login, password, first name, last name, email, phone number
  // outgoing: error
  //const userId = uuid();

  const { userId, login, password, firstName, lastName, phoneNumber, email } = req.body;

  const newUser = { UserId:userId,Login:login,Password:password,FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email};
  var error = '';

  try
  {
    const db = client.db();
    const results = await db.collection('Users').insertOne(newUser);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});


app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

 var error = '';

  const { login, password } = req.body;

  const db = client.db();
  const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

  var id = -1;
  var fn = '';
  var ln = '';

  if( results.length > 0 )
  {
    id = results[0].UserId;
    fn = results[0].FirstName;
    ln = results[0].LastName;
  }

  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/search', async (req, res, next) => 
{
  // incoming: search
  // outgoing: results[], error

  var error = '';

  const { Title } = req.body;
  
  var _search = Title.trim();
  
  const db = client.db();
  const movieResults = await db.collection('Medias').find({"Title":{$regex:_search+'.*', $options:'ri'}}).toArray();
  const actorResults = await db.collection('Actors').find({"Name":{$regex:_search+'.*', $options:'ri'}}).toArray();
  const userResults = await db.collection('Users').find({"Login":{$regex:_search+'.*', $options:'ri'}}).toArray(); 

  var _ret = [];
  for( var i=0; i < movieResults.length; i++ )
  {
    _ret.push( movieResults[i].Title );
  }
  for( var i=0; i < actorResults.length; i++ )
  {
    _ret.push( actorResults[i].Name );
  }
  for( var i=0; i < userResults.length; i++ )
  {
    _ret.push( userResults[i].Login );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/loadmovie', async (req, res, next) => 
{

 var error = '';

 const { ID } = req.body;

console.log(ID)
 const db = client.db();
 const results = await db.collection('Medias').findOne({imdbID:ID});
 console.log(results)

  var title = '';
  var poster = '';
  var genre = '';
  var rated = '';
  var runtime = '';
  var imdbrating = '';
  var type = '';
  var released = '';
  var actors = '';
  var plot = '';
  var year = '';
  var director = '';
  var writer = '';
  var language = '';
  var country = '';
  var awards = '';
  var ratings = '';
  var metascore = '';
  var imdbvotes = '';
  var dvd = '';
  var boxoffice = '';
  var production = '';
  var website = '';
  var totalseasons = '';

  if(true)
  {
    title = results.Title;
    poster = results.Poster;
    genre = results.Genre;
    rated = results.Rated;
    runtime = results.Runtime;
    imdbrating = results.imdbRating;
    type = results.Type;
    released = results.Released;
    actors = results.Acotrs;
    plot = results.Plot;
    year = results.Year;
    director = results.Director;
    writer = results.Writer;
    language = results.Language;
    country = results.Country;
    awards = results.Awards;
    ratings = results.Ratings;
    metascore = results.Metascore;
    imdbvotes = results.imdbVotes;
    dvd = results.DVD;
    boxoffice = results.BoxOffice;
    production = results.Production;
    website = results.Website;
    totalseasons = results.totalSeasons;
  }

  var ret = { title:title, poster:poster, genre:genre, rated:rated, runtime:runtime, imdbRating:imdbrating, type:type, released:released, actors:actors, plot:plot, year:year, director:director, writer:writer, language:language, country:country, awards:awards, ratings:ratings, metascore:metascore, imdbVotes:imdbvotes, dvd:dvd, boxOffice:boxoffice, production:production, website:website, totalSeasons:totalseasons, error:''};
  res.status(200).json(ret);
});

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// app.listen(5000); // start Node + Express server on port 5000
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});
