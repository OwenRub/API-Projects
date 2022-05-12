const express = require('express');
const axios = require('axios');
const md5 = require('blueimp-md5');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening at ${port}`);
});

function getTsAndHash(){
	const ts = Date.now();
	const strForHash = `${ts}${process.env.YOUR_MARVEL_SECRET_API_KEY}${process.env.YOUR_MARVEL_PUBLIC_API_KEY}`;
	const hash = md5(strForHash);

	return { ts, hash };
}

// ENDPOINTS
app.get('/v1/news/:query',(request, response) => {
	const to = new Date();
	const from = new Date(to);
	from.setDate(from.getDate() - 15);
	const query = request.params.query;

	const formattedFrom = `${from.getFullYear()}-${from.getMonth()+1}-${from.getDate()}`;
	const formattedTo = `${to.getFullYear()}-${to.getMonth()+1}-${to.getDate()}`;

	axios.get(`https://newsapi.org/v2/everything?q=${query}+marvel&from=${formattedFrom}&to=${formattedTo}&sortBy=popularity&apiKey=${process.env.YOUR_NEWS_API_KEY}`)
		.then( newsResponse => response.json(newsResponse.data) )
		.catch( err => console.log(err) )
});

app.get('/v1/characters/:offset', (request, response) => {
	const offset = request.params.offset;
	const parameters = getTsAndHash();

	axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${parameters.ts}&apikey=${process.env.YOUR_MARVEL_PUBLIC_API_KEY}&hash=${parameters.hash}&limit=36&offset=${offset}`)
		.then( marvelResponse => response.json(marvelResponse.data) )
		.catch( err => console.log(err) );

});

app.get('/v1/searchCharacter/:name', (request, response) => {
	const name = request.params.name;
	const parameters = getTsAndHash();

	axios.get(`https://gateway.marvel.com/v1/public/characters?ts=${parameters.ts}&apikey=${process.env.YOUR_MARVEL_PUBLIC_API_KEY}&hash=${parameters.hash}&nameStartsWith=${name}`)
		.then( marvelResponse => response.json(marvelResponse.data) )
		.catch( err => console.log(err) );

});

app.get('/v1/latestComics/:dateDescriptor', (request, response) => {
	const dateDescriptor = request.params.dateDescriptor;
	const parameters = getTsAndHash();

	axios.get(`https://gateway.marvel.com/v1/public/comics?ts=${parameters.ts}&apikey=${process.env.YOUR_MARVEL_PUBLIC_API_KEY}&hash=${parameters.hash}&dateDescriptor=${dateDescriptor}`)
		.then( marvelResponse => response.json(marvelResponse.data) )
		.catch( err => console.log(err) );

});

app.get('/v1/searchComic/:title', (request, response) => {
	const parameters = getTsAndHash();
	const titleStartsWith = request.params.title;

	axios.get(`https://gateway.marvel.com/v1/public/comics?ts=${parameters.ts}&apikey=${process.env.YOUR_MARVEL_PUBLIC_API_KEY}&hash=${parameters.hash}&titleStartsWith=${titleStartsWith}`)
		.then(marvelResponse => response.json(marvelResponse.data));
});

app.get('/v1/getDetails/:typeId', (request, response) => {
	const parameters = getTsAndHash();
	const type = request.params['typeId'].split(',')[0];
	const id = request.params['typeId'].split(',')[1];

	axios.get(`https://gateway.marvel.com/v1/public/${type}/${id}?ts=${parameters.ts}&apikey=${process.env.YOUR_MARVEL_PUBLIC_API_KEY}&hash=${parameters.hash}`)
		.then(marvelResponse => response.json(marvelResponse.data));
});
