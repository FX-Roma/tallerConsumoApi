const banner = document.getElementById('hero-banner');
const explorar = document.getElementById('main-explorar');
const topAnimes = document.getElementById('main-topAnimes');
const favorites = document.getElementById('main-favorites');

const botonInicio = document.getElementById('abrir-Inicio');
const botonExplorar = document.getElementById('abrir-Explorar');
const botonTop = document.getElementById('abrir-Top');
const botonFavoritos = document.getElementById('abrir-Favoritos');

const secciones = [banner, explorar, topAnimes, favorites];

function ocultarTodasLasSecciones() {
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
}

/**
@param {HTMLElement} seccionAmostrar 
 */
function mostrarSeccion(seccionAmostrar) {
    ocultarTodasLasSecciones();
    seccionAmostrar.style.display = 'block'; 
}

botonInicio.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarSeccion(banner);
    banner.style.display = 'flex'; 
});

botonExplorar.addEventListener('click', (event) => {
    mostrarSeccion(explorar);
    event.preventDefault();
});

botonTop.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarSeccion(topAnimes); 
    cargarTopAnimes();
});

botonFavoritos.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarSeccion(favorites);
});



const dialogo = document.getElementById('habilitarDialogo');
const botonCerrar = document.getElementById('cerrar');


if (botonCerrar && dialogo) {
    botonCerrar.addEventListener('click', () => {
        dialogo.close(); // Método nativo de HTML5
    });
}

/*
 * Función global para ABRIR el diálogo desde cualquier lugar
 * (por ejemplo, al hacer clic en una tarjeta de anime más adelante)
 */

function abrirModalAnime() {
    if (dialogo) {
        dialogo.showModal(); 
    }
}


const btnBanner = document.querySelector('.btn-banner-content-1');

if (btnBanner) {
    btnBanner.addEventListener('click', () => {
        abrirModalAnime();
    });
}
//const Description = document.getElementById('showDescription');
//
//if (Description) {
//    Description.addEventListener('click', () => {
//        abrirModalAnime();
//    });
//}


// DIALOGO PARA CADA DESCRIPTION

/**
 * @param {string} idDialogo 
 */
function abrirModalPorId(idDialogo) {
    const modalTarget = document.getElementById(idDialogo);
    
    if (modalTarget && typeof modalTarget.showModal === 'function') {
        modalTarget.showModal();
    } else {
        console.error(`No se encontró un <dialog> con el ID: "${idDialogo}"`);
    }
}

const botonVerMas = document.getElementById('showDescription');

if (botonVerMas) {
    botonVerMas.addEventListener('click', () => {
        abrirModalPorId('batman');
    });
}

const botonCerrarBatman = document.getElementById('cerrarBatman');
const dialogBatman = document.getElementById('batman');

if (botonCerrarBatman && dialogBatman) {
    botonCerrarBatman.addEventListener('click', () => {
        dialogBatman.close();
    });
}

/* ... */



//animes articulos

const API_URL = "https://kitsu.io/api/edge/anime?page[limit]=20";


function TraerAnimes(done) {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            done(data.data); // Kitsu devuelve la lista en la propiedad 'data'
        })
        .catch(error => {
            console.error('Error consumiendo la API:', error);
            mostrarErrorEnPantalla('No se pudo conectar con la API de Kitsu. Verifica la URL.');
        });
}


TraerAnimes(listaAnimes => {
    const contenedor = document.getElementById("explore-container");
    if (!contenedor) return;

    contenedor.innerHTML = ""; 

    listaAnimes.forEach(anime => {
        const { canonicalTitle, posterImage, averageRating, startDate, showType, synopsis, status, episodeCount } = anime.attributes;

        const imagen = posterImage ? posterImage.small : 'https://via.placeholder.com/200x300';
        const anio = startDate ? startDate.split('-')[0] : 'N/A';
        const rating = averageRating ? `${Math.round(averageRating)}%` : 'N/A';
        const tipo = showType || 'Anime';

        const article = document.createRange().createContextualFragment(`
            <article class="anime-card">
                <div class="image-container">
                    <img src="${imagen}" alt="${canonicalTitle}">
                </div>
                <div class="card-content">
                    <h3>${canonicalTitle}</h3>
                    <span class="badge">${tipo}</span>
                    <div class="card-footer">
                        <span class="rating">⭐ ${rating}</span>
                        <span class="year">${anio}</span>
                    </div>
                </div>
            </article>
        `);

        article.querySelector('.anime-card').addEventListener('click', () => {
            cargarDetallesEnModal({
                canonicalTitle,
                posterImage,
                averageRating: rating,
                status,
                episodeCount,
                synopsis
            });
        });

        contenedor.append(article);
    });
});


function cargarDetallesEnModal(atributos) {
    document.getElementById('modal-title').textContent = atributos.canonicalTitle || 'Sin título';
    document.getElementById('modal-synopsis').textContent = atributos.synopsis || 'Sin descripción disponible.';
    document.getElementById('modal-rating').textContent = `⭐ ${atributos.averageRating}`;
    document.getElementById('modal-status').textContent = atributos.status || 'Desconocido';
    document.getElementById('modal-episodes').textContent = `Episodios: ${atributos.episodeCount || '?'}`;
    
    const imgModal = document.getElementById('modal-img');
    if (imgModal && atributos.posterImage) {
        imgModal.src = atributos.posterImage.medium || atributos.posterImage.small;
        imgModal.alt = atributos.canonicalTitle;
    }

    abrirModalPorId('batman');
}


function mostrarErrorEnPantalla(mensaje) {
    const contenedor = document.getElementById('explore-container');
    if (contenedor) {
        contenedor.innerHTML = `
            <div style="grid-column: 1 / -1; color: #ff5555; text-align: center; padding: 20px;">
                <p>⚠️ ${mensaje}</p>
            </div>
        `;
    }
}

// 30 animes




const API_TOP_URL = "https://kitsu.io/api/edge/anime?page[limit]=20";

function cargarTopAnimes() {
    fetch(API_TOP_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Extraemos el array original
            const animesOriginales = data.data;


            const animesOrdenados = [...animesOriginales].sort((a, b) => {
                const rankA = a.attributes.popularityRank || 999999;
                const rankB = b.attributes.popularityRank || 999999;
                return rankA - rankB;
            });

            // 3. Tomamos los primeros 20 (o los que necesites) usando slice
            const topAnimesFinal = animesOrdenados.slice(0, 20);

            // 4. Renderizamos en el DOM
            renderizarTopAnimes(topAnimesFinal);
        })
        .catch(error => {
            console.error('Error al cargar la sección Top:', error);
        });
}

function renderizarTopAnimes(listaAnimes) {
    // Apuntamos al ID correcto en el HTML: "top-container"
    const contenedorTop = document.getElementById("top-container");

    if (!contenedorTop) return;

    contenedorTop.innerHTML = "";

    listaAnimes.forEach((anime, index) => {
        const { 
            canonicalTitle, 
            posterImage, 
            averageRating, 
            startDate, 
            showType, 
            synopsis, 
            status, 
            episodeCount 
        } = anime.attributes;

        const imagen = posterImage ? posterImage.small : 'https://via.placeholder.com/200x300';
        const anio = startDate ? startDate.split('-')[0] : 'N/A';
        const rating = averageRating ? `${Math.round(averageRating)}%` : 'N/A';
        const tipo = showType || 'Anime';
        const posicionRanking = index + 1;

        const article = document.createRange().createContextualFragment(`
            <article class="anime-card">
                <div class="image-container">
                    <span class="top-badge">⭐ TOP ${posicionRanking}</span>
                    <img src="${imagen}" alt="${canonicalTitle}">
                </div>
                <div class="card-content">
                    <h3>${canonicalTitle}</h3>
                    <span class="badge">${tipo}</span>
                    <div class="card-footer">
                        <span class="rating">⭐ ${rating}</span>
                        <span class="year">${anio}</span>
                    </div>
                </div>
            </article>
        `);

        article.querySelector('.anime-card').addEventListener('click', () => {
            cargarDetallesEnModal({
                canonicalTitle,
                posterImage,
                averageRating: rating,
                status,
                episodeCount,
                synopsis
            });
        });

        contenedorTop.append(article);
    });
};


/* banner buttons */


const btnBannerTop = document.querySelector('.btn-banner-content-2');

if (btnBannerTop && botonTop) {
    btnBannerTop.addEventListener('click', (event) => {
        event.preventDefault(); // prevenir saltos de página en botones
        botonTop.classList.toggle("iluminar");
    });
}

/* search */

const formBusqueda = document.querySelector('.search');
const inputBusqueda = document.getElementById('search-anime');

function buscarAnimes(textoBusqueda) {
    if (!textoBusqueda.trim()) {
        TraerAnimes(renderizarListaExplorar);
        return;
    }

    const API_BUSQUEDA = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(textoBusqueda)}&page[limit]=20`;

    fetch(API_BUSQUEDA)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la búsqueda: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Cambiamos a la sección Explorar para ver los resultados
            mostrarSeccion(explorar);
            
            if (data.data.length === 0) {
                mostrarErrorEnPantalla(`No se encontraron animes para "${textoBusqueda}"`);
            } else {
                renderizarListaExplorar(data.data);
            }
        })
        .catch(error => {
            console.error('Error al realizar la búsqueda:', error);
            mostrarErrorEnPantalla('Ocurrió un error al procesar tu búsqueda.');
        });
}

// Función auxiliar para renderizar los resultados en la grilla de Explorar
function renderizarListaExplorar(listaAnimes) {
    const contenedor = document.getElementById("explore-container");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    listaAnimes.forEach(anime => {
        const { canonicalTitle, posterImage, averageRating, startDate, showType, synopsis, status, episodeCount } = anime.attributes;

        const imagen = posterImage ? posterImage.small : 'https://via.placeholder.com/200x300';
        const anio = startDate ? startDate.split('-')[0] : 'N/A';
        const rating = averageRating ? `${Math.round(averageRating)}%` : 'N/A';
        const tipo = showType || 'Anime';

        const article = document.createRange().createContextualFragment(`
            <article class="anime-card">
                <div class="image-container">
                    <img src="${imagen}" alt="${canonicalTitle}">
                </div>
                <div class="card-content">
                    <h3>${canonicalTitle}</h3>
                    <span class="badge">${tipo}</span>
                    <div class="card-footer">
                        <span class="rating">⭐ ${rating}</span>
                        <span class="year">${anio}</span>
                    </div>
                </div>
            </article>
        `);

        article.querySelector('.anime-card').addEventListener('click', () => {
            cargarDetallesEnModal({
                canonicalTitle,
                posterImage,
                averageRating: rating,
                status,
                episodeCount,
                synopsis
            });
        });

        contenedor.append(article);
    });
}

//  Event Listener para al enviar el formulario 
if (formBusqueda && inputBusqueda) {
    formBusqueda.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitamos recargar la página
        const termino = inputBusqueda.value;
        buscarAnimes(termino);
    });

    inputBusqueda.addEventListener('input', (event) => {
        const termino = event.target.value;
        if (termino.length >= 3 || termino.length === 0) {
            buscarAnimes(termino);
        }
    });
}

/* loading */
