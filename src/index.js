import './style/style.css'
import './component/top.js'
import 'regenerator-runtime'

const imageUrl = 'https://image.tmdb.org/t/p/w500'

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchSubmit').addEventListener('click', (event) => {
    event.preventDefault()
    const keyword = document
      .querySelector('#searchMovieTitle')
      .value.split(' ')
      .join('+')
    document.getElementById('movie-list').innerHTML = ''
    keyword ? searchMovie(keyword) : showPopular()
  })
  showPopular()
})

async function searchMovie(keyword) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=330633495ca3dad72ff78aa2656624eb&append_to_response=videos&query=${keyword}`
    )
    const responseJson = await response.json()
    if (responseJson.results) {
      renderSuccess(responseJson.results, 'search')
    } else {
      return `${keyword} is not found`
    }
  } catch (error) {
    alert(error)
  }
}

async function showPopular() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=330633495ca3dad72ff78aa2656624eb&language=en-US&page=1`
    )
    const responseJson = await response.json()
    renderSuccess(responseJson.results, 'popular')
  } catch (error) {
    alert(error)
  }
}

function renderSuccess(movies, type) {
  const header = document.querySelector('#popular')
  header.textContent = type == 'popular' ? 'Popular Movies' : ''

  const movieList = document.getElementById('movie-list')

  movies.forEach((movie) => {
    const markup = `
      <article class="movie" id="${movie.id}">
        <img src="${imageUrl}${movie.poster_path}" alt="">
        <div class="desc" id="${movie.id}">
          <h3 class="title">${movie.title}</h3>
          <p class="year">(${movie.release_date})</p>
        </div>
      </article>`
    movieList.insertAdjacentHTML('beforeend', markup)
  })

  // =======================POPUP==========================
  const popup = document.querySelector('#popup')

  document.querySelectorAll('.movie').forEach((movie) => {
    movie.addEventListener('click', (event) => {
      popup.innerHTML = ''

      const id = event.target.parentNode.id
      popup.style.display = 'block'
      showDetails(id)
    })
  })
}

async function showDetails(id) {
  try {
    const detailResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=330633495ca3dad72ff78aa2656624eb&append_to_response=videos`
    )
    const detail = await detailResponse.json()

    const genres = detail.genres.map((genre) => genre.name).join(', ')

    const popup = document.querySelector('#popup')
    popup.insertAdjacentHTML(
      'beforeend',
      `
    <article class="detail">
        <span id="close">&times;</span>
        <div>
          <h1>${detail.title}</h1>
          <div class="flex-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${await showTrailer(
              id
            )}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="side">
              <div class="movie-desc">
                <h2>Overview</h2>
                <p>${detail.overview}</p>
                <p><b>Genres</b> :  ${genres}</p>
                <p><b>Runtime</b> :  ${detail.runtime} minutes</p>
              </div>
              <div class="rating">
                    <h1>${detail.vote_average}</h1>
                    <p>Vote Average</p>
              </div>
            </div>
          </div>
        </div>
    </article>`
    )

    // silang
    document.querySelector('#close').addEventListener('click', () => {
      popup.style.display = 'none'
    })

    // ketika menekan diluar popup
    window.onclick = (event) => {
      if (event.target == popup) {
        popup.style.display = 'none'
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function showTrailer(id) {
  try {
    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=330633495ca3dad72ff78aa2656624eb&language=en-US`
    )
    const trailer = await trailerResponse.json()

    if (trailer?.results != undefined) {
      const official = trailer.results.filter(
        (obj) =>
          obj.name.toUpperCase().includes('Official Trailer'.toUpperCase()) ||
          obj.name.toUpperCase().includes('Trailer'.toUpperCase())
      )
      return official[0] ? official[0].key : trailer.results[0].key
    } else {
      return undefined
    }
  } catch (error) {
    console.log(error)
  }
}
