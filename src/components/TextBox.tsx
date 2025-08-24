type TextBoxType = "text" | "textarea" | "number";
interface Props {
  label?: string;
  children: string;
  type?: TextBoxType;
  id?: string;
  onChange?: (e: any) => void;
}

function TextBox({ label, children, type = "text", id, onChange }: Props) {
  if (id === undefined) {
    if (label === undefined) {
      id = children.toLowerCase();
    } else {
      id = label.toLowerCase();
    }
  }
  if (type === "textarea") {
    return (
      <>
        {label && <span className="input-group-text">{label}</span>}
        <textarea
          onChange={onChange}
          className="form-control"
          placeholder={children}
          aria-label={children}
          name={id}
        ></textarea>
      </>
    );
  }
  return (
    <>
      {label && <span className="input-group-text">{label}</span>}
      <input
        onChange={onChange}
        type={type}
        className="form-control"
        placeholder={children}
        aria-label={children}
        name={id}
      ></input>
    </>
  );
}

export default TextBox;
