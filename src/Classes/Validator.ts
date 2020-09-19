export class Validator {
  private data: any;
  private propName: any;
  constructor(data: any) {
    this.data = data;
    this.propName = Object.getOwnPropertyNames(data);
  }

  public get getVal() {
    return this.data;
  }

  MaxLength(obj: string, len: number) {
    if ((this.data[obj] as string | string[]).length > len)
      throw new Error("veri cok buyuk");
    return this;
  }
  MinLength(obj: string, len: number) {
    if ((this.data[obj] as string | string[]).length < len)
      throw new Error("veri cok kucuk");
    return this;
  }
  private textToWord(data: string): string[] {
    let dataTrim = data.trim();
    while (dataTrim.includes("  ")) dataTrim = dataTrim.replace(/  /g, " ");
    return data.split(" ");
  }
  MaxWordCoud(obj: string, len: number) {
    const words = this.textToWord(this.data[obj]);
    if (words.length > len) throw new Error("cok fazla kelime");
    return this;
  }
  MinWordCount(obj: string, len: number) {
    const words = this.textToWord(this.data[obj]);
    if (words.length < len) throw new Error("cok fazla kelime");
    return this;
  }
  IsItUrl(obj: string) {
    const regex: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    if (!regex.test(this.data[obj])) throw new Error("bu url degil");
    return this;
  }
  IsNumber(obj: string) {
    if (isNaN(this.data[obj])) throw new Error("veri rakkam degil");
    if (typeof this.data[obj] + 0 === "number")
      throw new Error("veri rakkam degil");
    if (this.data[obj] - this.data[obj] !== 0)
      throw new Error("veri rakkam degil");
    return this;
  }
  IsBoolean(obj: string) {
    const nowData = this.data[obj];
    if (typeof nowData !== "boolean") throw new Error("veri bool degil");
    return this;
  }
  ItIsshouldNotToBeThere(objs: string[]) {
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
  ItIsshouldToBeThere(objs: string[]) {
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
  RemoveAnotherData(objs: string[]) {
    const result: any = {};
    objs.forEach((obj: string) => {
      result[obj] = this.data[obj];
    });
    this.data = result;
    return this;
  }

  IsEmail(obj: string) {
    const regex: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(this.data[obj])) throw new Error("bu email degil");
    return this;
  }

  MinNumberValue(obj: string, val: number) {
    if (this.data[obj] < val) throw new Error("veri cok kucuk");
  }

  MaxNumberValue(obj: string, val: number) {
    if (this.data[obj] > val) throw new Error("veri cok buyuk");
  }
}
