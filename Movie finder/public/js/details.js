import {getRequestObject} from './Tools.js';

const parameters = (new URL(document.location)).searchParams;
const contentKey = parameters.get('id');
const contentType = parameters.get('type');


getContentDetails(contentType, contentKey);

async function getContentDetails(type, key){
	const options = getRequestObject({contentType: type, contentKey: key, pageNumber: false, string: false});
	try{
		const response = await fetch('/api', options);
		if (response.ok) {
			const result = await response.json();
			displayMainInformation(result, type);
		}
	}
	catch(error){
		console.log(error);
	}
}

function displayMainInformation(result, type){
	const informationContainer = document.getElementById('information-container');
	informationContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('http://image.tmdb.org/t/p/w1280/${result.backdrop_path}')`;
	const title = document.getElementById('title');
	title.innerHTML = `${result.title ?? result.name} <span>(${result.release_date == undefined ? result.first_air_date.slice(0,4) : result.release_date.slice(0,4)})</span>`;
	const backImage = document.getElementById('back');
	backImage.setAttribute('src', `http://image.tmdb.org/t/p/w500/${result.poster_path}`);
	const genresList = getGenresList(result.genres);
	const genres = document.getElementById('genres');
	genres.textContent = `${genresList} - ${result.runtime ?? result.episode_run_time} min`;
	const rate = document.getElementById('rate');
	rate.innerHTML = `${Math.round(result.vote_average*100/10)}<sup>%</sup>`
	const description = document.getElementById('description');
	description.textContent = `${result.overview}`;
	displayCreator(result);
	const tagLine = document.getElementById('tagline');
	tagLine.textContent = result.tagline ?? '';

	if(type == 'tv')
	  displaySeasons(result.seasons);
	else{
		const seasonsContainer = document.getElementById('seasons');
		seasonsContainer.style.display = 'none';
	}
}

function displaySeasons(seasons){
	const seasonsContainer = document.getElementById('seasons')
	for(const s of seasons){
		const seasonCard = getSeasonCard(s);
		seasonsContainer.appendChild(seasonCard);
	}
}

function getSeasonCard(season){
	const seasonCard = document.createElement('div');
	seasonCard.className = 'season';
	const seasonImage = document.createElement('img');
	seasonImage.setAttribute('src', `http://image.tmdb.org/t/p/w500/${season.poster_path}`);
	const seasonInformation = document.createElement('div');
	const seasonTitle = document.createElement('h2');
	seasonTitle.textContent = `Season ${season.season_number} - ${season.name}`;
	const dateEpisodes = document.createElement('h3');
	dateEpisodes.textContent = `${season.air_date} (${season.episode_count} episodes)`;
	const overview = document.createElement('p');
	overview.textContent = `${season.overview}`;

	seasonInformation.append(seasonTitle, dateEpisodes, overview);
	seasonCard.append(seasonImage, seasonInformation);

	return seasonCard;
}

function getGenresList(arr){
	let list = '';
	for(let i=0; i<arr.length; i++){
		list += arr[i].name;
		if (i < arr.length - 1) list += ', ';
	}
	return list;
}

function displayCreator(obj){
	let creators = obj.created_by;
	let list = '';
	if(creators){
		for(let i=0; i<creators.length; i++){
			list += creators[i].name;
			if (i < creators.length - 1) list += ', ';
		}
		const creatorEl = document.getElementById('creator');
		creatorEl.textContent = list;
	}
	else{
		const creatorHolder = document.getElementById('creator-holder');
		creatorHolder.style.display = 'none';
	}
}