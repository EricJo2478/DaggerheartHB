import type { DocumentData } from "firebase/firestore";
import Handler from "./Handler";
import Feature from "../advlib/Feature";
import FeatureVariable from "../advlib/FeatureVariable";
import type { KeyList } from "../advlib/Types";

export default class FeatureHandler extends Handler {
  private nameIdMap: KeyList = {};

  constructor() {
    super("features");
  }

  dataAssemble(doc: DocumentData) {
    const data = doc.data();
    const variables: FeatureVariable[] = [];
    for (const key of data.variables) {
      variables.push(new FeatureVariable(key));
    }
    this.nameIdMap[data.name] = doc.id;
    return Feature.create(
      Feature.getType(data.type),
      data.name,
      data.description,
      variables,
      doc.id
    );
  }

  nameToId(name: string) {
    return this.nameIdMap[name];
  }

  getList() {
    return Object.keys(this.data);
  }

  getFeatures() {
    return this.data;
  }

  getFeatureById(id: string) {
    return this.data[id];
  }

  getFeatureByName(name: string) {
    return this.getFeatureById(this.nameToId(name));
  }

  render() {
    return;
  }
}
