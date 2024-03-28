// Arreglo para almacenar las películas
var peliculas = [];

// Función para agregar una nueva película al catálogo
function agregarPelicula(pelicula) {
  peliculas.push(pelicula); // Agrega la película al arreglo de películas
  mostrarPeliculas(); // Llama a la función para mostrar las películas en la página
}

// Función para mostrar un aviso si la película ya fue añadida
function mostrarAviso() {
  alert("¡Esta película ya ha sido añadida anteriormente!"); // Muestra un mensaje de alerta
}

// Función para obtener la información de la película de la API y agregarla al catálogo
function obtenerInfoYAgregarPelicula() {
  var tituloPelicula = document.getElementById("pelicula").value; // Obtiene el título de la película ingresado por el usuario

  // Verificar si la película ya fue añadida previamente
  if (
    peliculas.some(
      (pelicula) =>
        pelicula.nombre.toLowerCase() === tituloPelicula.toLowerCase()
    )
  ) {
    mostrarAviso(); // Llama a la función para mostrar un aviso si la película ya está en el catálogo
    return; // Sale de la función si la película ya está en el catálogo
  }

  // URL de la API de The Movie Database
  const apiKey = "579f212feba67229432f94a588090d2c"; // Clave de API para acceder a la base de datos de películas
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-419&query=${encodeURIComponent(
    tituloPelicula
  )}`;

  // Realizar la solicitud a la API
  fetch(url) // Realiza una solicitud GET a la API
    .then((response) => response.json()) // Convierte la respuesta a JSON
    .then((data) => {
      if (data.results.length === 0) {
        throw new Error(
          "No se encontró información para la película ingresada."
        ); // Lanza un error si no se encuentra información para la película ingresada
      }
      const movie = data.results[0]; // Obtiene la primera película de los resultados de la búsqueda
      const movieId = movie.id; // Obtiene el ID de la película
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-419&append_to_response=videos`; // URL para obtener información detallada de la película, incluidos los videos

      // Realizar la solicitud para obtener información detallada de la película, incluidos los videos
      fetch(movieUrl) // Realiza una solicitud GET a la API para obtener información detallada de la película
        .then((response) => response.json()) // Convierte la respuesta a JSON
        .then((movieData) => {
          const trailer = movieData.videos.results.find(
            (video) => video.iso_639_1 === "es" && video.type === "Trailer"
          ); // Busca el tráiler de la película en español
          // Crear objeto de película con la información obtenida de la API
          var pelicula = {
            nombre: movieData.title, // Título de la película
            enlace: `https://image.tmdb.org/t/p/w185${movieData.poster_path}`, // Enlace a la imagen de la portada de la película
            trailer: trailer
              ? `https://www.youtube.com/watch?v=${trailer.key}`
              : "N/A", // Enlace al tráiler de la película o "N/A" si no hay tráiler disponible
          };
          // Agregar la película al catálogo
          agregarPelicula(pelicula); // Llama a la función para agregar la película al catálogo
          document.getElementById("pelicula").value = "";
        })
        .catch((error) => {
          console.error(error); // Muestra cualquier error en la consola
        });
    })
    .catch((error) => {
      alert(error); // Muestra cualquier error en un mensaje de alerta
    });
}

// Función para mostrar las películas en la página
function mostrarPeliculas() {
  var listaPeliculas = document.getElementById("listaPeliculas"); // Obtiene el elemento HTML donde se mostrarán las películas
  listaPeliculas.innerHTML = ""; // Limpia cualquier contenido previo en el elemento

  // Recorrer el arreglo de películas y añadirlas al DOM
  peliculas.forEach(function (pelicula) {
    var peliculaDiv = document.createElement("div"); // Crea un elemento div para mostrar la película
    peliculaDiv.classList.add("pelicula"); // Añade una clase al div creado

    // Crear una imagen de la portada de la película
    var portadaImg = document.createElement("img"); // Crea un elemento img para mostrar la portada de la película
    portadaImg.src = pelicula.enlace; // Establece la fuente de la imagen como el enlace a la portada de la película
    portadaImg.alt = pelicula.nombre; // Establece el atributo alt de la imagen como el nombre de la película

    // Agregar un evento al hacer clic en la imagen para ir al trailer
    portadaImg.addEventListener("click", function () {
      if (pelicula.trailer && pelicula.trailer !== "N/A") {
        window.open(pelicula.trailer, "_blank"); // Abre el enlace del tráiler en una nueva pestaña si está disponible
      } else {
        alert("No se encontró trailer para esta película."); // Muestra un mensaje de alerta si no hay tráiler disponible
      }
    });

    // Crear un elemento de texto para mostrar el nombre de la película
    var tituloPelicula = document.createElement("p"); // Crea un elemento p para mostrar el nombre de la película
    tituloPelicula.textContent = pelicula.nombre; // Establece el texto del elemento como el nombre de la película

    peliculaDiv.appendChild(portadaImg); // Agrega la imagen al div de la película
    peliculaDiv.appendChild(tituloPelicula); // Agrega el nombre de la película al div de la película
    listaPeliculas.appendChild(peliculaDiv); // Agrega el div de la película al contenedor de películas en la página
  });
}
