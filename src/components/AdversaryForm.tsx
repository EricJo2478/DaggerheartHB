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

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Name
        </Form.Label>
        <Col sm={6}>
          <Form.Control name="name" type="text" placeholder="Bear" />
        </Col>
        <Col s={4}>
          <Form.Control name="abbreviation" type="text" placeholder="Bear" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Col sm={6}>
          <Form.Select
            onChange={(e) => {
              FORM.setTier(Number(e.target.value));
            }}
            id="formTier"
            name="tier"
            defaultValue={"Melee"}
          >
            <option value={1}>Tier 1</option>
            <option value={2}>Tier 2</option>
            <option value={3}>Tier 3</option>
            <option value={4}>Tier 4</option>
          </Form.Select>
        </Col>
        <Col sm={6}>
          <Form.Select
            onChange={(e) => {
              FORM.setCategory(e.target.value as Category);
            }}
            id="formCategory"
            name="category"
            defaultValue={"Melee"}
          >
            <option>Bruiser</option>
            <option>Skulk</option>
            <option>Horde</option>
            <option>Social</option>
            <option>Leader</option>
            <option>Solo</option>
            <option>Minion</option>
            <option>Standard</option>
            <option>Ranged</option>
            <option>Support</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group className="mb-3" as={Col} controlId="formGridDesc">
        <Form.Label>Description</Form.Label>
        <Form.Control
          name="description"
          type="text"
          placeholder="A large bear with thick fur and powerful claws."
        />
      </Form.Group>

      <Form.Group className="mb-3" as={Col} controlId="formGridMotives">
        <Form.Label>Motives and Tactics</Form.Label>
        <Form.Control
          name="motives"
          type="text"
          placeholder="Climb, defend territory, pummel, track"
        />
      </Form.Group>

      <Row className="mb-3">
        <Overlay placement="top" overlay={FORM.tooltip("difficulty")}>
          <Form.Group as={Col} controlId="formDifficulty">
            <Form.Label>Difficulty</Form.Label>
            <Form.Control name="difficulty" type="number" placeholder="14" />
          </Form.Group>
        </Overlay>

        <Overlay placement="top" overlay={FORM.tooltip("thresholds")}>
          <Form.Group as={Col} controlId="formThresholds">
            <Form.Label>Thresholds</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control name="major" type="number" placeholder="9" />
              <InputGroup.Text id="basic-addon1">/</InputGroup.Text>
              <Form.Control name="severe" type="number" placeholder="17" />
            </InputGroup>
          </Form.Group>
        </Overlay>

        <Form.Group as={Col} controlId="formHp">
          <Form.Label>HP</Form.Label>
          <Form.Control name="hp" type="number" placeholder="7" />
        </Form.Group>

        <Form.Group as={Col} controlId="formStress">
          <Form.Label>Stress</Form.Label>
          <Form.Control name="stress" type="number" placeholder="2" />
        </Form.Group>
      </Row>

      <Row className="mb-3 ">
        <Overlay placement="top" overlay={FORM.tooltip("attack")}>
          <Form.Group as={Col} controlId="formAtk" lg="4">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">ATK:</InputGroup.Text>
              <Form.Control name="atk" type="number" placeholder="1" />
            </InputGroup>
          </Form.Group>
        </Overlay>

        <Form.Group as={Col} controlId="formAttack" lg="4">
          <InputGroup className="mb-3">
            <Form.Control name="attack" type="text" placeholder="Claws" />
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
              <Form.Control name="dice" type="number" placeholder="1" />
              <InputGroup.Text id="basic-addon1">d</InputGroup.Text>
              <Form.Select name="die" defaultValue={8}>
                <option>4</option>
                <option>6</option>
                <option>8</option>
                <option>10</option>
                <option>12</option>
                <option>20</option>
              </Form.Select>
              <InputGroup.Text id="basic-addon2">+</InputGroup.Text>
              <Form.Control name="damage" type="number" placeholder="3" />
              <Form.Select name="damageType" defaultValue={"phy"}>
                <option>phy</option>
                <option>mag</option>
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
          placeholder="Ambusher +3, Keen Senses +2"
        />
      </Form.Group>

      <h2 className="mb-3 d-inline">Features</h2>

      {renderFeatures()}

      <Form.Group className="mb-3" as={Col}>
        <InputGroup className="mb-3">
          <Form.Select
            defaultValue={"Overwhelming Force"}
            id="pendingFeatureName"
          >
            {featureSelects()}
          </Form.Select>
          <InputGroup.Text id="basic-addon2">X:</InputGroup.Text>
          <Form.Control
            id="pendingFeatureVariable"
            type="text"
            placeholder="Value"
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
              FORM.addFeature(
                FEATURES.getFeatureByName(nameInput.value),
                varInput.value
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
