import event from "./event.js";

let loader = document.querySelector(".loader");

let filter_tag = undefined;
let tags;
let events;

const loadData = async () => {
  events = await event.getAll(localStorage.token);

  if (events.error) {
    alert(`Ошибка пре загрузке событий: ${events.message}`);
  } else {
    let tags_not_unq_not_unpck = events.events.map((i) => i.tags);
    let tags_not_unq_unpck = [];
    tags_not_unq_not_unpck.forEach((i) => tags_not_unq_unpck.push(...i));
    tags = [...new Set(tags_not_unq_unpck)];
  }
};
await loadData();
loader.classList.remove("loader--active");

const render = () => {
  // render tags
  let tagsContainer = document.querySelector("#tags");
  let tagsRendered = tags
    .map(
      (i) =>
        `<button class="btn btn-success tags" onclick="selectTag('${i}')" type="button" style="margin-right: 15px">${i}</button>`
    )
    .join("\n");
  tagsContainer.innerHTML =
    tagsRendered +
    `<button class="btn btn-success tags" onclick="selectTag(undefined)" type="button" style="margin-right: 15px">Без фильтра</button>`;

  // render events
  let toRender = events.events.reverse();

  if (filter_tag) {
    toRender = toRender.filter((i) => i.tags.indexOf(filter_tag) !== -1);
  }

  let eventsContainer = document.querySelector("#events");
  let eventsRendered = toRender
    .map(
      (i) => `
    <div class="container list-eve-container">
    <div class="row d-xl-flex align-items-xl-center eve-modal-eve-header-row">
      <div class="col offset-xl-0 d-xl-flex justify-content-xl-start align-items-xl-center">
        <h4 class="list-eve-list-header-h">${i.title}</h4>
      </div>
      <div
        class="col d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end eve-modal-eve-header-btn">
        <div class="alert alert-primary tags" role="alert">
          ${i.tags.map((j) => `<span><strong>${j}</strong></span>`).join("\n")}
        </div>
        <h6 class="d-xl-flex align-items-xl-center list-eve-list-header-h"
          style="margin-right: 15px; margin-left: 15px">
          ${moment(new Date(i.date)).locale("ru").calendar()}
        </h6>
        <a class="btn btnn eve-modal-chat-btn" href="${i.link}">
          Перейти в чат
        </a>
      </div>
    </div>
    <p class="eve-modal-eve-body-p">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
      fermentum sed felis a rhoncus. Quisque commodo varius cursus.
      Cras at urna nulla. Donec non dui lorem. Phasellus rhoncus
      fringilla augue eget egestas. Integer semper ultrices lorem,
      nec semper velit efficitur in. Suspendisse maximus massa
      rhoncus, finibus nunc ac, semper enim. Cras dignissim
      scelerisque tristique.
    </p>
  </div>
    `
    )
    .join(`\n`);
  eventsContainer.innerHTML = eventsRendered;
};

window.selectTag = (tag_name) => {
  filter_tag = tag_name;
  render();
};

render();

// Helper window

let helper_window = document.querySelector("#help_login");

let closeHelper = () => {
  localStorage.setItem("help_login", true);
  renderHelper();
};

let renderHelper = () => {
  let checked = localStorage.help_login ? localStorage.help_login : false;

  if (checked) {
    helper_window.remove();
  }
};

renderHelper();

window.closeHelper = closeHelper;
