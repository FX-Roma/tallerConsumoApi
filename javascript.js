/* function TraerCaracteres(done){
    const results = fetch("https://rickandmortyapi.com/api/character");

    results
    .then(response => response.json())
    .then(data =>{
        done(data)
    });

}

TraerCaracteres(data =>{
    data.results.forEach(personaje =>{

        const article = document.createRange().createContextualFragment(`
            <article>
                <div class="image-container">
                <img src="${personaje.image}" alt="${personaje.name}">
                </div>
                <span>${personaje.name}</span>
                <p>${personaje.species}</p>
                <p>${personaje.gender}</p>
                <p>${personaje.status}</p>
            </article>
            `);

            // mostrar los datos obtenidos del api

            const main = document.querySelector("main");

            main.append(article);

    });
}); */

/* Abrir y cerrar */

const dialogo = document.getElementById('habilitarDialogo')
const botonAbrir = document.getElementById('abrir');
const botonCerrar = document.getElementById('cerrar');

botonAbrir.addEventListener('click', function() {
dialogo.style.display = "block";
});
botonCerrar.addEventListener('click', function() {
dialogo.style.display = "none";
});


/* busqueda */

// inputSearch = document.getElementById("search-anime");
// 
// document.addEventListener('keyup', e =>{
//     if (e.target.matches('#buscador')) {
//         document.querySelectorAll(
//             'articulos' /* crea un arreglo para lo que va a devolverte */
//         ).forEach(anime =>{
//             anime.toLowerCase().includes(e.target.value);
//             ? fruta.classList.remove('filtro')
//             : fruta.classList.add('filtro')
//         })
// 
//     }
// })

/* ... */
