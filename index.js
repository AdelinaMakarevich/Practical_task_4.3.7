let formValue = document.getElementById("formData");
let cooldown = true;
const input = document.querySelector("input");
const log = document.getElementById("values");
let url;

formValue.addEventListener("input", debounce);
function debounce() {
  url = `https://api.github.com/search/repositories?q=${formValue.value}&per_page=5`;
  if (cooldown == true) {
    cooldown = false;
    setTimeout(() => (cooldown = true), 400);
    if (formValue.value != 0 && formValue.value != /^\s+$/) {
      fetchData(url);
    } else {
      let outcome = document.getElementById("searchResult");
      outcome.innerHTML = "";
    }
  }
}
function fetchData(url) {
  fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let result = data.items;
      if (typeof result == 'undefined') {
        throw new URIError ('Лимит запросов исчерпан')
      }
      if (result.length == 0) {
        throw new ReferenceError ('Репозитория с таким именем не существует')
      }
      let outcome = document.getElementById("searchResult");
      outcome.innerHTML = "";
      let savedOutcome = document.getElementById("savedResult");
      outcome.insertAdjacentHTML(
        "beforeend",
        `<button>${result[0].name}</button>`
      );
      outcome.insertAdjacentHTML(
        "beforeend",
        `<button>${result[1].name}</button>`
      );
      outcome.insertAdjacentHTML(
        "beforeend",
        `<button>${result[2].name}</button>`
      );
      outcome.insertAdjacentHTML(
        "beforeend",
        `<button>${result[3].name}</button>`
      );
      outcome.insertAdjacentHTML(
        "beforeend",
        `<button>${result[4].name}</button>`
      );
      outcome.onclick = function (event) {
        let target = event.target;
        if (target.tagName == "BUTTON") {
          let selectedResult = result.filter(
            (data) => data.name == target.innerHTML
          );
          selectedResult = selectedResult[0];
          savedOutcome.insertAdjacentHTML(
            "beforeend",
            `<section><div class='saved_block'>
              Name: ${selectedResult.name}<br>Owner: ${selectedResult.owner.login}<br>
              Stars: ${selectedResult.stargazers_count}</div><button class='cross'></button></section>`
          );
          outcome.innerHTML = "";
          formValue.value = "";
        }
      };
      savedOutcome.onclick = function (event) {
        let target = event.target;
        if (target.tagName == "BUTTON") {
          target.parentNode.remove();
        }
      };
    })
    .catch((err) => {
      formValue.value = "";
      let showError = document.getElementById("searchResult");
      showError.innerHTML = "";
      if (err.name == 'ReferenceError' || err.name == 'URIError') {
      showError.insertAdjacentHTML(
        "beforeend",
        `<p>${err.message}</p>`
      )
      }
      else {
        throw err;
      }
    
    });
}
