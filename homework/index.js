document.onload = getData();
function getData() {
  let url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  let xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status == 200) {
      let repos = JSON.parse(this.responseText);
      let selector = document.getElementById('repoSelector');
      let defaultOption = document.createElement('option');
      defaultOption.text = 'Choose a repo';
      selector.add(defaultOption);
      selector.selectedIndex = 0;

      repos.sort((a, b) => a.name.localeCompare(b.name));
      let optArr = [];
      for (let i in repos) {
        let option = document.createElement('option');

        option.innerHTML = repos[i].name;
        selector.appendChild(option);
        optArr.push(option);
      }
      selector.onchange = () => showRepoDetails();

      function showRepoDetails() {
        let title = selector.options[selector.selectedIndex].text;
        xhr.open('GET', 'https://api.github.com/repos/HackYourFuture/' + title, true);

        xhr.onload = () => {
          let res = JSON.parse(xhr.response);

          document.getElementById('repoName').innerHTML = 'Repository: ' + res.name;
          document.getElementById('desc').innerHTML = 'Description: ' + res.description;
          document.getElementById('forks').innerHTML = 'Forks: ' + res.forks_count;
          document.getElementById('updated').innerHTML = 'Updated: ' + res.updated_at;

          xhr.open('GET', 'https://api.github.com/repos/HackYourFuture/' + title + '/contributors');

          xhr.onload = () => {
            let cont = JSON.parse(xhr.response);
            for (let i in cont) {
              let avatar = '<img src="' + cont[i].avatar_url + '" width="50px height="60px">';

              let contList = document.getElementById('cont-list');
              let li = document.createElement('li');
              li.innerHTML = avatar + ' ' + ' ' + cont[i].login + '   ' + cont[i].contributions;
              contList.appendChild(li);

              console.log(cont[i].login);
              console.log(cont[i].contributions);
            }
          };
          xhr.send();
        };
        xhr.send();
      }
    } else {
      document.getElementById('title').innerHTML = 'Error:' + this.status + ' ' + this.statusText;
      console.log('Error:', this.status, this.statusText);
    }
  };
  xhr.send();
}
