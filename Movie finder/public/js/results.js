import {displayItems, getRequestObject} from './Tools.js';

const parameters = (new URL(document.location)).searchParams;
const keyword = parameters.get('search');
const encodedString = encodeURIComponent(keyword);

getMoviesResults();
getSeriesResults();

async function getMoviesResults(){
	const options = getRequestObject({contentType: 'search', contentKey: 'movie', pageNumber: 1, string: encodedString})
	try{
		const response = await fetch('/api', options);
		if(response.ok){
			const movies = await response.json();
			displayItems(movies.results, 'movies-results');
		}
	}
	catch(err){
		console.log(err);
	}
}

async function getSeriesResults(){
	const options = getRequestObject({contentType: 'search', contentKey: 'tv', pageNumber: 1, string: encodedString})
	try{
		const response = await fetch('/api', options);
		if(response.ok){
			const series = await response.json();
			displayItems(series.results, 'series-results');
		}
	}
	catch(err){
		console.log(err);
	}
}