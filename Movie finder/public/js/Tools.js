const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

//add the cards in the container specified
function displayItems(objArray, containerId){
	const resultsContainer = document.getElementById(containerId);
	const itemsContainer = resultsContainer.children;
	objArray.forEach(obj => {
		const item = createItem(obj);
		itemsContainer[1].appendChild(item);
	});
}

//almost every other js file use this function to display the medias in card format
function createItem(obj){
	const item = document.createElement('a'),
		imageContainer = document.createElement('div'),
		image = document.createElement('img'),
		year = document.createElement('h5'),
		name = document.createElement('p'),
		rate = document.createElement('h6');
		
	let type = obj.hasOwnProperty('title') ? 'movie' : 'tv';

	image.setAttribute('src', `${BASE_IMAGE_URL}${obj.poster_path}`);
	image.setAttribute('onerror', "this.onerror=null;this.src='assets/image-not-found.png'");
	item.setAttribute('href', `details.html?id=${obj.id}&type=${type}`);
	item.className = 'item';
	imageContainer.className = 'content-img';
	name.textContent = obj.title ?? obj.name;
	let fullYear = obj.release_date ?? obj.first_air_date;
	year.textContent = fullYear.slice(0, 4);
	rate.textContent = Number(obj.vote_average).toFixed(1);

	imageContainer.append(image, year, rate);
	item.append(imageContainer, name);

	return item;
}

//every api call to the server in the others js files use the same structure
function getRequestObject(obj){
	return {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	}
}

export {displayItems, getRequestObject};