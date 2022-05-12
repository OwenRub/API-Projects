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

// class handler of http requests
class HttpRequest {

  #requestResults;

  constructor(){
    this.#requestResults = [];
  }

  set requestResults( arr ){
    this.#requestResults.push(...arr);
  }

  get requestResults( ){
    return [...this.#requestResults];
  }

  async getCharacters( offset = 0 ){
    try{
      const response = await fetch(`../v1/characters/${offset}`);
      if(response.ok){
        const wrapper = await response.json();
        this.requestResults = wrapper.data.results;
        return wrapper;
      }
    }
    catch(error){
      console.log(error)
    }
  }

  async searchCharacter( nameStartsWith = '' ){
    try{
      const response = await fetch(`../v1/searchCharacter/${nameStartsWith}`);
      if(response.ok){
        const wrapper = await response.json();
        return wrapper;
      }
    }
    catch(error){
      console.log(error)
    }
  }

  async searchComic( titleStartsWith = '' ) {
    try{
      const response = await fetch(`../v1/searchComic/${titleStartsWith}`);
      if(response.ok){
        const wrapper = await response.json();
        return wrapper;
      }
    }
    catch(error){
      console.log(error)
    }
  }

  async getLatestComics( dateDescriptor ){
    try{
      const response = await fetch(`../v1/latestComics/${dateDescriptor}`);
      if(response.ok){
        const wrapper = await response.json();
        return wrapper;
      }
    }
    catch(error){
      console.log(error)
    }
  }

}