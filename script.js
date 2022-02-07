//TMDb 

const API_KEY = 'api_key=e3247e1f93c896efeb4121d493de1239';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },

    {
      "id": 10749,
      "name": "Romance"
    },
   
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 10752,
      "name": "War"
    },
   
  ]

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

var selectedGenre = [];
setGenre();
function setGenre(){
    tagsEl.innerHTML = "";
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click',() => {
            if(selectedGenre.length == 0)
            {
                selectedGenre.push(genre.id);
            }
            else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                            if (id == genre.id) {
                                selectedGenre.splice(idx, 1);
                            }
                        })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')),0);
            highlightSelection();
        })
        tagsEl.append(t);
    })
}

function highlightSelection(){
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('highlight')
  })
  clearButton();
  if(selectedGenre.length != 0){
    selectedGenre.forEach(id => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add('highlight');
    })
  }
  
}

function clearButton(){
  let clearBtn = document.getElementById('clear');
  if(clearBtn){
    clearBtn.classList.add('highlight');
  }
  else{
    let clear = document.createElement('div');
    clear.classList.add('tag','highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear x';
    clear.addEventListener('click', () =>{
    selectedGenre = [];
    setGenre();
    getMovies(API_URL,0);
  })
  tagsEl.append(clear);
  }
}
var rate=0;
getMovies(API_URL,rate);

function getMovies(url,rate1) {
    fetch(url).then(res => res.json()).then(data => {
     /* console.log(rate1);*/
        console.log(data.results);
        if(data.results.length != 0 && rate1==0){
         /* console.log(rate1);*/
          showMovies1(data.results);
        }
        else if(data.results.length != 0 && rate1 != 0){
        //  console.log(rate);
          showMovies2(data.results,rate1);
        }
        else{
          main.innerHTML = "<h1 class='no_results'>No Results Found</h1>";
          alert("No Results Found!!!");
        }
        
    })
}

function showMovies1(data) {
   /* console.log(1);*/
    main.innerHTML = "";
    data.forEach(movie => {
        const {title,poster_path,vote_average,overview,original_language} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3>${title} (${original_language})</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>overview</h3>
                ${overview}
            </div>
        `

        main.appendChild(movieEl);
        
    });
}

function showMovies2(data,rates) {
 // console.log(rates);
  main.innerHTML = "";
  data.forEach(movie => {
      const {title,poster_path,vote_average,overview,original_language} = movie;
      const movieEl = document.createElement('div');
      if(rates == 7.5)
      {
        if(vote_average >=rates )
        {
          movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3>${title} (${original_language})</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>overview</h3>
                ${overview}
            </div>
        `
  
        main.appendChild(movieEl);
        }
      }
      else if( rates == 5)
      {
        if(vote_average >=rates && vote_average <=7.5)
        {
          movieEl.classList.add('movie');
          movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3>${title} (${original_language})</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>overview</h3>
                ${overview}
            </div>
        `

          main.appendChild(movieEl);
        }
      }
      else
      {
        if(vote_average < 5)
        {
          movieEl.classList.add('movie');
          movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3>${title} (${original_language})</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>overview</h3>
                ${overview}
            </div>
        `

          main.appendChild(movieEl);
        }
      }
      
      
  });
}


function getColor(vote) {
    if(vote >= 7.5)
    {
        return "green";
    }
    else if(vote >= 5)
    {
        return "orange";
    }
    else
    {
        return "red";
    }
}

form.addEventListener('submit',(e) => {
    e.preventDefault();

    const searchTerm = search.value;

    selectedGenre = [];
    highlightSelection();

    if(searchTerm)
    {
        getMovies(searchURL + '&query=' + searchTerm ,0);
    }
    else
    {
        getMovies(API_URL,0);
    }
    
})

//toggle
const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".search,body,.navbar-container,.sidebar,.left-menu-icon,.toggle"
);

ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});

function ratings(r){
  console.log(r);
  rate=r;
  getMovies(API_URL,rate);

}

