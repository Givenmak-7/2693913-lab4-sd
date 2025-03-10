const countryInput = document.getElementById("country_name");
const button = document.getElementById("button");
const countryTitle = document.getElementById("country_title");
const countryFlag = document.getElementById("country_flag");
const capitalElem = document.getElementById("capital");
const populationElem = document.getElementById("population");
const regionElem = document.getElementById("region");
const neighborsList = document.getElementById("neighbors");

button.onclick = function () {
    fetchCountryInfo(countryInput.value);
};

function fetchCountryInfo(countryName) {
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 404) {
                countryTitle.textContent = "Country not found";
                capitalElem.textContent = "";
                regionElem.textContent = "";
                populationElem.textContent = "";
                countryFlag.src = null;
                neighborsList.innerHTML = "";
                return;
            }

            const country = data[0]; // Get the first match?
            countryTitle.textContent = country.name.common;
            countryFlag.src = country.flags.svg;
            capitalElem.textContent = country.capital ? country.capital[0] : "N/A";
            populationElem.textContent = country.population.toLocaleString();
            regionElem.textContent = country.region;

            neighborsList.innerHTML = "";

            const borders = country.borders || [];
            if (borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`)
                    .then(response => response.json())
                    .then(neighborData => {
                        neighborData.forEach(neighbor => {
                            const listItem = document.createElement("li");
                            const flagImg = document.createElement("img");
                            flagImg.src = neighbor.flags.png;
                            flagImg.width = 60;
                            
                            const neighborName = document.createElement("p");
                            neighborName.textContent = ` ${neighbor.name.common}`;
                            
                            listItem.appendChild(flagImg);
                            listItem.appendChild(neighborName);
                            neighborsList.appendChild(listItem);
                        });
                    })
                    .catch(error => console.error("Error fetching neighboring countries:", error));
            } else {
                const noNeighbors = document.createElement("li");
                noNeighbors.textContent = "No neighboring countries";
                neighborsList.appendChild(noNeighbors);
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}