import { auth, firestore, initializeApp } from "firebase-admin";
import { https, logger } from "firebase-functions";
import { Anonim } from "./Classes/Anonim";
import { DAL } from "./Classes/DAL";
import { UserClass } from "./Classes/User";
import { Validator } from "./Classes/Validator";
import { ListRoomsQueryParams } from "./tipitipler/Extralar";

initializeApp();

const db = new DAL(firestore());
const anon = new Anonim(db);
const user = new UserClass(db);

exports.searchRoom = https.onCall(async function (data: ListRoomsQueryParams) {
  try {
    logger.info("searchRoom", { arguments });
    new Validator(data.queryArr)
      .itIsshouldToBeThere(["collOfTable", "query", "mustBeData"])
      .removeAnotherData(["collOfTable", "query", "mustBeData"])
      .maxLength("collOfTable", 64)
      .minLength("collOfTable", 2)
      .maxLength("query", 2)
      .minLength("query", 1)
      .minLength("mustBeData", 2)
      .maxLength("mustBeData", 64);

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

exports.addLandAgent = https.onCall(async function (data: any, context) {
  try {
    logger.info("addLandAgent", { arguments });
    if (context.auth) throw new Error("loginken hesap olusturamasin");
    await anon.addSatan(data);
    return { status: true };
  } catch (err) {
    logger.error("addLandAgent", { err, arguments });
    return { status: false };
  }
});

exports.updateMe = https.onCall(async function (data: any, context) {
  try {
    logger.info("updateMe", { arguments });
    if (!context.auth)
      throw new Error("login olmada kullanici update etmeye calisma islemi");
    new Validator(data)
      .itIsshouldToBeThere([
        "isLandAgent",
        "name",
        "email",
        "password",
        "yearOfBirdth",
      ])
      .maxLength("name", 64)
      .minLength("name", 2)
      .maxWordCoud("name", 4)
      .isEmail("email")
      .minLength("password", 8)
      .maxLength("password", 64)
      .isBoolean("isLandAgent")
      .isNumber("yearOfBirdth");
    user.setUid = context.auth.uid;
    return { status: true, data: await user.updateMe(data) };
  } catch (err) {
    logger.error("updateMe", { err, arguments });
    return { statu: false };
  }
});

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
