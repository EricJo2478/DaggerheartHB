import type { DocumentData } from "firebase/firestore";
import Handler from "./Handler";
import Feature from "../advlib/Feature";
import type { KeyList } from "../advlib/Types";

export default class FeatureHandler extends Handler {
  constructor() {
    super("features");
  }

  async fetch(dataSet: KeyList) {
    dataSet = await super.fetch(dataSet);
    const entries = Object.entries(dataSet);
    entries.sort((a, b) => a[1].getName().localeCompare(b[1].getName()));
    const sortedData = Object.fromEntries(entries);
    return sortedData;
  }

  dataAssemble(doc: DocumentData) {
    const data = doc.data();
    let display = "";
    if (data.display) {
      display = data.display;
    }
    return Feature.create(
      Feature.getType(data.type),
      data.name,
      data.description,
      doc.id,
      display
    );
  }

  getList() {
    return Object.keys(this.data);
  }

  getFeatures() {
    return Object.values(this.data);
  }

  getFeatureById(id: string) {
    return this.data[id];
  }

  render() {
    return;
  }
}
