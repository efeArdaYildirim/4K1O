import { functions } from "firebase";
import { auth, firestore, initializeApp } from "firebase-admin";
import { https, logger } from "firebase-functions";
import { defaultDatabase } from "firebase-functions/lib/providers/firestore";
import { Anonim } from "./Classes/Anonim";
import { DAL } from "./Classes/DAL";
import { LandAgent } from "./Classes/Satan";
import { UserClass } from "./Classes/User";
import { Validator } from "./Classes/Validator";
import { ListRoomsQueryParams } from "./tipitipler/Extralar";
import { Room } from "./tipitipler/Room";

initializeApp();

const db = new DAL(firestore());
const anon = new Anonim(db);
const user = new UserClass(db);
const satan = new LandAgent(db);

const updateMe = async function (data: any, context: any) {
  try {
    logger.info("updateMe", { arguments });
    if (!context.auth)
      throw new Error("login olmada kullanici update etmeye calisma islemi");
    user.setUid = context.auth.uid;
    return { status: true, data: await user.updateMe(data) };
  } catch (err) {
    logger.error("updateMe", { err, arguments });
    return { statu: false };
  }
};

const logup = async function (data: any, context: any) {
  try {
    logger.info("addLandAgent", { arguments });
    if (context.auth) throw new Error("loginken hesap olusturamasin");
    await anon.addSatan(data);
    return { status: true };
  } catch (err) {
    logger.error("addLandAgent", { err, arguments });
    return { status: false };
  }
};

const addRoom = async function (data: Room, context: https.CallableContext) {
  try {
    logger.info("addRoom", { arguments });
    satan.setUid = context.auth!.uid;
    if (!satan.amILandAgent())
      throw new Error("satici olmadan oda ekelyemesin");
    const isAdded = await satan.addRoom(data);
    return { status: isAdded };
  } catch (err) {
    logger.error("addRoom", { err, arguments });
    return { status: false };
  }
};

const delRoom = async function (data: string, context: https.CallableContext) {
  try {
    logger.info("delRoom", { arguments });
    satan.setUid = context.auth!.uid;
    let isDeleted: boolean;
    if (!satan.amILandAgent()) throw new Error("basksinin odasini silemesin");
    else isDeleted = (await satan.delMyRoom(data)) as boolean;
    return { status: isDeleted };
  } catch (err) {
    logger.error("delRoom", { err, arguments });
    return { status: false };
  }
};

const updateRoom = async function (
  data: { room: Room; id: string },
  context: https.CallableContext
) {
  try {
    logger.info("updateRoom", { arguments });
    satan.setUid = context.auth!.uid;
    if (!satan.amILandAgent())
      throw new Error("basksinin odasini gunceleyemesi");
    const updated = await satan.updateMyRoom(data.id, data.room);
    return { status: true, updated };
  } catch (err) {
    logger.error("updateRoom", { err, arguments });
    return { status: false };
  }
};

exports = {
  login: https.onCall((data, context) => {
    return { status: false };
  }),
  logup: https.onCall(logup),
  roomList: https.onCall((data, context) => {
    return { status: false };
  }),
  roomSearch: https.onCall((data, context) => {
    return { status: false };
  }),
  roomLook: https.onCall((data, context) => {
    return { status: false };
  }),
  aEaddRoom: https.onCall(addRoom),
  aEgetMyRoom: https.onCall((data, context) => {
    return { status: false };
  }),
  aESdelRoom: https.onCall(delRoom),
  aEsupdateRoom: https.onCall(updateRoom),
  aUdeleteProfile: https.onCall((data, context) => {
    return { status: false };
  }),
  aUupdateProfile: https.onCall(updateMe),
  aUaddCard: https.onCall((data, context) => {
    return { status: false };
  }),
  aUrank: https.onCall((data, context) => {
    return { status: false };
  }),
  aUdelCard: https.onCall((data, context) => {
    return { status: false };
  }),
};

/*
exports.roomList = https.onCall(async function (data: ListRoomsQueryParams) {
  try {
    logger.info("searchRoom", { arguments });
    data.queryArr = new Validator(data.queryArr)
      .itIsshouldToBeThere(["collOfTable", "query", "mustBeData"])
      .removeAnotherData(["collOfTable", "query", "mustBeData"])
      .maxLength("collOfTable", 64)
      .minLength("collOfTable", 2)
      .maxLength("query", 2)
      .minLength("query", 1)
      .minLength("mustBeData", 2)
      .maxLength("mustBeData", 64).getVal;

    new Validator(data).itIsshouldToBeThere(["sort", "queryArr"]);
    return await anon.searchRoom(
      data.sort,
      data.queryArr,
      data.city,
      data.index,
      data.limit
    );
  } catch (err) {
    logger.error("searchRoom", { err, arguments });
    return err;
  }
});
*/

exports.delMe = https.onCall(async function (data, context) {
  try {
    logger.info("delMe", { arguments });
    if (context.auth) throw new Error("login olmadan kullanici silme");
    user.setUid = context.auth!.uid;
    await user.delMe();
    await auth().updateUser(context.auth!.uid, { disabled: true });
    return { status: true };
  } catch (err) {
    logger.error("delMe", { err, arguments });
    return { status: false };
  }
});
