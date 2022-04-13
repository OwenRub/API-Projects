import {displayItems, getRequestObject} from './Tools.js';

const contentType = document.title == 'Top series - Movie Finder' ? 'tv' : 'movie';
const viewMoreBtn = document.getElementById('view-more');
let page = 1;

viewMoreBtn.addEventListener('click', handleViewMoreButton);

getTopContent(page);

function handleViewMoreButton(){
	getTopContent(++page);
}

async function getTopContent(pageNumber){
	const options = getRequestObject({contentType, contentKey: 'top_rated', pageNumber, string: false});
	try{
		const response = await fetch('/api', options);
		if(response.ok){
			const topContent = await response.json();
			displayItems(topContent.results, 'top-content')
		}
	}
	catch(error){
		console.log(error);
	}
}
