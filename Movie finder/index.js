//set the server to make api calls hiding the API_KEY
const express = require('express');
const axios = require('axios');
const app = express();

//env.PORT & env.API_KEY setted up on heroku
app.listen(process.env.PORT, () => console.log(`listening in ${process.env.PORT}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.post('/api', (request, response) => {
  //use axios to make http requests to TMDB api
  axios.get(getRequestURL(request.body))
    .then(TMDBresponse => response.json(TMDBresponse.data))
    .catch(err => console.log('Ups, hubo un error', err));
})

//according to the body send by the client, return the url for the request to TMDB
function getRequestURL({contentType, contentKey, pageNumber, string}) {
	const optionalString = string ? `&query=${string}`: '';
	const optionalPage = pageNumber ? `&page=${pageNumber}` : '';
	return `https://api.themoviedb.org/3/${contentType}/${contentKey}?api_key=${process.env.API_KEY}&language=en-US${optionalPage}${optionalString}`;
}