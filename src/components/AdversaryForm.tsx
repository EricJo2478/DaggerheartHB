import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FEATURES, FORM } from "../App";
import { type ReactNode } from "react";
import Overlay from "./Overlay";
import type { Category } from "../advlib/Types";

interface Props {
  renderFeatures: () => ReactNode;
  onSubmit: (e: any) => void;
}

export default function AdversaryForm({ renderFeatures, onSubmit }: Props) {
  const featureSelects = () => {
    const content: ReactNode[] = [];
    const names: string[] = [];
    for (const id of FEATURES.getList()) {
      const feature = FEATURES.getFeatureById(id);
      names.push(feature.getName());
    }
    names.sort();
    for (const name of names) {
      content.push(<option key={name}>{name}</option>);
    }
    return content;
  };

  const firstFeature = () => {
    const names: string[] = [];
    for (const id of FEATURES.getList()) {
      const feature = FEATURES.getFeatureById(id);
      names.push(feature.getName());
    }
    names.sort();
    return names[0];
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Name
        </Form.Label>
        <Col sm={6}>
          <Form.Control name="name" type="text" placeholder="Name" />
        </Col>
        <Col s={4}>
          <Form.Control name="abbreviation" type="text" placeholder="Abbrev" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Col sm={4}>
          <Form.Select
            onChange={(e) => {
              FORM.setTier(Number(e.target.value));
            }}
            id="formTier"
            name="tier"
            defaultValue={"Tier 1"}
          >
            <option value={1}>Tier 1</option>
            <option value={2}>Tier 2</option>
            <option value={3}>Tier 3</option>
            <option value={4}>Tier 4</option>
          </Form.Select>
        </Col>
        <Col sm={4}>
          <Form.Select
            onChange={(e) => {
              FORM.setCategory(e.target.value as Category);
            }}
            id="formCategory"
            name="category"
            defaultValue={"Bruiser"}
          >
            <option>Bruiser</option>
            <option>Horde</option>
            <option>Leader</option>
            <option>Minion</option>
            <option>Ranged</option>
            <option>Skulk</option>
            <option>Social</option>
            <option>Solo</option>
            <option>Standard</option>
            <option>Support</option>
          </Form.Select>
        </Col>
        <Col sm={4}>
          <InputGroup className="mb-3">
            <Form.Control
              disabled
              id="formHorde"
              name="horde"
              type="number"
              placeholder="#"
            />
            <InputGroup.Text id="basic-addon1">/HP</InputGroup.Text>
          </InputGroup>
        </Col>
      </Form.Group>

      <Form.Group className="mb-3" as={Col} controlId="formGridDesc">
        <Form.Label>Description</Form.Label>
        <Form.Control
          name="description"
          type="text"
          placeholder="Descrition..."
        />
      </Form.Group>

      <Form.Group className="mb-3" as={Col} controlId="formGridMotives">
        <Form.Label>Motives and Tactics</Form.Label>
        <Form.Control name="motives" type="text" placeholder="Motives..." />
      </Form.Group>

      <Row className="mb-3">
        <Overlay placement="top" overlay={FORM.tooltip("difficulty")}>
          <Form.Group as={Col} controlId="formDifficulty">
            <Form.Label>Difficulty</Form.Label>
            <Form.Control name="difficulty" type="number" placeholder="##" />
          </Form.Group>
        </Overlay>

        <Overlay placement="top" overlay={FORM.tooltip("thresholds")}>
          <Form.Group as={Col} controlId="formThresholds">
            <Form.Label>Thresholds</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control name="major" type="number" placeholder="#" />
              <InputGroup.Text id="basic-addon1">/</InputGroup.Text>
              <Form.Control name="severe" type="number" placeholder="#" />
            </InputGroup>
          </Form.Group>
        </Overlay>

        <Form.Group as={Col} controlId="formHp">
          <Form.Label>HP</Form.Label>
          <Form.Control name="hp" type="number" placeholder="#" />
        </Form.Group>

        <Form.Group as={Col} controlId="formStress">
          <Form.Label>Stress</Form.Label>
          <Form.Control name="stress" type="number" placeholder="#" />
        </Form.Group>
      </Row>

      <Row className="mb-3 ">
        <Overlay placement="top" overlay={FORM.tooltip("attack")}>
          <Form.Group as={Col} controlId="formAtk" lg="4">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">ATK:</InputGroup.Text>
              <Form.Control name="atk" type="number" placeholder="#" />
            </InputGroup>
          </Form.Group>
        </Overlay>

        <Form.Group as={Col} controlId="formAttack" lg="4">
          <InputGroup className="mb-3">
            <Form.Control name="attack" type="text" placeholder="Attack" />
            <InputGroup.Text id="basic-addon1">:</InputGroup.Text>
            <Form.Select name="range" defaultValue={"Melee"}>
              <option>Melee</option>
              <option>Very Close</option>
              <option>Close</option>
              <option>Far</option>
              <option>Very Far</option>
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Overlay placement="top" overlay={FORM.tooltip("damage")}>
          <Form.Group as={Col} controlId="formDamage" lg="4">
            <InputGroup className="mb-3">
              <Form.Control name="dice" type="number" placeholder="#" />
              <InputGroup.Text id="basic-addon1">d</InputGroup.Text>
              <Form.Select name="die" defaultValue={4}>
                <option>4</option>
                <option>6</option>
                <option>8</option>
                <option>10</option>
                <option>12</option>
                <option>20</option>
              </Form.Select>
              <InputGroup.Text id="basic-addon2">+</InputGroup.Text>
              <Form.Control name="damage" type="number" placeholder="#" />
              <Form.Select name="damageType" defaultValue={"phy"}>
                <option>phy</option>
                <option>mag</option>
                <option>phy/mag</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Overlay>
      </Row>

      <Form.Group className="mb-3" as={Col} controlId="formGridExp">
        <Form.Label>Experiences</Form.Label>
        <Form.Control
          name="experiences"
          type="text"
          placeholder="experience1 +#, experience2 +#"
        />
      </Form.Group>

      <h2 className="mb-3 d-inline">Features</h2>

      {renderFeatures()}

      <Form.Group className="mb-3" as={Col}>
        <InputGroup className="mb-3">
          <Form.Select defaultValue={firstFeature()} id="pendingFeatureName">
            {featureSelects()}
          </Form.Select>
          <InputGroup.Text id="basic-addon2">X:</InputGroup.Text>
          <Form.Control
            id="pendingFeatureVariable"
            type="text"
            placeholder="X..."
          />
          <Button
            variant="secondary"
            onClick={() => {
              const nameInput = document.getElementById(
                "pendingFeatureName"
              ) as HTMLInputElement;
              const varInput = document.getElementById(
                "pendingFeatureVariable"
              ) as HTMLInputElement;
              const value = varInput.value;
              varInput.value = "";
              FORM.addFeature(
                FEATURES.getFeatureByName(nameInput.value),
                value
              );
            }}
          >
            <i className="bi bi-plus"></i>
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" as={Col} controlId="fromTags">
        <Form.Label>Tags</Form.Label>
        <Form.Control name="tags" type="text" placeholder="tag1, tag2" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
