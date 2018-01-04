import React from "react";

const SelectFilter = ({ label, options, ...selectProps }) => (
  <div className="form__row">
    <label>
      <div>{label}</div>
      <select className="form__field form__field--select" {...selectProps}>
        {Object.entries(options).map(([name, text]) => (
          <option key={name} value={name}>
            {text}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default SelectFilter;
