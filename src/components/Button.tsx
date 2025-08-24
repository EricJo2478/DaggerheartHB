import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  colour?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  onClick: () => void;
}

function Button({ children, colour = "primary", onClick }: Props) {
  return (
    <button type="button" className={"btn btn-" + colour} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
