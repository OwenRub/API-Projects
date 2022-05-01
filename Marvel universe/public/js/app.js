//  toggle functionality for <800px width devices
const toggleButton = document.getElementById('toggle-menu');
toggleButton.addEventListener('click', () => {
  const menu = document.getElementById('menu-links');
  menu.classList.toggle('show');
});

// toggle go up button
window.addEventListener('scroll', event => {
  const scrollHeight = window.pageYOffset;
  const goTopButton = document.getElementById('go-top-btn');

  goTopButton.addEventListener('click', () => {
    window.scrollTo({
      left: 0,
      top: 0
    });
  });

  scrollHeight > 500 ? goTopButton.className = 'show-btn' : goTopButton.className = 'hide-btn';
});

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
  const date = new Date();
  try{
    const newsResponse = await fetch(`v1/news/${date}`);
    if(newsResponse.ok){
      const news = await newsResponse.json();
      addNewsToDocument(news.articles);
    }
  }
  catch(error){

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
  articleDate.textContent = article.publishedAt.split('T')[0];

  const articleInfo = document.createElement('div');
  articleInfo.append(articleSource, articleTitleLink, articleDate);

  articleBody.append(articleImgLink, articleInfo);
  return articleBody;
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

