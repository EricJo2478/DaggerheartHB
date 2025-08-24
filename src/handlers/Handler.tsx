import { collection, getDocs, type DocumentData } from "firebase/firestore";
import { database } from "../App";
import type { KeyList } from "../advlib/Types";

export default class Handler {
  protected setFunc?: Function;
  protected data: KeyList = {};
  private readonly collectionName: string;

  constructor(collection: string) {
    this.collectionName = collection;
  }

  initialized() {
    return !(this.setFunc === undefined);
  }

  dataAssemble(doc: DocumentData): any {
    return doc;
  }

  async fetch(dataSet: KeyList) {
    const data = await getDocs(collection(database, this.collectionName));
    for (const doc of data.docs) {
      if (!Object.keys(dataSet).includes(doc.id)) {
        dataSet[doc.id] = this.dataAssemble(doc);
      }
    }
    return dataSet;
  }

  init(setFunc: Function) {
    this.setFunc = setFunc;
    if (this.collectionName !== "") {
      this.fetch({} as KeyList).then((r: KeyList) => {
        this.set(r);
      });
    }
  }

  set(data: KeyList) {
    if (this.setFunc) {
      this.data = { ...data };
      this.setFunc({ ...data });
    }
  }

  reload() {
    this.set(this.data);
  }

  get() {
    return { ...this.data };
  }

  render() {
    return;
  }
}
