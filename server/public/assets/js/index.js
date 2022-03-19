import event from "./event.js";

let loader = document.querySelector(".loader");

const loadData = async () => {
  let events = await event.getAll(localStorage.token);

  if (events.error) {
    alert(`Ошибка пре загрузке событий: ${events.message}`);
  } else {
    let innerHTMLOfEvents = ``;

    innerHTMLOfEvents += events.events
      .map(
        (i) => `<div class="container eve-eve-container">
        <h3 class="eve-eve-h">${i.title}</h3>
        <p class="text-nowrap text-truncate eve-eve-p">
          ${i.desc}
        </p>
        <p class="text-nowrap text-truncate eve-eve-p">
          От: ${i.organizator.login}
        </p>
        <div class="text-nowrap d-xl-flex justify-content-xl-start">
          ${i.tags
            .map(
              (j) => `
          <div class="alert alert-success tags" role="alert" style="margin-bottom: 15px; margin-right: 15px">
          <span><strong>${j}</strong></span>
        </div>
          `
            )
            .join("\n")}
        </div>
        <a class="btn btnn btn-sel eve-eve-btn" href="${i.link}">
          Перейти в чат...
        </a>
      </div>`
      )
      .join("\n");

    innerHTMLOfEvents += `
        <div class="container eve-eve-container" style="padding-top: 24px">
        <a class="btn btn-lg btnn-2 eve-eve-btn" role="button" href="list.html">Все события</a><button
          class="btn btn-lg btnn-2 eve-eve-btn" data-bs-toggle="modal" data-bss-tooltip="" type="button"
          data-bs-target="#modal-archive" title="События которые уже прошли">
          Архив событий
        </button>
      </div>
        `;

    let eventsEl = document.querySelector("#events");
    eventsEl.innerHTML = innerHTMLOfEvents;
  }
};

await loadData();
loader.classList.remove("loader--active");

let carousel = 1;
let carouselMax = 12;
const carouselData = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

let renderCalendar = () => {
  let items = Array.prototype.slice.call(
    document.querySelector("#calendar").querySelectorAll(".row > .col")
  );

  let buttons = items.map((i) => i.querySelector("button"));

  let renderCarouselMonth = (offset, maxDays) => {
    let j = 1;
    let k = 1;

    buttons.forEach((i) => {
      i.disabled = false;
      i.style.display = "block";

      if (j < offset) {
        // i.innerText = maxDays - offset + j;
        i.disabled = true;
        i.style.display = "none";
        j++;
      } else {
        if (k - 1 >= maxDays) {
          i.disabled = true;
          i.style.display = "none";
        } else {
          i.innerText = k;
          i.style.display = "block";

          k++;
        }
      }
    });
  };

  let offset, maxDays;

  switch (carousel) {
    case 1:
      offset = 6;
      maxDays = 31;
      break;
    case 2:
      Date.prototype.daysInMonth = function () {
        return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
      };

      let now = new Date();
      now.setMonth(1);

      offset = 2;
      maxDays = now.daysInMonth();
      break;
    case 3:
      offset = 2;
      maxDays = 30;
      break;
    case 4:
      offset = 5;
      maxDays = 31;
      break;
    case 5:
      offset = 7;
      maxDays = 30;
      break;
    case 6:
      offset = 3;
      maxDays = 31;
      break;
    case 7:
      offset = 5;
      maxDays = 30;
      break;
    case 8:
      offset = 0;
      maxDays = 31;
      break;
    case 9:
      offset = 4;
      maxDays = 30;
      break;
    case 10:
      offset = 6;
      maxDays = 31;
      break;
    case 11:
      offset = 2;
      maxDays = 30;
      break;
    case 12:
      offset = 3;
      maxDays = 31;
      break;
  }

  renderCarouselMonth(offset, maxDays);
};
let renderCarousel = () => {
  let carEl = document.querySelector("#carousel");

  let text = `${carouselData[carousel - 1]}`;

  let innerHTML = `<span data-bs-toggle="tooltip" data-bss-tooltip="" data-bs-placement="left"><i
    class="fa fa-arrow-left" onclick="left()"></i></span>&nbsp; &nbsp;${text}&nbsp; &nbsp;<span
  data-bs-toggle="tooltip" data-bss-tooltip="" data-bs-placement="right"><i
    class="fa fa-arrow-right"  onclick="right()"></i></span>`;

  carEl.innerHTML = innerHTML;

  renderCalendar();
};

let left = () => {
  carousel += 1;

  if (carousel > carouselMax) {
    carousel = 1;
  }
  renderCarousel();
};

let right = () => {
  carousel -= 1;

  if (carousel < 1) {
    carousel = carouselMax;
  }
  renderCarousel();
};

window.left = right;
window.right = left;

renderCarousel();
