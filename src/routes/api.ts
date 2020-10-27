import express, {
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import crypto from "crypto";
import { Constants } from "../constants";

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.route("/").all((_req: any, res: any) => {
  res.statusCode = 200;
  res.end(
    "Hello it's zoom simple rest api integeration, in order to list all endpoint make a GET request on '/api/list_endpoints' "
  );
});

apiRouter
  .route("/list_endpoints")
  .get((_req: RequestExpress, _res: ResponseExpress) => {
    _res.end("/api/list_users\n/api/create_meeting | parameters - <user_id>");
  });

apiRouter
  .route("/list_users")
  .get((_req: RequestExpress, _res: ResponseExpress) => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Constants.JWT_ZOOM_TOKEN}`,
        "content-type": "application/json",
      },
    };
    (async () => {
      try {
        let response = await fetch(
          "https://api.zoom.us/v2/users?page_size=30&status=active",
          options
        );
        response = await response.json();
        _res.end(JSON.stringify(response));
      } catch (error) {
        console.error(error);
      }
    })();
  });

apiRouter
  .route("/create_meeting")
  .post((_req: RequestExpress, _res: ResponseExpress) => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Constants.JWT_ZOOM_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        topic: "Test Meeting",
        type: 1,
        start_time: new Date().toISOString(),
        agenda: "Test discription",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          approval_type: 1,
          audio: "both",
        },
      }),
    };

    (async () => {
      try {
        console.log(_req.body);
        let host_id = _req.body.user_id;
        let response = await fetch(
          `https://api.zoom.us/v2/users/${host_id}/meetings`,
          options
        );
        response = await response.json();
        console.log(response);
        _res.end(JSON.stringify(response));
      } catch (err) {
        console.error(err);
      }
    })();
  });

apiRouter
  .route("/gensignature")
  .post((_req: RequestExpress, _res: ResponseExpress) => {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(
      Constants.API_KEY + _req.body.meetingNumber + timestamp + _req.body.role
    ).toString("base64");
    const hash = crypto
      .createHmac("sha256", Constants.API_SECRET!)
      .update(msg)
      .digest("base64");
    const signature = Buffer.from(
      `${Constants.API_KEY}.${_req.body.meetingNumber}.${timestamp}.${_req.body.role}.${hash}`
    ).toString("base64");
    _res.status(201).send({ signature });
  });

module.exports = apiRouter;
