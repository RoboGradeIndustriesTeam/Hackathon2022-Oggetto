import event from "../models/eventModel.js";

export default {
  /*
        Method: GET
        URL: /events/

        Middlewares:
            console
            auth

        Response body:
        {
            "error": <0-1>,
            <if error === 0>
            "events": [
                <...events>
            ]
            <endif>
        }

        Errors:
        0 - OK
        1 - Not authorized
     */
  async getAll(req, res) {
    let events = await event.find();
    let fix_events = [];

    for (let ev of events) {
      if (ev.isSecret) {
        if (ev.showOnlyFor.map((i) => i._id).indexOf(req.user._id) !== -1) {
          fix_events.push(ev);
        }
      } else {
        fix_events.push(ev);
      }
    }

    return res.status(200).json({
      error: 0,
      events: fix_events,
    });
  },

  /*
        Method: GET
        URL: /events/<id>

        Middlewares:
            console
            auth

        Response body:
        {
            "error": <0-3>,
            <if error === 0>
            "event": <event>
            <endif>
        }

        Errors:
        0 - OK
        1 - Not authorized
        2 - Not found
        3 - Forbidden
     */
  async get(req, res) {
    try {
      let { id } = req.params;

      let candidate = await event.findById(id);

      if (!candidate) return res.status(404).json({ error: 2 });

      if (candidate.isSecret) {
        if (ev.showOnlyFor.map((i) => i._id).indexOf(req.user._id) === -1) {
          return res.status(403).json({ error: 3 });
        }
      }

      return res.status(200).json({
        error: 0,
        event: candidate,
      });
    } catch (e) {
      return res.status(404).json({ error: 2 });
    }
  },
};
