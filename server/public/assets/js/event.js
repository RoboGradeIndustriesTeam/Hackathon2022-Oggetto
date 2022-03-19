import config from "./config.js";

export default {
  async getAll(token) {
    let url = `${config.baseUrl}/events/`;

    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = await resp.json();

      if (data.error === 1) {
        return { events: undefined, message: "Токен не верный", error: true };
      } else if (data.error === 0) {
        return { events: data.events, message: undefined, error: false };
      }
    } catch (e) {}
  },
  async getByID(token, id) {
    let url = `${config.baseUrl}/events/${id}`;

    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = await resp.json();

      if (data.error === 1) {
        return { event: undefined, message: "Токен не верный", error: true };
      } else if (data.error === 2) {
        return { event: undefined, message: "Не найдено", error: true };
      } else if (data.error === 0) {
        return { event: data.event, message: undefined, error: false };
      }
    } catch (e) {}
  },
};
