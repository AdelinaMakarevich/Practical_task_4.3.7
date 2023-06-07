let form = document.getElementById("formData");
let cooldown = true;
function runScript(e) {
  if (e.keyCode == 13) {
    fetchData();
    return false;
  }
}
function fetchData() {
  let url = `https://api.github.com/search/repositories?q=${form.value}&per_page=5`;
  if (form.value != 0 && form.value != /^\s+$/ && cooldown == true) {
    cooldown = false;
    setTimeout(() => (cooldown = true), 500);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "text/plain;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let result = data.items;
        let div = document.getElementById("res");
        div.innerHTML = "";
        let secondDiv = document.getElementById("save");
        div.insertAdjacentHTML("beforeend", `<a>${result[0].name}</a>`);
        div.insertAdjacentHTML("beforeend", `<a>${result[1].name}</a>`);
        div.insertAdjacentHTML("beforeend", `<a>${result[2].name}</a>`);
        div.insertAdjacentHTML("beforeend", `<a>${result[3].name}</a>`);
        div.insertAdjacentHTML("beforeend", `<a>${result[4].name}</a>`);
        div.onclick = function (event) {
          let target = event.target;
          if (target.tagName == "A") {
            let res = result.filter((data) => data.name == target.innerHTML);
            res = res[0];
            secondDiv.insertAdjacentHTML(
              "beforeend",
              `<section><div class='saved_block'>
              Name: ${res.name}<br>Owner: ${res.owner.login}<br>
              Stars: ${res.stargazers_count}</div><button class='cross'></button></section>`
            );
            div.innerHTML = "";
            form.value = "";
          }
        };
        secondDiv.onclick = function (event) {
          let target = event.target;
          if (target.tagName == "BUTTON") {
            console.log(event.parent);
            target.parentNode.remove();
          }
        };
      })
      .catch((err) => alert(err.name));
  } else {
    let div = document.getElementById("res");
    div.innerHTML = "";
  }
}
