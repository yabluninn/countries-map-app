const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

map.on("click", function (e) {
  var latlng = e.latlng;
  var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let countryName = data.address.country;
      let countryCode = data.address.country_code;
      countryCode = countryCode.toUpperCase();
      if (countryName == "Россия") {
        countryName = "Кацапщина";
      }

      fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then((response) => response.json())
        .then((countryData) => {
          // Обработка данных
          console.log(countryData);
          let population = countryData[0].population.toLocaleString();
          population = population.replace(/\s/g, ".");
          let mainCurrency = Object.keys(countryData[0].currencies);
          let mainCurrencySymbol =
            countryData[0].currencies[mainCurrency].symbol;
          // showBordersPolygon(countryData[0].name);
          const popup = L.popup();
          popup.options.offset = L.point(0, 0);
          popup
            .setLatLng(e.latlng)
            .setContent(
              `      <div class="modal-header-block">
              <img
                src="https://flagsapi.com/${countryCode}/shiny/64.png"
                alt="flag"
                class="modal-country-flag"
              />
              <p class="modal-header-title">${countryName}</p>
            </div>
            <div class="modal-main-info-block">
            <div class="modal-info-subblock">
              <i class="fa-solid fa-landmark-flag"></i>
              <p class="modal-capital-label">${countryData[0].capital[0]}</p>
            </div>
            <div class="modal-info-subblock">
              <i class="fa-solid fa-people-group"></i>
              <p class="modal-population-label">${population}</p>
            </div>
            <div class="modal-info-subblock">
              <i class="fa-solid fa-coins"></i>
              <p class="modal-currency-label">${mainCurrencySymbol} (${mainCurrency})</p>
            </div>
          </div>
            <div class="modal-button-subblock">
              <button class="modal-more-btn">More info</button>
             </div>
            `
            )
            .openOn(map);
          const moreInfoButton = document.querySelector(".modal-more-btn");
          moreInfoButton.addEventListener("click", function () {
            // const url = `https://github.com/factbook/factbook.json/raw/master/${continent}/${countryCode.toLowerCase()}.json`;
            // window.open(url, "_blank");
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
});

const searchButton = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
searchButton.addEventListener("click", function () {
  let countryName = searchInput.value;
  const url = `https://restcountries.com/v2/name/${countryName}?fullText=true`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let population = data[0].population.toLocaleString();
      population = population.replace(/\s/g, ".");
      let mainCurrency = Object.keys(data[0].currencies);
      let mainCurrencySymbol = data[0].currencies[mainCurrency].symbol;
      let mainCurrencyCode = data[0].currencies[mainCurrency].code;
      // showBordersPolygon(data[0].name);
      const popup = L.popup();
      popup.options.offset = L.point(0, 0);
      popup
        .setLatLng(data[0].latlng)
        .setContent(
          `<div class="modal-header-block">
          <img
            src="https://flagsapi.com/${data[0].alpha2Code}/shiny/64.png"
            alt="flag"
            class="modal-country-flag"
          />
          <p class="modal-header-title">${data[0].name}</p>
        </div>
        <div class="modal-main-info-block">
        <div class="modal-info-subblock">
          <i class="fa-solid fa-landmark-flag"></i>
          <p class="modal-capital-label">${data[0].capital}</p>
        </div>
        <div class="modal-info-subblock">
          <i class="fa-solid fa-people-group"></i>
          <p class="modal-population-label">${population}</p>
        </div>
        <div class="modal-info-subblock">
          <i class="fa-solid fa-coins"></i>
          <p class="modal-currency-label">${mainCurrencySymbol} (${mainCurrencyCode})</p>
        </div>
      </div>
        <div class="modal-button-subblock">
          <button class="modal-more-btn">More info</button>
         </div>
        `
        )
        .openOn(map);
    });
});

// function showBordersPolygon(countryName) {
//   // omnivore
//   //   .geojson(
//   //     `https://nominatim.openstreetmap.org/search.php?q=${countryName}}&polygon_geojson=1&format=json`
//   //   )
//   //   .addTo(map);
//   var url = `https://nominatim.openstreetmap.org/search.php?q=${countryName}&polygon_geojson=1&format=json`;
//   fetch(url)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       console.log(data[0].geojson);
//       var polygon = L.polygon(data[0].geojson.coordinates, {
//         color: "red",
//       }).addTo(map);
//     });
// }
