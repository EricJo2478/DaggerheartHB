import type FeatureVariable from "./FeatureVariable";
import type { FeatureType } from "./Types";

export default class Feature {
  private readonly featureType: FeatureType;
  private readonly name: string;
  private readonly description: string;
  private readonly id: string;

  static getType(i: number) {
    const types = ["Passive", "Action", "Reaction"];
    return types[i] as FeatureType;
  }

  static create(featType: FeatureType, name: string, desc: string, id: string) {
    if (featType === "Action") {
      return new ActionFeature(name, desc, id);
    }
    if (featType === "Passive") {
      return new PassiveFeature(name, desc, id);
    }
    if (featType === "Reaction") {
      return new ReactionFeature(name, desc, id);
    }
  }

  constructor(featType: FeatureType, name: string, desc: string, id: string) {
    this.featureType = featType;
    this.name = name;
    this.description = desc;
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

  getDisplayName(variables?: FeatureVariable[]): string {
    if (variables) {
      for (const variable of variables) {
        if (variable.getKey() === this.getId()) {
          return (
            this.name.replace("(X)", "(" + variable.get() + ")") +
            " - " +
            this.featureType
          );
        }
      }
    }
    return this.name + " - " + this.featureType;
  }

  getDescription(variables: FeatureVariable[]): string {
    let desc = this.description;
    for (const variable of variables) {
      if (variable.exists(this)) {
        desc = variable.apply(desc);
      }
    }
    return desc;
  }

  getMarkdown(variables: FeatureVariable[]): string {
    let content = ' - name: "' + this.getDisplayName(variables) + '"\n';
    content = content + '   desc: "' + this.getDescription(variables) + '"';
    return content;
  }
}

export class PassiveFeature extends Feature {
  constructor(name: string, desc: string, id: string) {
    super("Passive", name, desc, id);
  }
}

export class ActionFeature extends Feature {
  constructor(name: string, desc: string, id: string) {
    super("Action", name, desc, id);
  }
}

export class ReactionFeature extends Feature {
  constructor(name: string, desc: string, id: string) {
    super("Reaction", name, desc, id);
  }
}
