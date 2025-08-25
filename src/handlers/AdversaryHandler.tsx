import Handler from "./Handler";
import Adversary from "../advlib/Adversary";
import { Col, Container, Row } from "react-bootstrap";
import { ADVERSARIES, FEATURES, PAGES } from "../App";
import type { DocumentData } from "firebase/firestore";
import type { AdversaryPrototype } from "../advlib/Adversary";
import Thresholds from "../advlib/Thresholds";
import Attack from "../advlib/Attack";
import Experience from "../advlib/Experience";
import type { KeyList } from "../advlib/Types";
import type { ReactNode } from "react";
import AdversaryCard from "../components/AdversaryCard";
import FeatureVariable from "../advlib/FeatureVariable";

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
    const variables: FeatureVariable[] = [];
    for (const variable of data.variables) {
      variables.push(new FeatureVariable(variable.key, variable.value));
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
      data.tags,
      doc.id,
      data.horde
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

  addAdversary(adversary: Adversary) {
    this.data[adversary.getId()] = adversary;
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
          <Col
            key={adversary.getId()}
            className="mb-3"
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <AdversaryCard>{adversary}</AdversaryCard>
          </Col>
        );
      }
    }
    return (
      <Container>
        <Row>{content}</Row>
      </Container>
    );
  }

  renderCurrent() {
    const adversary = ADVERSARIES.getAdversary();
    if (adversary === undefined) {
      return;
    }
    return adversary.render();
  }
}
