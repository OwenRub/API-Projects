const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.listen(3000, () => {
	console.log('listening at 3000');
})

app.get('/v1/news/:date',(request, response) => {
	const to = new Date(request.params['date']);
	const from = new Date(to);
	from.setDate(from.getDate() - 15);

	const formattedFrom = `${from.getFullYear()}-${from.getMonth()+1}-${from.getDate()}`;
	const formattedTo = `${to.getFullYear()}-${to.getMonth()+1}-${to.getDate()}`;

	axios.get(`https://newsapi.org/v2/everything?q=marvel&from=${formattedFrom}&to=${formattedTo}&sortBy=popularity&apiKey=${here_your_apikey}`)
		.then(newsResponse => {
			response.json(newsResponse.data)
		})
		.catch(err => {
			console.log(err);
		})
})