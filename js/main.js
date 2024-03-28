// Arreglo para almacenar las películas
var peliculas = [];

// Función para agregar una nueva película al catálogo
function agregarPelicula(pelicula) {
  peliculas.push(pelicula);
  mostrarPeliculas();
}

// Función para mostrar un aviso si la película ya fue añadida
function mostrarAviso() {
  alert("¡Esta película ya ha sido añadida anteriormente!");
}

// Función para obtener la información de la película de la API y agregarla al catálogo
function obtenerInfoYAgregarPelicula() {
  var tituloPelicula = document.getElementById("pelicula").value;

  // Verificar si la película ya fue añadida previamente
  if (
    peliculas.some(
      (pelicula) =>
        pelicula.nombre.toLowerCase() === tituloPelicula.toLowerCase()
    )
  ) {
    mostrarAviso();
    return;
  }

  // URL de la API de The Movie Database
  const apiKey = "579f212feba67229432f94a588090d2c"; // Reemplaza por tu API Key
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-419&query=${encodeURIComponent(
    tituloPelicula
  )}`;

  // Realizar la solicitud a la API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length === 0) {
        throw new Error(
          "No se encontró información para la película ingresada."
        );
      }
      const movie = data.results[0]; // Tomamos la primera coincidencia
      const movieId = movie.id;
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-419&append_to_response=videos`;

      // Realizar la solicitud para obtener información detallada de la película, incluidos los videos
      fetch(movieUrl)
        .then((response) => response.json())
        .then((movieData) => {
          const trailer = movieData.videos.results.find(
            (video) => video.iso_639_1 === "es" && video.type === "Trailer"
          );
          // Crear objeto de película con la información obtenida de la API
          var pelicula = {
            nombre: movieData.title,
            enlace: `https://image.tmdb.org/t/p/w185${movieData.poster_path}`,
            trailer: trailer
              ? `https://www.youtube.com/watch?v=${trailer.key}`
              : "N/A",
          };
          // Agregar la película al catálogo
          agregarPelicula(pelicula);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      alert(error);
    });
}

// Función para mostrar las películas en la página
function mostrarPeliculas() {
  var listaPeliculas = document.getElementById("listaPeliculas");
  listaPeliculas.innerHTML = "";

  // Recorrer el arreglo de películas y añadirlas al DOM
  peliculas.forEach(function (pelicula) {
    var peliculaDiv = document.createElement("div");
    peliculaDiv.classList.add("pelicula");

    // Crear una imagen de la portada de la película
    var portadaImg = document.createElement("img");
    portadaImg.src = pelicula.enlace;
    portadaImg.alt = pelicula.nombre;

    // Agregar un evento al hacer clic en la imagen para ir al trailer
    portadaImg.addEventListener("click", function () {
      if (pelicula.trailer && pelicula.trailer !== "N/A") {
        window.open(pelicula.trailer, "_blank");
      } else {
        alert("No se encontró trailer para esta película.");
      }
    });

    // Crear un elemento de texto para mostrar el nombre de la película
    var tituloPelicula = document.createElement("p");
    tituloPelicula.textContent = pelicula.nombre;

    peliculaDiv.appendChild(portadaImg);
    peliculaDiv.appendChild(tituloPelicula);
    listaPeliculas.appendChild(peliculaDiv);
  });
}
