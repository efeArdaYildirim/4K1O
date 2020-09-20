export class Validator {
  private data: any;
  constructor(data: any) {
    this.data = data;
  }

  public get getVal() {
    return this.data;
  }

  get propName() {
    return Object.getOwnPropertyNames(this.data)
  }

  MaxLength(obj: string, len: number) {
    if ((this.data[obj] as string | string[]).length > len)
      throw new Error("veri cok buyuk");
    return this;
  }
  minLength(obj: string, len: number) {
    if ((this.data[obj] as string | string[]).length < len)
      throw new Error("veri cok kucuk");
    return this;
  }
  maxWordCoud(obj: string, len: number) {
    let nowData: string | string[] = obj;
    nowData = nowData.trim();
    while (nowData.includes("  ")) nowData = nowData.replace(/  /g, " ");
    nowData = nowData.split(" ");
    if (nowData.length > len) throw new Error("cok fazla kelime");
    return this;
  }
  minWordCount(obj: string, len: number) {
    let nowData: string | string[] = obj;
    nowData = nowData.trim();
    while (nowData.includes("  ")) nowData = nowData.replace(/  /g, " ");
    nowData = nowData.split(" ");
    if (nowData.length < len) throw new Error("cok fazla kelime");
    return this;
  }
  isItUrl(obj: string) {
    const regex: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    if (!regex.test(this.data[obj])) throw new Error("bu url degil");
    return this;
  }
  isNumber(obj: string) {
    if (isNaN(this.data[obj])) throw new Error("veri rakkam degil");
    if (typeof this.data[obj] + 0 === "number")
      throw new Error("veri rakkam degil");
    if (this.data[obj] - this.data[obj] !== 0)
      throw new Error("veri rakkam degil");
    return this;
  }
  isBoolean(obj: string) {
    const nowData = this.data[obj];
    if (typeof nowData !== "boolean") throw new Error("veri bool degil");
    return this;
  }
  itIsshouldNotToBeThere(objs: string[]) {
    const more: string[] = [];
    objs.forEach((obj) => {
      if (this.propName.includes(obj)) more.push(obj);
    });
    if (more.length > 1)
      throw new Error(
        JSON.stringify({
          msg: "bunlar fazla",
          more,
          objs,
          propName: this.propName,
        })
      );
    return this;
  }
  itIsshouldToBeThere(objs: string[]) {
    const more: string[] = [];
    objs.forEach((obj) => {
      if (!this.propName.includes(obj)) more.push(obj);
    });
    if (more.length > 1)
      throw new Error(
        JSON.stringify({
          msg: "bunlar eksik",
          more,
          objs,
          propName: this.propName,
        })
      );
    return this;
  }
  removeAnotherData(objs: string[]) {
    const result: any = {};
    objs.forEach((obj: string) => {
      result[obj] = this.data[obj];
    });
    this.data = result;
  }

  isEmail(obj: string) {
    const regex: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(this.data[obj])) throw new Error("bu email degil");
    return this;
  }

  minNumberValue(obj: string, val: number) {
    if (this.data[obj] < val) throw new Error("veri cok kucuk");
  }

  maxNumberValue(obj: string, val: number) {
    if (this.data[obj] > val) throw new Error("veri cok buyuk");
  }

  CheckIfItHasMoreThanthat(datas: string[]) {
    datas.forEach((data: string) => {
      delete this.data[data]
    })
    if (this.propName.length > 0) throw new Error('fazla veri var')
  }
}
