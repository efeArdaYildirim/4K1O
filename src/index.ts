import { firestore, initializeApp, credential } from "firebase-admin";
import { https } from "firebase-functions";
import { ServerClass } from "./Classes/ServerClass";

const serviceAccount = require("../key.json");

initializeApp({
  //credential: credential.cert(serviceAccount),
});

const server = new ServerClass(firestore());

export default {
  login: https.onCall((data, context) => server.Login(data, context)),
  logup: https.onCall((data, context) => server.Logup({ data, context })),
  roomList: https.onCall((data, context) => server.RoomList(data, context)),
  roomSearch: https.onCall((data, context) => server.RoomSearch(data, context)),
  roomLook: https.onCall((data, context) => server.RoomLook(data, context)),
  aEaddRoom: https.onCall((data, context) => server.AddRoom(data, context)),
  aEgetMyRoom: https.onCall((data, context) =>
    server.GetMyRooms(data, context)
  ),
  aESdelRoom: https.onCall((data, context) => server.DelRoom(data, context)),
  aEsupdateRoom: https.onCall((data, context) =>
    server.UpdateRoom(data, context)
  ),
  aUdeleteProfile: https.onCall((data, context) =>
    server.DeleteMe(data, context)
  ),
  aUupdateProfile: https.onCall((data, context) =>
    server.UpdateMe(data, context)
  ),
  aUaddCard: https.onCall((data, context) => server.CardJobs(data, context)),
  aUrank: https.onCall((data, context) => server.Rank(data, context)),
  aUdelCard: https.onCall((data, context) => server.CardJobs(data, context)),
};
