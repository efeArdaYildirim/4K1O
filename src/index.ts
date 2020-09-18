import { firestore, initializeApp, credential } from "firebase-admin";
import { https } from "firebase-functions";
import { ServerClass } from "./Classes/ServerClass";

const serviceAccount = require("../key.json");

initializeApp({
  credential: credential.cert(serviceAccount),
});

const server = new ServerClass(firestore());

export default {
  login: https.onCall(server.login),
  logup: https.onCall(server.logup),
  roomList: https.onCall(server.roomList),
  roomSearch: https.onCall(server.roomSearch),
  roomLook: https.onCall(server.roomLook),
  aEaddRoom: https.onCall(server.addRoom),
  aEgetMyRoom: https.onCall(server.getMyRooms),
  aESdelRoom: https.onCall(server.delRoom),
  aEsupdateRoom: https.onCall(server.updateRoom),
  aUdeleteProfile: https.onCall(server.deleteMe),
  aUupdateProfile: https.onCall(server.updateMe),
  aUaddCard: https.onCall(server.cardJobs),
  aUrank: https.onCall(server.rank),
  aUdelCard: https.onCall(server.cardJobs),
};
