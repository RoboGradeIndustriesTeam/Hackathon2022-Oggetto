import event from "./event.js";

let events_container = document.querySelector("#events");

let events = await event.getAll(localStorage.token);

if (events.error) {
  alert(`При загрузке событий произошла ошибка: ${events.message}`);
} else {
  events_container.innerHTML = events.events.reverse().map(
    (e) => `<div class="container eve-eve-container">
                        <h3 class="eve-eve-h">${e.title}</h3>
                        <p class="text-nowrap text-truncate eve-eve-p">${
                          e.desc
                        }</p>
                        <p class="text-muted">${new Date(e.date).toLocaleString(
                          "ru",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}</p>
                        <a class="btn btnn btn-sel eve-eve-btn" href="${
                          e.link
                        }">Перейти...</a>
                    </div>`
  );

  let day_click = (e) => {
    let day = Number(e.target.innerText);

    let day_events = events.events
      .reverse()
      .filter((i) => new Date(i.date).getDate() === day);
    let cals_months = document
      .querySelector(".cal-header > h5")
      .innerText.split(" - ");

    let months = {
      январь: 1,
      февраль: 2,
      март: 3,
      апрель: 4,
      май: 5,
      июнь: 6,
      июль: 7,
      август: 8,
      сентябрь: 9,
      октябрь: 10,
      ноябрь: 11,
      декабрь: 12,
    };

    let now_month =
      months[cals_months[(cals_months.length - 1) / 2].toLowerCase()];

    let date = new Date();
    date.setDate(day);
    date.setMonth(now_month - 1);
    let day_title = date.toLocaleString("ru", {
      day: "2-digit",
      month: "long",
    });

    let modal = new bootstrap.Modal(document.getElementById("modal-1"), {});

    let day_element = document.querySelector("#modal-day");
    day_element.innerText = day_title;

    let events_el = document.querySelector("#modal-events");
    events_el.innerHTML = day_events
      .map(
        (i) => `<div class="container eve-modal-eve-container">
                            <div class="row d-xl-flex align-items-xl-center eve-modal-eve-header-row">
                                <div class="col offset-xl-0 d-xl-flex justify-content-xl-start align-items-xl-center">
                                    <h4 class="eve-modal-eve-header-h">${
                                      i.title
                                    }</h4>
                                </div>
                                <div class="col d-xl-flex justify-content-xl-end eve-modal-eve-header-btn"><a class="btn btn-sm btnn eve-modal-chat-btn" href="${
                                  i.link
                                }">Перейти</a></div>
                            </div>
                            <p class="eve-modal-eve-body-p">${i.desc}</p>
                            <p class="ml-5 text-muted">От ${
                              i.organizator.login
                            }</p>
                            <p class="ml-5 text-muted">Будет в ${new Date(
                              i.date
                            ).toLocaleString("ru", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}</p>
                        </div>`
      )
      .join("\n");

    modal.toggle();
  };
  let days_buttons = document
    .querySelector(".cal-cal")
    .querySelectorAll(".row > .col > button");

  for (let daysButton of days_buttons) {
    daysButton.addEventListener("click", day_click);

    let day = Number(daysButton.innerText);

    let day_events = events.events
      .reverse()
      .filter((i) => new Date(i.date).getDate() === day);

    if (day_events.length > 0) {
      if (!daysButton.disabled) daysButton.className = "btn cale-btn-sel";
    }
  }
}
