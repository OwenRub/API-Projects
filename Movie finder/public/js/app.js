import {displayItems, getRequestObject} from './Tools.js';

window.addEventListener('onload', loadMainContent());
const searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener('click', () => {
	const userInput = document.getElementById('user-input');
	userInput.focus();
})

function loadMainContent(){
	getPopularMovies();
	getPopularSeries();
}


async function getPopularMovies(){
	const options = getRequestObject({ contentType: 'movie', contentKey: 'popular', pageNumber: false, string: false });
	try{
		const response = await fetch('/api', options);
		console.log(response);
		if(response.ok){
			const movies = await response.json();
			console.log(movies)
			displayItems(movies.results, 'movies-trending');
		}
	}
	catch(err){
		console.log(err);
	}
}

async function getPopularSeries(){
	const options = getRequestObject({contentType: 'tv', contentKey: 'popular', pageNumber: 1, string: false});
	try{
		const response = await fetch('/api', options);
		
		if(response.ok){
			const series = await response.json();
			displayItems(series.results, 'series-trending');
		}
	}
	catch(err){
		console.log(err);
	}
}

// ****** NOT USED ******

// able to look for the movie in the same page when form is submitted with enter
/*
function handleEnterKey(e){ 
    if(e.keyCode == 13){ // enter pressed
        try{
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            handleClickEvent(); -> got the movie name and asked for it

        }catch(err){
            console.log(err.message); 
        }
    }
}
*/

/* able to look for the movie when 'search button' was pressed
document.addEventListener('DOMContentLoaded', () => {
	const searchButton = document.getElementById('search-button');
	searchButton.addEventListener('click', handleClickEvent);
});
*/