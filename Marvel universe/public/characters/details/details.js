const URLparams = new URL(document.location).searchParams;
const id = URLparams.get('id');
const months = [
  'JAN','FEB', 'MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'
];

getCharacter(id);

async function getCharacter( id ){
  try{
    const response = await fetch(`../../v1/getDetails/characters,${id}`);
    if(response.ok){
      const dataWrapper = await response.json();
      console.log(dataWrapper);
      displayCharacterInfo(dataWrapper.data);
    }
  }
  catch(err){
    console.log(err)
  }
}

function displayCharacterInfo(dataObject){
  if(dataObject.results.length == 0) return;
  const [characterInfo] = dataObject.results;

  document.getElementById('character-cover').setAttribute('src', `${characterInfo.thumbnail.path}.${characterInfo.thumbnail.extension}`);
  document.getElementById('name').textContent = characterInfo.name;
  const modifiedDate = new Date(characterInfo.modified);
  document.getElementById('date').textContent = `${months[modifiedDate.getMonth()]} ${modifiedDate.getDate()}, ${modifiedDate.getFullYear()}`;
  
  document.getElementById('description').textContent = characterInfo.description ?? '"See the full description in the Official Site"';
  document.getElementById('official-site').setAttribute('href', characterInfo.urls[0].url);
  document.getElementById('wiki').setAttribute('href', characterInfo.urls[1]?.url ?? 'https://www.marvel.com');
  document.getElementById('comics').setAttribute('href', characterInfo.urls[2]?.url ?? 'https://www.marvel.com');

  const comicsRelated = document.getElementById('comic-related');
  characterInfo.comics.items.forEach( comic => {
    comicsRelated.append(createComicTitle(comic));
  })

  document.title = `${characterInfo.name} | Marvel Comics`;
}

function createComicTitle( comic ){
  const listItem = document.createElement('li');
  const anchorTitle = document.createElement('a');
  anchorTitle.textContent = comic.name;
  const comicId = comic.resourceURI.split('/');
  anchorTitle.setAttribute('href', `../../comics/details?id=${comicId[comicId.length-1]}`);
  listItem.append(anchorTitle);
  return listItem;
}