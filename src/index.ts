import { firestore, initializeApp, credential } from "firebase-admin";
import { https } from "firebase-functions";
import { ServerClass } from "./Classes/ServerClass";

const serviceAccount = require("../key.json");

initializeApp({
  credential: credential.cert(serviceAccount),
});

const server = new ServerClass(firestore());

export default {
  login: https.onCall((data, context) => {
    return { status: false };
  }),
  logup: https.onCall(server.logup),
  roomList: https.onCall((data, context) => {
    return { status: false };
  }),
  roomSearch: https.onCall((data, context) => {
    return { status: false };
  }),
  roomLook: https.onCall((data, context) => {
    return { status: false };
  }),
  aEaddRoom: https.onCall(server.addRoom),
  aEgetMyRoom: https.onCall((data, context) => {
    return { status: false };
  }),
  aESdelRoom: https.onCall(server.delRoom),
  aEsupdateRoom: https.onCall(server.updateRoom),
  aUdeleteProfile: https.onCall(server.deleteMe),
  aUupdateProfile: https.onCall(server.updateMe),
  aUaddCard: https.onCall(server.cardJobs),
  aUrank: https.onCall(server.rank),
  aUdelCard: https.onCall(server.cardJobs),
};
