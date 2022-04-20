//  toggle functionality for <800px width devices
const toggleButton = document.getElementById('toggle-menu');
toggleButton.addEventListener('click', () => {
  const menu = document.getElementById('menu-links');
  menu.classList.toggle('show');
});

const slider = document.querySelector('.slider');
const buttonNext = document.getElementById('right-arrow');
const buttonPrevious = document.getElementById('left-arrow');

buttonNext.addEventListener('click', goNext);
buttonPrevious.addEventListener('click', goPrevious);

const myInterval = setInterval(goNext, 3300);

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

