const urlParams = (new URL(document.location)).searchParams;
const id = urlParams.get('id');
const months = [
  'JAN','FEB', 'MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'
];

getComic(id);

async function getComic( id ){
  try{
    const response = await fetch(`../../v1/getDetails/comics,${id}`);

    if( response.ok ){
      const dataWrapper = await response.json();
      console.log(dataWrapper);
      displayComicInformation( dataWrapper.data )
    }
  }
  catch(err){
    console.log(err)
  }
}

function displayComicInformation( dataObject ){

  if(dataObject.results.length == 0) return;

  const [comicInfo] = dataObject.results;
  console.log(comicInfo)

  document.getElementById('comic-cover').setAttribute('src', `${comicInfo.thumbnail.path}.${comicInfo.thumbnail.extension}`);
  document.getElementById('title').textContent = comicInfo.title;
  const comicDate = new Date(comicInfo.dates[0].date);
  document.getElementById('date').textContent = `${months[comicDate.getMonth()]} ${comicDate.getDate()}, ${comicDate.getFullYear()}`;
  const roles = getRoles( comicInfo.creators.items );
  document.getElementById('writer').textContent = roles['writer'] ?? 'Not available';
  document.getElementById('inker').textContent = roles['inker'] ?? 'Not available';
  document.getElementById('cover-artist').textContent = roles['penciler (cover)'] ?? 'Not available';
  document.getElementById('description').textContent = comicInfo.description ?? '"See the full description in the Official Site"';
  document.getElementById('official-site').setAttribute('href', comicInfo.urls[0].url);
  document.getElementById('purchase').setAttribute('href', comicInfo.urls[1]?.url ?? 'https://www.marvel.com');
  document.getElementById('price').textContent = comicInfo.prices[0].price;
  document.getElementById('pages').textContent = comicInfo.pageCount;
  document.getElementById('upc').textContent = comicInfo.upc;
  document.getElementById('format').textContent = comicInfo.format;
  document.title = `${comicInfo.title} | Marvel Comics`;
}

function getRoles( arr ){
  return arr.reduce((acum, curr) => {
    acum[curr.role] = curr.name;
    return acum;
  }, {});

}