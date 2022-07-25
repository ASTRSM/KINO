import "./style/style.css";
import "./component/top.js";
import "regenerator-runtime";
import $ from "jquery";

const imageUrl = "https://image.tmdb.org/t/p/w500";
let popular = true;
let result;

document.addEventListener("DOMContentLoaded", () => {
  $("#searchSubmit").on("click", (event) => {
    event.preventDefault();
    let keyword = $("#searchMovieTitle").val().split(" ").join("+");
    $("#movie-list").html("");
    searchMovie(keyword);
  });
  showPopular();
});

async function searchMovie(keyword) {
  try {
    popular = false;
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=330633495ca3dad72ff78aa2656624eb&append_to_response=videos&query=${keyword}`
    );
    const responseJson = await response.json();
    if (responseJson.results) {
      renderSuccess(responseJson.results);
    } else {
      return `${keyword} is not found`;
    }
  } catch (error) {
    alert(error);
  }
}

async function showPopular() {
  try {
    popular = true;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=330633495ca3dad72ff78aa2656624eb&language=en-US&page=1`
    );
    const responseJson = await response.json();
    renderSuccess(responseJson.results);
  } catch (error) {
    alert(error);
  }
}

function renderSuccess(movies) {
  $("main").children().html("");
  if (popular == true) {
    $("#popular").html("Popular");
  }
  movies.forEach((movie) => {
    $("#movie-list").append(`
      <article class="movie" id="${movie.id}">
      <img src="${imageUrl}${movie.poster_path}" alt="">
      <div class="desc">
          <h3 class="title">
              ${movie.title}
          </h3>
          <p class="year">(${movie.release_date})</p>
      </div>
      </article>`);
  });

  // =======================POPUP==========================

  $(".movie").each(function () {
    $(this).on("click", (event) => {
      const id = event.target.parentNode.id;
      $("#popup").css("display", "block");
      showDetails(id);
    });
  });

  // silang
  $("#close").on("click", () => {
    $("#popup").css("display", "none");
  });

  // ketika menekan diluar popup
  const popup = document.querySelector("#popup");
  window.onclick = (event) => {
    if (event.target == popup) {
      $("#popup").css("display", "none");
    }
  };
}

async function showDetails(id) {
  try {
    const detailResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=330633495ca3dad72ff78aa2656624eb&append_to_response=videos`
    );
    const detail = await detailResponse.json();
    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=330633495ca3dad72ff78aa2656624eb&language=en-US`
    );
    const trailer = await trailerResponse.json();
    if (trailer.result == undefined) {
      result = trailer.results.filter(
        (obj) =>
          obj.name.toUpperCase().includes("Official Trailer".toUpperCase()) ||
          obj.name.toUpperCase().includes("Trailer".toUpperCase())
      );
      result = result[0].key;
    } else {
      result = undefined;
    }

    // let genres = [];
    // detail.genres.forEach((genre) => {
    //   genres.push(genre.name);
    // });
    // genres = genres.join(", ");

    $("#popup").html("");
    $("#popup").append(`
    <article class="detail">
        <span id="close">&times;</span>
        <div>
          <h1>${detail.title}</h1>
          <div class="flex-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${result}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
    </article>`);
  } catch (error) {
    console.log(error);
  }
}
