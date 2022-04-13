import {displayItems, getRequestObject} from './Tools.js';

const contentType = document.title == 'Premiere movies - Movie Finder' ? 'movie' : 'tv';
const contentKey = contentType == 'tv' ? 'on_the_air' : 'now_playing';
const viewMoreBtn = document.getElementById('view-more');
let page = 1;

viewMoreBtn.addEventListener('click', handleViewMoreButton);

getPremiereContent(page);

function handleViewMoreButton(){
	getPremiereContent(++page);
}

async function getPremiereContent(pageNumber){
	const options = getRequestObject({contentType, contentKey, pageNumber, string: false});
	try{
		const response = await fetch('/api', options);
		if(response.ok){
			const topContent = await response.json();
			displayItems(topContent.results, 'latest-content')
		}
	}
	catch(error){
		console.log(error);
	}
}