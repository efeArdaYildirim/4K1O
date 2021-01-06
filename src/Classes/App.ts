import * as functions from "firebase-functions";
import { config } from "dotenv";
import { DAL } from "./DAL";
import { PayloadOfEMail } from "../tipitipler/Extralar";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";
import { createClient } from "soap";

// const { active, connection } = require("../../smtpConfig.json");
config();
export class App {
  db: DAL;
  transporter: any;
  constructor(dal: DAL) {
    this.db = dal;
    this.transporter;
    // this.SmtpConnection()
    //   .then((res) => res)
    //   .catch((err) => err);
  }
  /*
    /**
     * @private

    async SmtpConnection(): Promise<void> {
      if (active) {
        this.transporter = createTransport(connection);
      } else {
        this.transporter = await createTestAccount();
      }
      return;
    }
*/
  private Rankalgorithm({ like, dislike }: any): number {
    return like - dislike;
  }

  async RankCalcByLikefromRoom(roomId: string): Promise<void> {
    try {
      const { like, dislike } = await this.db.GetRoomById(roomId);
      const rank: number = this.Rankalgorithm({ like, dislike });
      this.db
        .UpDateRoomById(roomId, { rank })
        .then((result) => result)
        .catch((err) => err);
      return;
    } catch (err) {
      functions.logger.error("ranking", { err, arguments: { roomId } });
      return;
    }
  }

  /*

  SendMailToReciver(data: PayloadOfEMail) {
    this.transporter
      .sendMail({ ...data, from: "info@4k1o.com" })
      .then((info: any) => {
        functions.logger.info("sendMailToReviver", {
          arguments: { data, info },
          mailUrl: getTestMessageUrl(info),
        });
      })
      .catch((err: any) => {
        functions.logger.error("sendMailToReviver", {
          err: err.message,
          arguments: { data },
        });
      });

    return;
  }
*/
  TurkisIdCheck({ id, name, sirname, YearOfBirdth: yearOfBirdth }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const url = "https://tckimlik.nvi.gov.tr/service/kpspublic.asmx?WSDL";
      let data = {
        TCKimlikNo: id,
        Ad: name,
        Soyad: sirname,
        DogumYili: yearOfBirdth,
      };

      createClient(url, (err, client) => {
        client.TCKimlikNoDogrula(data, (err, result) => {
          if (result.TCKimlikNoDogrulaResult) {
            resolve()
          } else {
            reject('hatali bilgi')
          }
        });
      });

    });
  }
}
