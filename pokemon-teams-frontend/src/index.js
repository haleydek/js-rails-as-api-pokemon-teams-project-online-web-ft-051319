const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const teams = document.getElementsByTagName("main")[0];
let deleteButtons = document.getElementsByClassName("release");

function buildTeamDiv(teamArray) {
    teamArray.forEach(teamObj => {
        let pokemonMembers = teamObj['pokemons'];

        // Create <div> for a new team
        let div = document.createElement("div");
        div.setAttribute("data-id", teamObj.id)
        div.setAttribute("class", "card");
        teams.appendChild(div);

        // Create <p> for trainer name
        let p = document.createElement("p");
        p.innerHTML = teamObj.name
        div.appendChild(p);

        // Create button for adding a new pokemon to the team
        let addButton = document.createElement("button")
        addButton.setAttribute("data-trainer-id", teamObj.id)
        addButton.innerHTML = "Add Pokemon"
        div.appendChild(addButton);

        // Create list of pokemon on the team
        let ul = document.createElement("ul");
        div.appendChild(ul);

        addButton.addEventListener("click", event => {
            event.preventDefault();

            fetch("http://localhost:3000/pokemons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "trainer_id": teamObj.id
                })
            })
            .then(response => {
                return response.json();
            })
            .then(newPokemonObj => {
                if (newPokemonObj.nickname === undefined) {
                    alert(newPokemonObj.message);
                } else {
                    let li = document.createElement("li");

                    li.innerHTML = `${newPokemonObj.nickname} (${newPokemonObj.species})`
                    ul.appendChild(li);

                    buildReleaseButton(newPokemonObj.id, li);
                }
            })
        })



        for(pokemon of pokemonMembers) {
            let li = document.createElement("li");

            li.innerHTML = `${pokemon.nickname} (${pokemon.species})`
            ul.appendChild(li);

            buildReleaseButton(pokemon.id, li);
        }
    })
}

function buildReleaseButton(pokemonId, li) {
    let releaseButton = document.createElement("button");
    releaseButton.setAttribute("data-pokemon-id", pokemonId)
    releaseButton.setAttribute("class", "release")
    releaseButton.textContent = "Release"
    li.appendChild(releaseButton);

    releaseButton.addEventListener("click", event => {
        event.preventDefault();

        fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "pokemon_id": pokemonId
            })
        })
        .then(response => {
            return response.json();
        })
        .then(deletedPokemonObj => {
            let listElement = event.target.parentElement;
            listElement.remove();
        })
    })
}

fetch(`${TRAINERS_URL}`)
    .then(response => {
        return response.json();
    })
    .then(buildTeamDiv);