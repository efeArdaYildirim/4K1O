import { firestore, initializeApp } from "firebase-admin";
import { https, logger } from "firebase-functions";
import { Anonim } from "./Classes/Anonim";
import { DAL } from "./Classes/DAL";
import { Validator } from "./Classes/Validator";
import { ListRoomsQueryParams } from "./tipitipler/Extralar";

initializeApp();

const db = new DAL(firestore());
const anon = new Anonim(db);

exports.searchRoom = https.onCall(async function (data: ListRoomsQueryParams) {
  try {
    logger.info("searchRoom", { arguments });
    new Validator(data.queryArr)
      .itIsshouldToBeThere(["collOfTable", "query", "mustBeData"])
      .maxLength("collOfTable", 64)
      .minLength("collOfTable", 2)
      .maxLength("query", 2)
      .minLength("query", 1)
      .minLength("mustBeData", 2)
      .maxLength("mustBeData", 64)
      .removeAnotherData(["collOfTable", "query", "mustBeData"]);
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
