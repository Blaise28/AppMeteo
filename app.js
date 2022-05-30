const cles_api = "387707c66d8b9a12b398b81737bc6c1d";
let result_api;

const temps = document.querySelector(".desc_temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");

const heure = document.querySelectorAll(".hour_change");
const temp_pour_heure = document.querySelectorAll(".changes_meteo");

const jour_prev_name = document.querySelectorAll(".jour_previs_name");
const jour_prev_meteo = document.querySelectorAll(".jour_previs_meteo");

const logo_meteo = document.querySelector(".logo_meteo img");

const contener_preloader = document.querySelector(".contener_preloader");

/**
 * pour la gestion du temps
 */

const jours_semaine = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

let date = new Date();
let options = { weekday: "long" };
let jour_actuel = date.toLocaleDateString("fr-FR", options);
jour_actuel = jour_actuel.charAt(0).toUpperCase() + jour_actuel.slice(1);

let tab_jours_ordre = jours_semaine
  .slice(jours_semaine.indexOf(jour_actuel))
  .concat(jours_semaine.slice(0, jours_semaine.indexOf(jour_actuel)));

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;

      appel_api(long, lat);
    },
    () => {
      alert("L'application fonctionne quand la localistation");
    }
  );
}

function appel_api(long, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lon=${long}&lat=${lat}&exclude=minutely&units=metric&lang=fr&appid=${cles_api}`
  )
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      result_api = data;
      console.log(result_api);
      temps.textContent = result_api.current.weather[0].description;
      temperature.textContent = `${Math.trunc(result_api.current.temp)}°`;
      localisation.textContent = result_api.timezone;

      let heure_actuelle = new Date().getHours();

      for (i = 0; i < heure.length; i++) {
        let heure_increm = heure_actuelle + i * 3;
        if (heure_increm > 24) heure[i].textContent = `${heure_increm - 24} h`;
        else if (heure_increm === 24) heure[i].textContent = "00 h";
        else heure[i].textContent = `${heure_increm} h`;
      }

      for (let j = 0; j < temp_pour_heure.length; j++) {
        temp_pour_heure[j].textContent = `${Math.trunc(
          result_api.hourly[j * 3].temp
        )}°`;
      }

      for (let i = 0; i < tab_jours_ordre.length; i++) {
        /**
         * pour prendre les 3 premiers lettres
         */
        jour_prev_name[i].textContent = tab_jours_ordre[i].slice(0, 3);
      }
      for (let i = 0; i < tab_jours_ordre.length; i++) {
        jour_prev_meteo[i].textContent = `${Math.trunc(
          result_api.daily[i + 1].temp.day
        )}°`;
      }

      /**
       * icone dynamique par rapport au moment du jour
       */
      if (heure_actuelle >= 6 && heure_actuelle < 21) {
        logo_meteo.src = `./images/jour/${result_api.current.weather[0].icon}.svg`;
      } else {
        logo_meteo.src = `./images/nuit/${result_api.current.weather[0].icon}.svg`;
      }

      contener_preloader.classList.add("fond_out");
    });
}
