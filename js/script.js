/**
Curate Your Own Art Game
Pippin Barr

An online version of my essay from the book via Sporobole.
*/

"use strict";
let lang = `en`;
let data;

$.getJSON(`assets/data/data.json`)
  .done((loadedData) => {
    data = loadedData;
    loadPage(data);
  })
  .fail((error) => {
    console.error("Aw nuts.")
  });


function loadPage(data) {
  $(`#title`)
    .text(data.title[lang]);
  document.title = data.title[lang];

  $(`#ideas-title, #ideas-menu`)
    .text(lang === `en` ? `Inventory of ideas` : `Inventaire d'idées`);
  $(`#assets-title, #assets-menu`)
    .html(lang === `en` ? `Inventory of assets` : `Inventaire d'<em>assets</em>`);

  $(`#ideas-menu`)
    .on(`click`, openIdeas);
  $(`#assets-menu`)
    .on(`click`, openAssets);

  $(`#ideas-close`)
    .on(`click`, closeIdeas);

  $(`#assets-close`)
    .on(`click`, closeAssets);

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

    $p.append(`<p id="${p.number}" class="number">${p.number}</p>`);
    $p.append(`<p class="text">${p.text[lang]}</p>`);

    if (p.idea) {
      let idea = {
        en: p.idea[`en`],
        fr: p.idea[`fr`]
      }
      let $action;
      if (lang === `en`) {
        $action = $(`<p class="idea"><span class="action">Add "${idea.en}" to your inventory of ideas.</span></p>`);
      } else if (lang === `fr`) {
        $action = $(`<p class="idea"><span class="action">Ajoutez "${idea.fr}" à votre inventaire d’idées.</span></p>`);
      }
      $action.one(`click`, function () {
        $action.addClass(`done`);
        let $idea = $(`<li>${lang === 'en' ? idea.en : idea.fr}</li>`);
        $(`#idea-list`)
          .append($idea);
        openIdeas();
      });
      $p.append($action);
    }

    if (p.options) {
      let $options = $(`<ul>`)
        .addClass("options")
      for (let j = 0; j < p.options.length; j++) {
        let o = p.options[j];

        // Respond to adding an asset
        if (o[`en`].match(`to your inventory of assets`)) {
          if (lang === `en`) {
            o[lang] = o[lang].replace(/add "(.*)" to your inventory of assets/, `<span class="asset" asset-name="$1">Add "$1" to your inventory of assets</span>`);
          } else {
            o[lang] = o[lang].replace(/ajoutez «(.*)» à votre inventaire d'assets/, `<span class="asset" asset-name="$1">ajoutez «$1» à votre inventaire d'assets</span>`);
          }
        }

        // Add links
        o[lang] = o[lang].replace(/(à|entre|to|,|of)\s(\d+)/g, '$1 <span class="jump" goto="$2">$2</span>');

        let $li = $(`<li>${o[lang]}</li>`);

        if (o[`en`].includes(`If "Humanoid Creatures Pack"`)) {
          $li.attr(`id`, `install-humanoid-creatures-pack`);
          $li.addClass(`disabled`);
        } else if (o[`en`].includes(`If "Moon Base 2030"`)) {
          $li.attr(`id`, `install-moon-base-2030`);
          $li.addClass(`disabled`);
        }

        // Add the actual thing
        $options.append($li);
      }
      $p.append($options);
    }

    if (p.end) {
      $p.append(`<p><span class="action">${lang === `end` ? `END` : `FIN`}</span></p>`)
    }

    $(`#passages`)
      .append($p);

    $(`.jump`)
      .on(`click`, function () {
        let to = $(this)
          .attr(`goto`);
        if (to === `2`) {
          $(`#install-moon-base-2030`)
            .addClass(`disabled`);
          $(`#asset-list li`)
            .each(function () {
              if ($(this)
                .text()
                .includes(`Moon`)) {
                $(this)
                  .remove();
              }
            });
        } else if (to === `16`) {
          $(`#install-humanoid-creatures-pack`)
            .addClass(`disabled`);
          $(`#asset-list li`)
            .each(function () {
              if ($(this)
                .text()
                .includes(`Humanoid`)) {
                $(this)
                  .remove();
              }
            });

        }
        let y = $(`#${to}`)
          .position()
          .top;
        let navHeight = $(`nav`)
          .height();
        y -= navHeight;
        window.scrollTo(0, y);
      });
  }

  $(`.asset`)
    .one(`click`, function () {
      let asset = $(this)
        .attr(`asset-name`);
      let $li = $(`<li>${asset}</li>`);
      $(`#asset-list`)
        .append($li);
      $(this)
        .addClass(`done`);
      if (asset.includes(`Humanoid`)) {
        $(`#install-humanoid-creatures-pack`)
          .removeClass(`disabled`);
      } else if (asset.includes(`Moon`)) {
        $(`#install-moon-base-2030`)
          .removeClass(`disabled`);
      }

      openAssets();
    });
}

function openIdeas() {
  $(`#ideas`)
    .show();
}

function closeIdeas() {
  $(`#ideas`)
    .hide();
}

function openAssets() {
  $(`#assets`)
    .show();
}

function closeAssets() {
  $(`#assets`)
    .hide();
}