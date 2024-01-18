import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const FormRenderer = () => {
  const [uiSchema, setUiSchema] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [showOptionalFields, setShowOptionalFields] = useState({});
  const [activeOption, setActiveOption] = useState(null);

  const handleJsonChange = (e) => {
    setUiSchema(e.target.value);
  };

  const handleRadioChange = (value) => {
    setActiveOption(value);
  };

  const renderIgnoreCondition = (ignoreCondition, parent) => {
    if (
      ignoreCondition.conditions &&
      ignoreCondition.conditions.length > 0 &&
      parent.subParameters[0].validate.options.map(
        (obj) => obj.value === ignoreCondition.conditions[0].value
      )
    ) {
      return (
        <div key={ignoreCondition.sort}>
          {ignoreCondition.subParameters.map((subParameter) => (
            <div key={subParameter.sort}>{renderFormElement(subParameter)}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderRadioGroup = (element, parent) => (
    <div key={element.sort} className="mb-4">
      <div className="flex">
        {element.validate.options.map((option) => (
          <button
            key={option.value}
            className={`flex-1 mr-2 px-4 py-2 border rounded ${
              activeOption === option.value ? "bg-gray-200 border-blue-500" : ""
            }`}
            onClick={() => {
              handleRadioChange(option.value);
              if (parent.subParameters) {
                parent.subParameters.forEach((subParameter) => {
                  if (
                    subParameter.uiType === "Ignore" &&
                    subParameter.conditions &&
                    subParameter.conditions.length > 0
                  ) {
                    const condition = subParameter.conditions[0];
                    const conditionValue = condition.value;

                    if (option.value === conditionValue) {
                      renderIgnoreCondition(subParameter, parent);
                    }
                  }
                });
              }
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFormElement = (element, parentKey = "", parent = null) => {
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
          <div>
            {element.validate.required ||
            showOptionalFields[element.jsonKey] ? (
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
            ) : null}
            {element.validate.required ? null : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onChange={() =>
                    setShowOptionalFields((prev) => ({
                      ...prev,
                      [element.jsonKey]: !prev[element.jsonKey],
                    }))
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-500">
                  {showOptionalFields[element.jsonKey]
                    ? "Hide advanced fields"
                    : "Show advanced fields"}
                </span>
              </label>
            )}
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
                setIsChecked(e.target.checked);
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
        return renderRadioGroup(element, parent);

      case "Group":
        return (
          <div key={element.sort} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {element.label}
            </label>
            {element.subParameters.map((subParameter) => (
              <div key={subParameter.sort}>
                {renderFormElement(subParameter, key, element)}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderForm = () => {
    try {
      const parsedUiSchema = JSON.parse(uiSchema);
      return (
        <>
          {parsedUiSchema.map((element) => renderFormElement(element))}
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => {
                // Cancel Logic
                console.log("Cancel button clicked");
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                // Submit Logic
                console.log("Submit button clicked");
              }}
            >
              Submit
            </button>
          </div>
        </>
      );
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
