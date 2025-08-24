interface Props {
  options: string[];
  label?: string;
  id?: string;
  onChange?: (e: any) => void;
}

function DropDown({ options, label, id, onChange }: Props) {
  if (id === undefined) {
    if (label === undefined) {
      id = options[0].toLowerCase();
    } else {
      id = label.toLowerCase();
    }
  }
  const renderOptions = () => {
    let vals = [];
    for (const option of options) {
      let id = option + options.indexOf(option);
      if (label) {
        id = label + id;
      }
      vals.push(
        <option key={id} value={option}>
          {option}
        </option>
      );
    }
    return vals;
  };
  return (
    <>
      {label && <label className="input-group-text">{label}</label>}
      <select
        onChange={onChange}
        name={id}
        className="form-select"
        defaultValue={options[0]}
      >
        {renderOptions()}
      </select>
    </>
  );
}

export default DropDown;
