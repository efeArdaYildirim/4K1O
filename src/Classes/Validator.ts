export class Validator {
  data: any;
  constructor(data: any) {
    this.data = data;
  }

  maxLength(obj: string, len: number) {
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
    if (typeof this.data[obj] !== "boolean") throw new Error("veri bool degil");
    return this;
  }
  itIsshouldNotToBeThere() {}
  itIsshouldToBeThere() {}
  removeAnotherData() {}
}
