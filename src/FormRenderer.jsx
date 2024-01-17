import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const FormRenderer = () => {
  const [uiSchema, setUiSchema] = useState("");
  const [isChecked, setIsChecked] = useState(true);

  const handleJsonChange = (e) => {
    setUiSchema(e.target.value);
  };

  const renderFormElement = (element, parentKey = "") => {
    const key = parentKey ? `${parentKey}.${element.jsonKey}` : element.jsonKey;

    switch (element.uiType) {
      case "Input":
        return (
          <div key={key} className="mb-4 flex">
            <label className="flex-1 block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            <input
              type="text"
              className="flex-1 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={element.placeholder}
            />
          </div>
        );

      case "Select":
        return (
          <div key={key} className="mb-4 flex">
            <label className="flex-1 block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            <div className="relative flex-1">
              <select className="w-full h-full py-2 px-3 text-gray-700 leading-tight appearance-none border rounded focus:outline-none focus:shadow-outline">
                {element.validate.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaCaretDown />
              </div>
            </div>
          </div>
        );

      case "Switch":
        //let isChecked = element.validate.defaultValue || false;
        return (
          <div key={key} className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="mb-2 mr-1"
                //className={`form-checkbox h-3 w-3 mb-2 mr-1 ${isChecked ? 'checked' : ''}`}
                checked={isChecked}
                onChange={(e) => {
                    setIsChecked(e.target.checked)
                    //isChecked = !isChecked
                    //console.log(isChecked)
                  }}
              />
              <label className="block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            </div>
        );

      case "Radio":
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            {element.validate.options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${key}_${option.value}`}
                  name={key}
                  value={option.value}
                  className="mr-2"
                />
                <label htmlFor={`${key}_${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "Group":
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            {element.subParameters.map((subElement) =>
              renderFormElement(subElement, key)
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderForm = () => {
    try {
      const parsedUiSchema = JSON.parse(uiSchema);
      return parsedUiSchema.map((element) => renderFormElement(element));
    } catch (error) {
      return <div className="text-red-500">Invalid JSON Schema</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full border p-2"
          placeholder="Paste UI Schema here..."
          value={uiSchema}
          onChange={handleJsonChange}
        />
      </div>

      <div className="flex-1 p-4">
        <form>{renderForm()}</form>
      </div>
    </div>
  );
};

export default FormRenderer;
