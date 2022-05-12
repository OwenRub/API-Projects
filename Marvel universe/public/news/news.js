// NEWS CONTENT
updateNews();
async function updateNews(){
  try{
    const newsResponse = await fetch(`../v1/news/marvel`);
    if(newsResponse.ok){
      const news = await newsResponse.json();
      addNewsToDocument(news.articles);
    }
  }
  catch(error){
    console.log(error)
  }
}

function addNewsToDocument(articles){
  const articlesContainer = document.getElementById('latest-container')
  for(let i=0; i<20; i++){
    articlesContainer.append(createArticle(articles[i]), document.createElement('hr'));
  }
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