import { Button, Card } from "react-bootstrap";
import type Adversary from "../advlib/Adversary";
import { ADVERSARIES } from "../App";

interface Props {
  children: Adversary;
}

export default function AdversaryCard({ children }: Props) {
  return (
    <Card className="h-100 w-100" style={{ width: "18rem" }}>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{children.getName()}</Card.Title>
        <Card.Subtitle>
          {children.getTier().toString() + " " + children.getCategory()}
        </Card.Subtitle>
        <Card.Text>{children.getDescription()}</Card.Text>
        <div className="mt-auto">
          <hr />
          <Card.Text>
            {"DC: " +
              children.getDifficulty() +
              " HP: " +
              children.getHP() +
              " Stress: " +
              children.getStress() +
              " AC: " +
              children.getThresholds().toString()}
          </Card.Text>
          <Card.Text>{children.getAttack().toString()}</Card.Text>
          <Button
            onClick={(e) => {
              e.preventDefault();
              ADVERSARIES.openAdversary(children);
            }}
            variant="primary"
          >
            Select
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
