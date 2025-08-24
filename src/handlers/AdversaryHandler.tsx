import Handler from "./Handler";
import Adversary from "../advlib/Adversary";
import {
  convertMdToHtml,
  copyToClipboard,
  downloadData,
} from "../advlib/Utils";
import { Button, Container } from "react-bootstrap";
import { ADVERSARIES, FEATURES, PAGES } from "../App";
import type { DocumentData } from "firebase/firestore";
import type { AdversaryPrototype } from "../advlib/Adversary";
import Thresholds from "../advlib/Thresholds";
import Attack from "../advlib/Attack";
import Experience from "../advlib/Experience";
import type { FeatureVariablePair, KeyList } from "../advlib/Types";
import type { ReactNode } from "react";
import AdversaryCard from "../components/AdversaryCard";

export default class AdversaryHandler extends Handler {
  private adversary?: Adversary;
  private readonly names: KeyList = {};
  private keyword: string = "";

  constructor() {
    super("adversaries");
  }

  openAdversary(a: Adversary) {
    if (this.setFunc) {
      this.adversary = a;
      PAGES.setPage("adversary");
    }
  }

  getAdversary() {
    return this.adversary;
  }

  dataAssemble(doc: DocumentData) {
    const data = doc.data();
    const experiences: Experience[] = [];
    for (const experience of data.experiences) {
      experiences.push(new Experience(experience.name, experience.value));
    }
    const variables: FeatureVariablePair[] = [];
    for (const variable of data.variables) {
      variables.push({ [variable.key]: variable.value });
    }

    const adversary = new Adversary(
      data.name,
      data.tier,
      data.category,
      data.description,
      data.motives,
      data.difficulty,
      new Thresholds(data.thresholds.major, data.thresholds.severe),
      data.hp,
      data.stress,
      new Attack(
        data.attack.modifier,
        data.attack.name,
        data.attack.range,
        data.attack.damage.dice,
        data.attack.damage.die,
        data.attack.damage.modifier,
        data.attack.damage.type
      ),
      experiences,
      variables,
      doc.id
    );

    for (const featureName of data.passives) {
      adversary.addFeature(FEATURES.getFeatureByName(featureName));
    }

    for (const featureName of data.actions) {
      adversary.addFeature(FEATURES.getFeatureByName(featureName));
    }

    for (const featureName of data.reactions) {
      adversary.addFeature(FEATURES.getFeatureByName(featureName));
    }
    this.names[data.name] = doc.id;
    return adversary;
  }

  newAdversary(prototype: AdversaryPrototype) {
    const adversary = prototype.toAdversary();
    return adversary;
  }

  getIdfromName(name: string) {
    return this.names[name];
  }

  getNames() {
    return Object.keys(this.names);
  }

  getAdversaryByName(name: string) {
    return this.getAdversaryById(this.getIdfromName(name));
  }

  getAdversaryById(id: string) {
    return this.data[id];
  }

  setKeyword(keyword: string) {
    this.keyword = keyword;
    PAGES.setPage("adversaries");
  }

  getKeyword() {
    return this.keyword;
  }

  search(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    ADVERSARIES.setKeyword(payload.keyword as string);
  }

  render() {
    const content: ReactNode[] = [];
    const keyword: string = ADVERSARIES.getKeyword().toLowerCase();
    for (const name of ADVERSARIES.getNames().sort()) {
      if (name.toLowerCase().includes(keyword)) {
        const adversary = ADVERSARIES.getAdversaryByName(name);
        content.push(
          <AdversaryCard key={adversary.getId()}>{adversary}</AdversaryCard>
        );
      }
    }
    return (
      <Container fluid className="d-flex">
        {content}
      </Container>
    );
  }

  renderCurrent() {
    const adversary = ADVERSARIES.getAdversary();
    if (adversary === undefined) {
      return;
    }
    return (
      <>
        <h4>{adversary.getName()}</h4>
        <h5>
          {adversary.getTier().toString() + " " + adversary.getCategory()}
        </h5>
        <p>{adversary.getDescription()}</p>
        <p>
          <strong>Motives and Tactics: </strong>
          {adversary.getMotivesAndTactics()}
        </p>
        <hr></hr>
        <div className="container-fluid">
          <div className="row">
            <div className="col-3">
              <h6 className="text-center">Difficulty</h6>
              <p className="text-center">{adversary.getDifficulty()}</p>
            </div>
            <div className="col-3">
              <h6 className="text-center">Thresholds</h6>
              <p className="text-center">
                {adversary.getThresholds().toString()}
              </p>
            </div>
            <div className="col-3">
              <h6 className="text-center">HP</h6>
              <p className="text-center">{adversary.getHP()}</p>
            </div>
            <div className="col-3">
              <h6 className="text-center">Stress</h6>
              <p className="text-center">{adversary.getStress()}</p>
            </div>
          </div>
        </div>
        <p>{adversary.getAttack().toString()}</p>
        {adversary.hasExperiences() && (
          <p>
            <strong>Experiences: </strong>
            {adversary.experiencesAsString()}
          </p>
        )}
        <hr></hr>
        <h4>Features:</h4>
        {convertMdToHtml(
          adversary.getPassiveFeatures(),
          adversary.getFeatureVariables()
        )}
        {convertMdToHtml(
          adversary.getActionFeatures(),
          adversary.getFeatureVariables()
        )}
        {convertMdToHtml(
          adversary.getReactionFeatures(),
          adversary.getFeatureVariables()
        )}
        <div>
          <Button
            onClick={() => {
              if (adversary) {
                downloadData(
                  adversary.getName() + ".md",
                  adversary.getMarkDown(),
                  "text/markdown"
                );
              }
            }}
          >
            Download .md
          </Button>
          <Button
            onClick={() => {
              if (adversary) {
                downloadData(
                  adversary.getName() + ".json",
                  adversary.getJson(),
                  "text/json"
                );
              }
            }}
          >
            Download .json
          </Button>
          <Button
            onClick={() => {
              if (adversary) {
                copyToClipboard(adversary.getMarkDown());
              }
            }}
          >
            Copy .md
          </Button>
          <Button
            onClick={() => {
              if (adversary) {
                copyToClipboard(adversary.getJson());
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
