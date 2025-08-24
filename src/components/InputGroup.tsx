import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function InputGroup({ children }: Props) {
  return (
    <>
      <div className="input-group mb-3">{children}</div>
    </>
  );
}

export default InputGroup;
