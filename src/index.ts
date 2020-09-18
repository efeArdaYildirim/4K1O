import { firestore, initializeApp, credential } from "firebase-admin";
import { https } from "firebase-functions";
import { ServerClass } from "./Classes/ServerClass";

const serviceAccount = require("../key.json");

initializeApp({
  //credential: credential.cert(serviceAccount),
});

const server = new ServerClass(firestore());

export default {
  login: https.onCall((data, context) => server.login(data, context)),
  logup: https.onCall((data, context) => server.logup({ data, context })),
  roomList: https.onCall((data, context) => server.roomList(data, context)),
  roomSearch: https.onCall((data, context) => server.roomSearch(data, context)),
  roomLook: https.onCall((data, context) => server.roomLook(data, context)),
  aEaddRoom: https.onCall((data, context) => server.addRoom(data, context)),
  aEgetMyRoom: https.onCall((data, context) =>
    server.getMyRooms(data, context)
  ),
  aESdelRoom: https.onCall((data, context) => server.delRoom(data, context)),
  aEsupdateRoom: https.onCall((data, context) =>
    server.updateRoom(data, context)
  ),
  aUdeleteProfile: https.onCall((data, context) =>
    server.deleteMe(data, context)
  ),
  aUupdateProfile: https.onCall((data, context) =>
    server.updateMe(data, context)
  ),
  aUaddCard: https.onCall((data, context) => server.cardJobs(data, context)),
  aUrank: https.onCall((data, context) => server.rank(data, context)),
  aUdelCard: https.onCall((data, context) => server.cardJobs(data, context)),
};
