import type FeatureVariable from "./FeatureVariable";
import type { FeatureType, FeatureVariablePair } from "./Types";

export default class Feature {
  private readonly featureType: FeatureType;
  private readonly name: string;
  private readonly description: string;
  private readonly variables: FeatureVariable[];
  private readonly id: string;

  static getType(i: number) {
    const types = ["Passive", "Action", "Reaction"];
    return types[i] as FeatureType;
  }

  static create(
    featType: FeatureType,
    name: string,
    desc: string,
    vars: FeatureVariable[],
    id: string
  ) {
    if (featType === "Action") {
      return new ActionFeature(name, desc, vars, id);
    }
    if (featType === "Passive") {
      return new PassiveFeature(name, desc, vars, id);
    }
    if (featType === "Reaction") {
      return new ReactionFeature(name, desc, vars, id);
    }
  }

  constructor(
    featType: FeatureType,
    name: string,
    desc: string,
    vars: FeatureVariable[],
    id: string
  ) {
    this.featureType = featType;
    this.name = name;
    this.description = desc;
    this.variables = vars;
    this.id = id;
  }

  isPassive(): boolean {
    return this instanceof PassiveFeature;
  }

  isAction(): boolean {
    return this instanceof ActionFeature;
  }

  isReaction(): boolean {
    return this instanceof ReactionFeature;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  getDisplayName(variables?: FeatureVariablePair[]): string {
    let name = this.name;
    if (variables) {
      for (const variable of variables) {
        if (variable[this.name]) {
          name = name.replace("X", variable[this.name]);
        }
      }
    }
    return this.name + " - " + this.featureType;
  }

  getDescription(variables: FeatureVariablePair[]): string {
    let desc = this.description;
    for (const featVar of this.variables) {
      if (featVar.exists(variables)) {
        desc = featVar.get(desc, variables);
      }
    }
    return desc;
  }

  getMarkdown(variables: FeatureVariablePair[]): string {
    let content = ' - name: "' + this.getDisplayName(variables) + '"\n';
    content = content + '   desc: "' + this.getDescription(variables) + '"';
    return content;
  }
}

export class PassiveFeature extends Feature {
  constructor(name: string, desc: string, vars: FeatureVariable[], id: string) {
    super("Passive", name, desc, vars, id);
  }
}

export class ActionFeature extends Feature {
  constructor(name: string, desc: string, vars: FeatureVariable[], id: string) {
    super("Action", name, desc, vars, id);
  }
}

export class ReactionFeature extends Feature {
  constructor(name: string, desc: string, vars: FeatureVariable[], id: string) {
    super("Reaction", name, desc, vars, id);
  }
}
