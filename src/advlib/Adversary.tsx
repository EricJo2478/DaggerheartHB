import Attack from "./Attack";
import Feature, {
  ActionFeature,
  PassiveFeature,
  ReactionFeature,
} from "./Feature";
import Thresholds from "./Thresholds";
import Tier from "./Tier";
import type { Category } from "./Types";
import type Experience from "./Experience";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../App";
import FeatureVariable from "./FeatureVariable";
import { convertMdToHtml, copyToClipboard, downloadData } from "./Utils";
import { Button } from "react-bootstrap";

export class AdversaryPrototype {
  private readonly name: string;
  private readonly tier: Tier;
  private readonly category: Category;
  private readonly description: string;
  private readonly motivesAndTactics: string;
  private readonly hp: number;
  private readonly stress: number;
  private readonly difficulty: number;
  private readonly thresholds: Thresholds;
  private readonly attack: Attack;
  private readonly experiences: Experience[];
  private readonly passives: PassiveFeature[] = [];
  private readonly actions: ActionFeature[] = [];
  private readonly reactions: ReactionFeature[] = [];
  private readonly variables: FeatureVariable[];
  private readonly horde: number;
  private readonly tags: string[];
  private id?: string;
  private adversary?: Adversary;

  constructor(
    name: string,
    tier: number,
    category: Category,
    desc: string,
    motives: string,
    difficulty: number,
    thresholds: Thresholds,
    hp: number,
    stress: number,
    attack: Attack,
    experiences: Experience[],
    variables: FeatureVariable[],
    features: Feature[],
    tags: string[],
    horde: string
  ) {
    this.name = name;
    this.tier = Tier.tierFromNumber(tier);
    this.category = category;
    this.description = desc;
    this.motivesAndTactics = motives;
    this.difficulty = difficulty;
    this.thresholds = thresholds;
    this.hp = hp;
    this.stress = stress;
    this.attack = attack;
    this.experiences = experiences;
    this.variables = variables;
    this.tags = tags;
    if (horde === "" || isNaN(Number(horde))) {
      this.horde = 1;
    } else {
      this.horde = Number(horde);
    }
    for (const feature of features) {
      this.addFeature(feature);
    }
  }

  addFeature(feature: Feature) {
    if (feature.isAction()) {
      this.actions.push(feature);
    }
    if (feature.isPassive()) {
      this.passives.push(feature);
    }
    if (feature.isReaction()) {
      this.reactions.push(feature);
    }
  }

  async toAdversary(): Promise<Adversary> {
    if (this.adversary) {
      return this.adversary;
    }
    await this.save();
    this.adversary = new Adversary(
      this.name,
      this.tier,
      this.category,
      this.description,
      this.motivesAndTactics,
      this.difficulty,
      this.thresholds,
      this.hp,
      this.stress,
      this.attack,
      this.experiences,
      this.variables,
      this.tags,
      this.id as string,
      this.horde
    );

    this.adversary.setFeatures(this.passives, this.actions, this.reactions);

    return this.adversary as unknown as Adversary;
  }

  toJson() {
    const output = {
      actions: [] as string[],
      attack: {
        damage: {
          dice: this.attack.getDieCount(),
          die: this.attack.getDie(),
          modifier: this.attack.getDamageModifier(),
          type: this.attack.getDamageType(),
        },
        modifier: this.attack.getModifier(),
        name: this.attack.getName(),
        range: this.attack.getRange(),
      },
      category: this.category,
      description: this.description,
      difficulty: this.difficulty,
      experiences: [] as object[],
      hp: this.hp,
      motives: this.motivesAndTactics,
      name: this.name,
      passives: [] as string[],
      reactions: [] as string[],
      stress: this.stress,
      thresholds: {
        major: this.thresholds.getMajor(),
        severe: this.thresholds.getSevere(),
      },
      tier: this.tier.toNumber(),
      variables: [] as object[],
      tags: this.tags,
    };
    for (const action of this.actions) {
      output.actions.push(action.getId());
    }
    for (const passive of this.passives) {
      output.passives.push(passive.getId());
    }
    for (const reaction of this.reactions) {
      output.reactions.push(reaction.getId());
    }
    for (const experience of this.experiences) {
      output.experiences.push({
        name: experience.name,
        value: experience.value,
      });
    }
    for (const variable of this.variables) {
      output.variables.push({ key: variable.getKey(), value: variable.get() });
    }
    return output;
  }

  async save() {
    const docRef = await addDoc(
      collection(database, "adversaries"),
      this.toJson()
    );
    this.id = docRef.id;
    return this.id;
  }
}

export default class Adversary {
  private readonly name: string;
  private readonly tier: Tier;
  private readonly category: Category;
  private readonly description: string;
  private readonly motivesAndTactics: string;
  private readonly hp: number;
  private readonly stress: number;
  private readonly difficulty: number;
  private readonly thresholds: Thresholds;
  private readonly attack: Attack;
  private readonly experiences: Experience[];
  private readonly variables: FeatureVariable[];
  private readonly tags: string[];
  private readonly horde: number;
  private readonly id: string;
  private passives: PassiveFeature[] = [];
  private actions: ActionFeature[] = [];
  private reactions: ReactionFeature[] = [];

  constructor(
    name: string,
    tier: Tier | number,
    category: Category,
    desc: string,
    motives: string,
    difficulty: number,
    thresholds: Thresholds,
    hp: number,
    stress: number,
    attack: Attack,
    experiences: Experience[],
    variables: FeatureVariable[],
    tags: string[],
    id: string,
    horde?: number
  ) {
    this.name = name;
    if (typeof tier === "number") {
      this.tier = Tier.tierFromNumber(tier);
    } else {
      this.tier = tier;
    }
    this.category = category;
    this.description = desc;
    this.motivesAndTactics = motives;
    this.hp = hp;
    this.stress = stress;
    this.difficulty = difficulty;
    this.thresholds = thresholds;
    this.attack = attack;
    this.experiences = experiences;
    this.variables = variables;
    this.tags = tags;
    this.id = id;
    if (this.category === "Horde") {
      if (horde) {
        this.horde = horde;
      } else {
        this.horde = 1;
      }
    } else {
      this.horde = -1;
    }
  }

  setFeatures(
    passive: PassiveFeature[],
    action: ActionFeature[],
    reaction: ReactionFeature[]
  ) {
    this.passives = passive;
    this.actions = action;
    this.reactions = reaction;
  }

  addFeatureVariable(key: string, value: string) {
    this.variables.push(new FeatureVariable(key, value));
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getTier(): Tier {
    return this.tier;
  }

  getCategory(): Category {
    return this.category;
  }

  getDescription(): string {
    return this.description;
  }

  getMotivesAndTactics(): string {
    return this.motivesAndTactics;
  }

  getAttack(): Attack {
    return this.attack;
  }

  getExperiences(): Experience[] {
    return this.experiences;
  }

  getPassiveFeatures(): PassiveFeature[] {
    return this.passives;
  }

  getActionFeatures(): ActionFeature[] {
    return this.actions;
  }

  getReactionFeatures(): ReactionFeature[] {
    return this.reactions;
  }

  getHP(): number {
    return this.hp;
  }

  getStress(): number {
    return this.stress;
  }

  getDifficulty(): number {
    return this.difficulty;
  }

  getThresholds(): Thresholds {
    return this.thresholds;
  }

  getTags(): string[] {
    return this.tags;
  }

  getHorde(): string {
    return "(" + this.horde + "/HP)";
  }

  getAbbreviation() {
    for (const variable of this.variables) {
      if (variable.getKey() === "abv") {
        return variable.get();
      }
    }
    return "";
  }

  hasExperiences(): boolean {
    return this.experiences.length > 0;
  }

  experiencesAsString(): string {
    let content = "";
    for (let i = 0; i < this.experiences.length; i++) {
      const experience = this.experiences[i];
      content = content + experience.toString();
      if (i < this.experiences.length - 1) {
        content = content + ", ";
      }
    }
    return content;
  }

  addFeature(feature: Feature) {
    if (feature.isAction()) {
      this.actions.push(feature);
    }
    if (feature.isPassive()) {
      this.passives.push(feature);
    }
    if (feature.isReaction()) {
      this.reactions.push(feature);
    }
  }

  getFeatureVariables() {
    return this.variables;
  }

  getMdList(list: string[]) {
    let content = "";
    for (const tag of list) {
      content = content + "\n  - " + tag;
    }

    return content;
  }

  getMarkDown(): string {
    const attack = this.getAttack();
    let str =
      "---\nstatblock: inline\ntags:" +
      this.getMdList(this.getTags()) +
      "\naliases:" +
      this.getMdList([this.getAbbreviation()]) +
      '\n---\n\n```statblock\nlayout: Daggerheart Adversary\nname: "' +
      this.name +
      '"\ntier: "' +
      this.tier.toNumber() +
      '"\ntype: "' +
      this.category +
      (this.getCategory() === "Horde" ? " " + this.getHorde() : "") +
      '"\ndescription: "' +
      this.description +
      '"\nmotives_and_tactics: "' +
      this.motivesAndTactics +
      '"\ndifficulty: "' +
      this.getDifficulty() +
      '"\nthresholds: "' +
      this.getThresholds().toString() +
      '"\nhp: "' +
      this.getHP() +
      '"\nstress: "' +
      this.getStress() +
      '"\natk: "' +
      attack.getModifierAsString() +
      '"\nattack: "' +
      attack.getName() +
      '"\nrange: "' +
      attack.getRange() +
      '"\ndamage: "' +
      attack.getDamageString(true) +
      '"';
    if (this.hasExperiences()) {
      str = str + '\nexperience: "' + this.experiencesAsString() + '"';
    }
    str = str + "\nfeats: ";
    for (const featsList of [this.passives, this.actions, this.reactions]) {
      for (const feat of featsList) {
        str = str + "\n" + feat.getMarkdown(this.variables);
      }
    }

    return str + "\n```\n^statblock\n";
  }

  getJson(): string {
    const attack = this.getAttack();
    let str =
      '{"name":"' +
      this.name +
      '","tier":' +
      this.tier.toNumber() +
      ',"category":"' +
      this.category +
      (this.getCategory() === "Horde" ? " " + this.getHorde() : "") +
      '","description":"' +
      this.description +
      '","motives":"' +
      this.motivesAndTactics +
      '","difficulty":' +
      this.getDifficulty() +
      ',"thresholds":{"major":' +
      this.getThresholds().getMajor() +
      ',"severe":' +
      this.getThresholds().getSevere() +
      '},"hp":' +
      this.getHP() +
      ',"stress":' +
      this.getStress() +
      ',"atk":' +
      attack.getModifier() +
      ',"attack":"' +
      attack.getName() +
      '","range":"' +
      attack.getRange() +
      '","damage":"' +
      attack.getDamageString() +
      '","damageType":"' +
      attack.getDamageType() +
      '","experiences":[';
    for (let index = 0; index < this.experiences.length; index++) {
      const experience = this.experiences[index];
      str =
        str +
        '{"name":"' +
        experience.name +
        '","value":' +
        experience.value +
        "}";
      if (index < this.experiences.length - 1) {
        str = str + ",";
      }
    }
    str = str + '],"passives":[';
    for (let index = 0; index < this.passives.length; index++) {
      str = str + '"' + this.passives[index].getName() + '"';
      if (index < this.passives.length - 1) {
        str = str + ",";
      }
    }
    str = str + '],"actions":[';
    for (let index = 0; index < this.actions.length; index++) {
      str = str + '"' + this.actions[index].getName() + '"';
      if (index < this.actions.length - 1) {
        str = str + ",";
      }
    }
    str = str + '],"reactions":[';
    for (let index = 0; index < this.reactions.length; index++) {
      str = str + '"' + this.reactions[index].getName() + '"';
      if (index < this.reactions.length - 1) {
        str = str + ",";
      }
    }
    str = str + '],"variables:"[';
    for (let index = 0; index < this.variables.length; index++) {
      const variable = this.variables[index];
      str =
        str +
        '{"key":"' +
        variable.getKey() +
        '","value":"' +
        variable.get() +
        '"}';
      if (index < this.variables.length - 1) {
        str = str + ",";
      }
    }
    str = str + '],"tags":[';
    for (let index = 0; index < this.tags.length; index++) {
      str = str + '"' + this.tags[index] + '"';
      if (index < this.tags.length - 1) {
        str = str + ",";
      }
    }
    str = str + "]}";
    return str;
  }

  render() {
    return (
      <>
        <h4>{this.getName()}</h4>
        <h5>
          {this.getTier().toString() +
            " " +
            this.getCategory() +
            (this.getCategory() === "Horde" ? " " + this.getHorde() : "")}
        </h5>
        <p>{this.getDescription()}</p>
        <p>
          <strong>Motives and Tactics: </strong>
          {this.getMotivesAndTactics()}
        </p>
        <hr></hr>
        <div className="container-fluid">
          <div className="row">
            <div className="col-3">
              <h6 className="text-center">Difficulty</h6>
              <p className="text-center">{this.getDifficulty()}</p>
            </div>
            <div className="col-3">
              <h6 className="text-center">Thresholds</h6>
              <p className="text-center">{this.getThresholds().toString()}</p>
            </div>
            <div className="col-3">
              <h6 className="text-center">HP</h6>
              <p className="text-center">{this.getHP()}</p>
            </div>
            <div className="col-3">
              <h6 className="text-center">Stress</h6>
              <p className="text-center">{this.getStress()}</p>
            </div>
          </div>
        </div>
        <p>{this.getAttack().toString()}</p>
        {this.hasExperiences() && (
          <p>
            <strong>Experiences: </strong>
            {this.experiencesAsString()}
          </p>
        )}
        <hr></hr>
        <h4>Features:</h4>
        {convertMdToHtml(this.getPassiveFeatures(), this.getFeatureVariables())}
        {convertMdToHtml(this.getActionFeatures(), this.getFeatureVariables())}
        {convertMdToHtml(
          this.getReactionFeatures(),
          this.getFeatureVariables()
        )}
        <div>
          <Button
            onClick={() => {
              if (this) {
                downloadData(
                  this.getName() + ".md",
                  this.getMarkDown(),
                  "text/markdown"
                );
              }
            }}
          >
            Download .md
          </Button>
          <Button
            onClick={() => {
              if (this) {
                downloadData(
                  this.getName() + ".json",
                  this.getJson(),
                  "text/json"
                );
              }
            }}
          >
            Download .json
          </Button>
          <Button
            onClick={() => {
              if (this) {
                copyToClipboard(this.getMarkDown());
              }
            }}
          >
            Copy .md
          </Button>
          <Button
            onClick={() => {
              if (this) {
                copyToClipboard(this.getJson());
              }
            }}
          >
            Copy .json
          </Button>
        </div>
      </>
    );
  }
}
