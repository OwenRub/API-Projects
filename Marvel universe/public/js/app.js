// SLIDER
const slider = document.querySelector('.slider');
const buttonNext = document.getElementById('right-arrow');
const buttonPrevious = document.getElementById('left-arrow');

buttonNext.addEventListener('click', goNext);
buttonPrevious.addEventListener('click', goPrevious);

const myInterval = setInterval(goNext, 3500);

/* slider functions */
function goNext(){
  const firstSlide = document.querySelectorAll('.slide')[0];
  slider.style.transition = 'all 500ms ease-in';
  slider.style.marginLeft = '-200%';
  setTimeout(() => {
    slider.style.transition = 'none';
    slider.insertAdjacentElement('beforeend', firstSlide);
    slider.style.marginLeft = '-100%';
  }, 500);
}

function goPrevious(){
  const slideSections = document.querySelectorAll('.slide');
  const lastSlide = slideSections[slideSections.length-1];
  slider.style.transition = 'all 500ms ease-in';
  slider.style.marginLeft = '0';
  setTimeout(() => {
    slider.style.transition = 'none';
    slider.insertAdjacentElement('afterbegin', lastSlide);
    slider.style.marginLeft = '-100%';
  }, 500);
}

// NEWS CONTENT
updateNews();
async function updateNews(){
  try{
    const newsResponse = await fetch(`v1/news/marvel`);
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
  for(let i=0; i<4; i++){
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

// TABS
const tabButtons = document.getElementById('tab-buttons').children;

[...tabButtons].forEach(button => button.addEventListener('click', handleButtonClick));

function handleButtonClick(event){
  const selectedBtn = event.target;

  if(!(selectedBtn.className === 'selected')){
    setButtonsClasses(selectedBtn);
    setContentVisibility(selectedBtn.textContent)
  }
}

function setButtonsClasses(button){
  [...tabButtons].forEach(btn => {
    btn.className = '';
  });
  button.className = 'selected';
}

function setContentVisibility(text){
  const idFromButtonText = text.toLowerCase().split(' ').join('-');
  const tabTarget = document.getElementById(idFromButtonText);

  const tabsContent = document.getElementById('tab-content').children;
  [...tabsContent].forEach(tab => tab.className = 'hide');
  
  tabTarget.className = 'tab';
}

