/*  
  handle http requests and results through an http object.
  HttpRequest class is located in utilities js file 
*/
const http = new HttpRequest();
const buttonNext = document.getElementById('next-page');
const buttonPrev = document.getElementById('prev-page');
const paginationIndex = document.getElementById('pagination-index');
const userInput = document.getElementById('search-character');
const listContainer = document.getElementById('characters-container');
let offset = 0;
let pagination = 1;
let maxPagination = null;
paginationIndex.textContent = pagination;

// INITIALIZATION
// first http request and initialize max pagination index
http.getCharacters( offset )
    .then( dataWrapper => {
      offset += 36;    // number of characters for each load, fixed in server side
      maxPagination = Math.ceil( dataWrapper.data?.total / 36 );
      displayCharacters( dataWrapper.data )  // marvel wraps the data in an object, passes it unwrapped
    })
    .catch(error => console.log(error));


// prevent user interaction while first request response
setTimeout(() => {

  buttonPrev.addEventListener('click', handlePrevBtn);
  buttonNext.addEventListener('click', handleNextBtn);
  userInput.addEventListener('keyup', handleUserSearch);

}, 3000);

// FUNCTIONS
function handleNextBtn( ) {
  pagination++;
  if( pagination == maxPagination ) buttonNext.disabled = true;
  buttonPrev.disabled = false;

  makeRequest();
}

function handlePrevBtn( ) {
  pagination--;
  if( pagination == 1 ) buttonPrev.disabled = true;
  buttonNext.disabled = false;

  makeRequest();
}

async function handleUserSearch( event ){
  // nothing happens if no enter
  if(event.which != 13) return;

  if(event.target.value.trim() == ''){ 
    makeRequest();
  }
  else {
    // remove cards before request response & hide pagination controls
    listContainer.innerHTML = '';
    document.getElementById('buttons-container').style.visibility = 'hidden';

    const dataWrapper = await http.searchCharacter(event.target.value);
    displayCharacters(dataWrapper.data);
  }
}

// use http object to make request (deliberately affects external variables)
async function makeRequest( ){

  // removing cards before request response gives feeling of speed
  listContainer.innerHTML = '';
  paginationIndex.textContent = pagination;

  // search with empty string makes visible pagination controls
  document.getElementById('buttons-container').style.visibility = '';

  // avoid making the request if user is looking for already saved results
  if( http.requestResults.length >= pagination*36 ){
    displayCharacters( { results: http.requestResults.slice((pagination-1)*36, pagination*36) } );
    return;
  }

  const dataWrapper = await http.getCharacters( offset );
  offset += 36;
  displayCharacters( dataWrapper.data );
  
}

// append characters in html container
function displayCharacters( dataObject ){

  dataObject.results.forEach(character => {
    listContainer.append(createCharacterCard(character));
  });

}

// create elements for container
function createCharacterCard(character){

  const anchorCard = document.createElement('a');
  anchorCard.setAttribute('href', `details?id=${character.id}`);
  anchorCard.className = 'character-card';

  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `${character.thumbnail.path}.${character.thumbnail.extension}`);
  cardImage.setAttribute('alt', character.name);

  const cardName = document.createElement('div');
  cardName.className = 'character-title';

  const characterName = document.createElement('p');
  characterName.textContent = character.name;

  cardName.append(characterName);
  anchorCard.append(cardImage, cardName);

  return anchorCard;
}

function createArticle(article){
  const articleBody = document.createElement('article');

  const articleImg = document.createElement('img');
  articleImg.setAttribute('src', article.urlToImage);
  const articleImgLink = document.createElement('a');
  articleImgLink.setAttribute('href', article.url);
  articleImgLink.setAttribute('target', '_blank');
  articleImgLink.append(articleImg);

  const articleSource = document.createElement('p');
  articleSource.className = 'new-source';
  articleSource.textContent = article.source?.name;

  const articleTitle = document.createElement('h3');
  articleTitle.textContent = article.title;
  const articleTitleLink = document.createElement('a');
  articleTitleLink.setAttribute('href', article.url);
  articleTitleLink.setAttribute('target', '_blank');
  articleTitleLink.className = 'new-link';
  articleTitleLink.append(articleTitle);

  const articleDate = document.createElement('p');
  articleDate.className = 'new-date';
  articleDate.textContent = getTimeAgo(article.publishedAt);

  const articleInfo = document.createElement('div');
  articleInfo.append(articleSource, articleTitleLink, articleDate);

  articleBody.append(articleImgLink, articleInfo);
  return articleBody;
}

function getTimeAgo(dateString){
  const now = Date.now();
  const articlePub = new Date(dateString).getTime();
  const difference = Math.round((now - articlePub)/1000);

  if(difference < 60) {
    return `Just now`;
  }
  else if(difference < 3600) {
    const rounded = Math.floor(difference/60);
    return `${rounded} minute${rounded > 1 ? 's' : ''} ago`
  }
  else if(difference < 86400) {
    const rounded = Math.floor(difference/3600)
    return `${rounded} hour${rounded > 1 ? 's' : ''} ago`;
  }
  else if(difference < 604800) {
    const rounded = Math.floor(difference/86400)
    return `${rounded} day${rounded > 1 ? 's' : ''} ago`;
  }
  else if(difference < 2592000) {
    const rounded = Math.floor(difference/604800)
    return `${rounded} week${rounded > 1 ? 's' : ''} ago`;
  }
  else {
    const rounded = Math.floor(difference/2592000)
    return `${rounded} month${rounded > 1 ? 's' : ''} ago`;
  }
}