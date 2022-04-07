const tbody = document.querySelector("tbody");

// Create random number from 5000 to 10000 and diplay
const visitors = document.querySelector("#visitorsCount");
visitors.textContent = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

const signups = document.querySelector("#signupsCount");
const countryCount = document.querySelector("#countriesCount");

// display select options from data from API

const countrySelect = document.querySelector("#country");
const createOptions = (data) => {
  const option = document.createElement("option");
  option.textContent = data.attributes.country;
  option.id = "option";
  option.value = data.id;

  countrySelect.appendChild(option);
};

// Create table from data from API

const addTable = (element) => {
  const tr = tbody.insertRow();
  const td1 = tr.insertCell();
  const initials = document.createElement("div");
  initials.className = "initials";
  initials.textContent = `${element.attributes.first_name[0]}${element.attributes.last_name[0]}`;
  td1.append(initials);

  const td2 = tr.insertCell();
  const nameSur = document.createElement("h4");
  const mail = document.createElement("p");
  nameSur.textContent = `${element.attributes.first_name} ${element.attributes.last_name}`;
  mail.textContent = `${element.attributes.email}`;
  td2.append(nameSur, mail);
  tr.append(td2);

  const td3 = tr.insertCell();

  if (element.attributes.country.data === null) {
    return (td3.textContent = "No Data");
  }
  if (element.attributes.country.data.attributes.country) {
    return (td3.textContent = `${element.attributes.country.data.attributes.country}`);
  }
};

// Search and select input values for filtering in backend and send to getData function

const search = document.querySelector("#search");

let queries = {
  nameQuery: "",
  countryQuerry: "",
};

search.addEventListener("keyup", (e) => {
  const query = e.target.value;
  queries.nameQuery = query;

  getData(queries);
});

countrySelect.addEventListener("change", (e) => {
  const countryQuerry = e.target.value;
  queries.countryQuerry = countryQuerry;

  getData(queries);
});

const getData = async (queries) => {
  try {
    let url =
      "http://18.193.250.181:1337/api/people?populate=*&pagination[pageSize]=100";

    if (queries) {
      url += `&filters[$or][0][first_name][$containsi]=${queries.nameQuery}&filters[$or][1][last_name][$containsi]=${queries.nameQuery}`;

      if (queries.countryQuerry) {
        url += `&filters[country][id][$eq]=${queries.countryQuerry}`;
      }

      tbody.innerHTML = "";
    }

    const res = await fetch(url);
    const data = await res.json();

    signups.textContent = data.meta.pagination.total;

    if (data.data.length > 0) {
      //  get all unique countries from api and display number of them
      const uniqueCountry = [
        ...new Set(
          data.data.map((obj) => {
            if (obj.attributes.country.data !== null) {
              return obj.attributes.country.data.id;
            }
          })
        ),
      ];

      countryCount.textContent = uniqueCountry.length;

      data.data.forEach((element) => {
        addTable(element);
      });
    }

    if (data.data.length == 0) {
      tbody.innerHTML = `<tr>
        <td >
          Not Found
        </td>
        <td>
          Not Found
        </td>
        <td>
          Not Found
        </td>
      </tr>`;
    }
  } catch (error) {
    alert(error.message || "Problem");

    tbody.innerHTML = "Loading...";
  }
};

// Get all countries from API and put them in select options

const getCountries = async () => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/countries");
    const data = await res.json();

    if (data.data.length > 0) {
      data.data.forEach((element) => {
        createOptions(element);
      });
    }
  } catch (error) {
    alert(error.message || "Problem");
  }
};

getCountries();
getData();
