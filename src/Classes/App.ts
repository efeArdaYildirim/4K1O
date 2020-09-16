import * as functions from "firebase-functions";
import { config } from "dotenv";
import { DAL } from "./DAL";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";
const { active, connection } = require("../../smtpConfig.json");
import { PayloadOfEMail } from "../tipitipler/extralar";
config();
export class App {
  db: DAL;
  transporter: any;
  constructor(dal: DAL) {
    this.db = dal;
    this.transporter;
    this.smtpConnection()
      .then((res) => res)
      .catch((err) => err);
  }

  /**
   * @private
   */
  async smtpConnection(): Promise<void> {
    if (active) {
      this.transporter = createTransport(connection);
    } else {
      this.transporter = await createTestAccount();
    }
    return;
  }

  async rankCalcByLikefromRoom(roomId: string): Promise<void> {
    try {
      const { like, dislike } = await this.db.getRoomById(roomId);
      const rank: number = like - dislike;
      this.db
        .upDateRoomById(roomId, { rank })
        .then((result) => result)
        .catch((err) => err);
      return;
    } catch (err) {
      functions.logger.error("ranking", { err, arguments });
      return;
    }
  }

  sendMailToReciver(data: PayloadOfEMail) {
    this.transporter
      .sendMail({ ...data, from: "info@4k1o.com" })
      .then((info: any) => {
        functions.logger.info("sendMailToReviver", {
          arguments,
          mailUrl: getTestMessageUrl(info),
        });
      })
      .catch((err: any) => {
        functions.logger.error("sendMailToReviver", { err, arguments });
      });

    return;
  }

  turkisIdCheck(id: any): void {
    return;
  }
}
