import { OverlayTrigger } from "react-bootstrap";
import type { OverlayChildren } from "react-bootstrap/esm/Overlay";

interface Props {
  children?: any;
  overlay: OverlayChildren;
  placement: "top" | "bottom";
}

export default function Overlay({ children, overlay, placement }: Props) {
  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: 250, hide: 400 }}
      overlay={overlay}
    >
      {children}
    </OverlayTrigger>
  );
}
