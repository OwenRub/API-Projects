const http = new HttpRequest();
const userInput = document.getElementById('search-input');
const tabButtons = document.getElementById('tab-buttons-container').children;
const tabsContent = document.getElementById('search-results-container').children;
const domCreatorFunctions = {
  characters: createCharacterCard,
  comics: createComicCover,
  articles: createArticle,
};

// EVENT LISTENERS
userInput.addEventListener('keyup', handleUserInput );

[...tabButtons].forEach( btn => {
  btn.addEventListener('click', handleButtonClick);
})

// FUNCTIONS
function handleUserInput( event ){

  if(event.which != 13) return;

  const input = event.target.value.trim();
  console.log(input)

  if( input ) {
    http.searchCharacter( input ).then( dataWrapper => displayContent( dataWrapper.data, 'characters' ) );
    http.searchComic( input ).then( dataWrapper => displayContent( dataWrapper.data, 'comics' ) );
    fetch(`../v1/news/${input}`).then( response => response.json()).then( news => displayContent(news, 'articles'));
  }
    
}

function handleButtonClick( event ){

  const button = event.target;
  if(button.classList.contains('selected-tab')) return;

  [...tabButtons].forEach( btn => btn.className = 'search-tab');
  button.classList.add('selected-tab');

  const idFromButton = button.textContent.toLowerCase();
  const tabSelected = document.getElementById(idFromButton);

  [...tabsContent].forEach( item => {
    if(!item.classList.contains('hidden')) item.classList.add('hidden');
  });
  tabSelected.classList.remove('hidden');

}

function displayContent( dataContainer, htmlContainer ){

  const resultsContainer = document.getElementById(htmlContainer);
  resultsContainer.innerHTML = '';
  const targetProperty = htmlContainer == 'articles' ? 'articles' : 'results'

  dataContainer[targetProperty].forEach(item => {
    resultsContainer.append( domCreatorFunctions[htmlContainer](item) );
  });

}

function createComicCover( comic ){

  const anchorCover = document.createElement('a');
  anchorCover.setAttribute('href', `../comics/details?id=${comic.id}`);
  anchorCover.className = 'comic-card';

  const comicImage = document.createElement('img');
  comicImage.setAttribute('src', `${comic.thumbnail.path}.${comic.thumbnail.extension}`);
  comicImage.setAttribute('alt', comic.title);

  const comicName = document.createElement('div');
  comicName.className = 'comic-title';

  const comicTitle = document.createElement('p');
  comicTitle.textContent = comic.title;

  comicName.append(comicTitle);
  anchorCover.append(comicImage, comicName);

  return anchorCover;
}

function createCharacterCard(character){

  const anchorCard = document.createElement('a');
  anchorCard.setAttribute('href', `../characters/details?id=${character.id}`);
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