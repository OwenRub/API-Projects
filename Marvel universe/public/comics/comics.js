const http = new HttpRequest();

// MAKE REQUESTS
http.getLatestComics( 'lastWeek' )
  .then( dataWrapper => displayComics( dataWrapper.data, 'latest-comics-container' ))
  .catch( err => console.log(err) );

http.getLatestComics( 'nextWeek' )
  .then( dataWrapper => displayComics( dataWrapper.data, 'comingsoon-comics-container' ))
  .catch( err => console.log(err) );

// DISPLAY FUNCTIONS
function displayComics( dataContainer, htmlContainer ){

  const comicsContainer = document.getElementById(htmlContainer);

  dataContainer.results.forEach(comic => {
    comicsContainer.append(createComicCover(comic));
  });

}

function createComicCover( comic ){

  const anchorCover = document.createElement('a');
  anchorCover.setAttribute('href', `details?id=${comic.id}`);
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