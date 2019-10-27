'use strict';
const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

const mainDiv = createAndAppend('div', root, { class: 'container' });

const nav = createAndAppend('nav', mainDiv, { class: 'nav' });
createAndAppend('h1', nav, {
  text: 'Hack Your Future',
});
const repoInfo = createAndAppend('div', mainDiv, {
  class: 'repo_info',
});
let mainRepo;
let onchange;
let dropdown = createAndAppend('select', nav);
const ul = createAndAppend('ul', root, { class: 'contributors' });

//Init
(function init() {
  main(HYF_REPOS_URL);
})();

//Main Process Function
function main(url) {
  fetchJSON(url, (err, data) => {
    const root = document.getElementById('root');

    if (err) {
      createAndAppend('div', mainDiv, {
        text: err.message,
        class: 'alert-error',
      });
    } else {
      dropdown.length = 0;
      createAndAppend('option', dropdown, {
        text: 'Choose a Repo',
      });
      for (let i = 0; i < data.length; i++) {
        mainRepo = data[i];
        mainRepo = createAndAppend('option', dropdown, {
          text: data[i].name,
          value: i,
        });
      }
      dropdown.onchange = () => {
        getContributors(dropdown.options[dropdown.selectedIndex].text);
      };
      mainRepo = data;
    }
  });
}

/*****************************************************/
// Get Contributors
function getContributors(repo) {
  //Ul & mainDiv clearing
  if (ul.hasChildNodes() && repoInfo.hasChildNodes()) {
    while (ul.hasChildNodes() && repoInfo.hasChildNodes()) {
      ul.removeChild(ul.firstChild);
      repoInfo.removeChild(repoInfo.firstChild);
    }
  }
  let contributorURL = `https://api.github.com/repos/hackyourfuture/${repo}/contributors`;

  fetchJSON(contributorURL, (err, data) => {
    //console.log(data);
    if (err) {
      createAndAppend('div', mainDiv, {
        text: err.message,
        class: 'alert-error',
      });
    }
    // Fetch Repo Information
    createAndAppend('h5', repoInfo, {
      text: `Title: ${dropdown.options[dropdown.selectedIndex].text}`,
    });
    createAndAppend('p', repoInfo, {
      text: `Description: ${mainRepo[dropdown.options[dropdown.selectedIndex].value].description}`,
    });
    createAndAppend('p', repoInfo, {
      text: `Forks: ${mainRepo[dropdown.options[dropdown.selectedIndex].value].forks}`,
    });
    createAndAppend('p', repoInfo, {
      text: `Last updated: ${dateConverter(
        mainRepo[dropdown.options[dropdown.selectedIndex].value].updated_at,
      )}`,
    });

    //creating list of contributors
    data.map(e => {
      let li = createAndAppend('li', ul);
      let a = createAndAppend('a', li, {
        href: e.html_url,
        target: '_blank',
      });
      createAndAppend('h5', a, { text: e.login, class: 'contributor-name' });
      createAndAppend('span', a, { text: e.contributions });
      createAndAppend('img', a, {
        src: e.avatar_url,
        alt: e.login,
      });
    });
  });
}

//Fetch Functions
function fetchJSON(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (xhr.status < 400) {
      cb(null, xhr.response);
    } else {
      cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
    }
  };
  xhr.onerror = () => cb(new Error('Network request failed'));
  xhr.send();
}

//Creating and appending Elements
function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'text') {
      elem.innerText = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

//Helping Functions
function dateConverter(date) {
  let newDate = new Date(date);
  return `${newDate.toLocaleDateString()} - ${newDate.toLocaleTimeString()}`;
}
