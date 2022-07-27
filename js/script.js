/**
Curate Your Own Art Game
Pippin Barr

An online version of my essay from the book via Sporobole.
*/

"use strict";

let lang = `en`;
let data = undefined;

$.getJSON(`assets/data/data.json`)
  .done((loadedData) => {
    data = loadedData;
    $(`#en`)
      .on(`click`, () => {
        lang = `en`;
        $(`#en`)
          .addClass(`selected-lang`);
        $(`#fr`)
          .removeClass(`selected-lang`);
        loadPage(data);
      });
    $(`#fr`)
      .on(`click`, () => {
        lang = `fr`;
        $(`#fr`)
          .addClass(`selected-lang`);
        $(`#en`)
          .removeClass(`selected-lang`);
        loadPage(data);
      });
    loadPage(data);
  })
  .fail((error) => {
    console.error("Aw nuts.")
  })


function loadPage(data) {
  $(`#title`)
    .text(data.title[lang]);

  $(`#author`)
    .text(`${lang === `en` ? `By` : `Par`} ${data.author}`);

  $(`#passages`)
    .html(``);

  let passages = data.passages;
  for (let i = 0; i < passages.length; i++) {
    // if (i === 14) continue;
    let p = passages[i];
    let $p = $(`<div>`)
      .addClass(`passage`);

    if (p.image) {
      $p.append(`<img src="assets/images/${p.image}">`);
      $(`#passages`)
        .append($p);
      continue;
    }

    $p.append(`<p class="number">${p.number}</p>`);
    $p.append(`<p class="text">${p.text[lang]}</p>`);

    if (p.idea) {
      if (lang === `en`) {
        $p.append(`<p class="idea"><span class="action">Add "${p.idea[lang]}" to your inventory of ideas.</span></p>`);
      } else if (lang === `fr`) {
        $p.append(`<p class="idea"><span class="action">Ajoutez "${p.idea[lang]}" à votre inventaire d’idées.</span></p>`);
      }
    }

    if (p.options) {
      let $options = $(`<ul>`)
        .addClass("options")
      for (let j = 0; j < p.options.length; j++) {
        let o = p.options[j];
        $options.append(`<li>${o[lang]}</li>`);
      }
      $p.append($options);
    }

    if (p.end) {
      $p.append(`<p><span class="action">${lang === `end` ? `END` : `FIN`}</span></p>`)
    }

    $(`#passages`)
      .append($p);

  }
}