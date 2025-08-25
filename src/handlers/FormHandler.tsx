import { type ReactNode } from "react";
import AdversaryForm from "../components/AdversaryForm";
import Handler from "./Handler";
import { Button, Tooltip } from "react-bootstrap";
import { ADVERSARIES, FEATURES, FORM } from "../App";
import type Feature from "../advlib/Feature";
import type {
  Category,
  DamageType,
  Die,
  Distance,
  FeatureVariablePair,
  KeyList,
} from "../advlib/Types";
import { AdversaryPrototype } from "../advlib/Adversary";
import Thresholds from "../advlib/Thresholds";
import Attack from "../advlib/Attack";
import Experience from "../advlib/Experience";
import Tier from "../advlib/Tier";

interface Props {
  featureData: FeatureCVariable;
}

interface FeatureCVariable {
  feature: Feature;
  variable: string;
}

function FeatureSection({ featureData }: Props) {
  const feature = featureData.feature;
  const variable = [{ [feature.getName()]: featureData.variable }];
  return (
    <div className="mb-3">
      <p className="d-inline">
        <strong>{feature.getDisplayName(variable)}</strong>:{" "}
        {feature.getDescription(variable)}
      </p>
      <Button
        variant="secondary"
        onClick={() => {
          console.log(feature);
          FORM.removeFeature(featureData);
        }}
      >
        <i className="bi bi-trash"></i>
      </Button>
    </div>
  );
}

export default class FormHandler extends Handler {
  features: KeyList = {};
  private tier: Tier;
  private category: Category;

  constructor() {
    super("");
    this.tier = Tier.tierFromNumber(1);
    this.category = "Bruiser";
  }

  handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    const variables = FORM.getVariables();
    const features = FORM.getFeatures();

    const abbreviation = payload.abbreviation as string;
    variables.push({
      abv: abbreviation,
    });
    if (abbreviation[abbreviation.length - 1] === "s") {
      variables.push({
        abvp: abbreviation + "'",
      });
    } else {
      variables.push({
        abvp: abbreviation + "'s",
      });
    }

    const experiences = [];
    for (const expStr of (payload.experiences as string).split(",")) {
      const data = expStr.trim().split(" ");
      let name = "";
      let value = 0;
      for (let i = 0; i < data.length; i++) {
        if (isNaN(Number(data[i]))) {
          if (name === "") {
            name = name + data[i];
          } else {
            name = name + " " + data[i];
          }
        } else {
          value = Number(data[i]);
        }
      }
      experiences.push(new Experience(name, value));
    }

    const tags: string[] = [];
    for (const tag of (payload.tags as string).split(",")) {
      tags.push(tag.trim());
    }

    const prototype = new AdversaryPrototype(
      payload.name as string,
      Number(payload.tier),
      payload.category as Category,
      payload.description as string,
      payload.motives as string,
      Number(payload.difficulty),
      new Thresholds(Number(payload.major), Number(payload.severe)),
      Number(payload.hp),
      Number(payload.stress),
      new Attack(
        Number(payload.atk),
        payload.attack as string,
        payload.range as Distance,
        Number(payload.dice),
        Number(payload.die) as Die,
        Number(payload.damage),
        payload.damageType as DamageType
      ),
      experiences,
      variables,
      features,
      tags
    );

    ADVERSARIES.newAdversary(prototype).then((adversary) => {
      ADVERSARIES.addAdversary(adversary);
      ADVERSARIES.openAdversary(adversary);
    });
  }

  getTier() {
    return this.tier;
  }

  getCategory() {
    return this.category;
  }

  setTier(tier: number) {
    this.tier = Tier.tierFromNumber(tier);
  }

  setCategory(category: Category) {
    this.category = category;
  }

  tooltip = (key: string) => {
    return (props: any) => {
      return (
        <Tooltip id="button-tooltip" {...props}>
          {this.tier.getTooltip(key, this.category)}
        </Tooltip>
      );
    };
  };

  removeFeature(featureData: FeatureCVariable) {
    delete this.features[featureData.feature.getId()];
    this.reload();
  }

  addFeature(feature: Feature, variable: string) {
    if (Object.keys(this.features).includes(feature.getId())) {
      return;
    }
    this.features[feature.getId()] = { feature: feature, variable: variable };
    this.reload();
  }

  getVariables() {
    const variables: FeatureVariablePair[] = [];
    for (const featureData of Object.values(this.features)) {
      console.log(featureData);
      if (featureData.variable !== "") {
        variables.push({
          [featureData.feature.getName()]: featureData.variable,
        });
      }
    }
    return variables;
  }

  getFeatures() {
    const features = [];
    for (const id of Object.keys(this.features)) {
      features.push(FEATURES.getFeatureById(id));
    }
    return features;
  }

  render(features?: KeyList) {
    features = FORM.features;
    return (
      <AdversaryForm
        onSubmit={FORM.handleSubmit}
        renderFeatures={() => {
          const content: ReactNode[] = [];
          for (const feature of Object.values(features)) {
            content.push(
              <FeatureSection
                key={feature.feature.getId()}
                featureData={feature}
              ></FeatureSection>
            );
          }
          return content;
        }}
      ></AdversaryForm>
    );
  }
}
