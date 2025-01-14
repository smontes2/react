import { useState } from "react";

export function TodoInput(props) {
  const { addTodo } = props;
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="input-container">
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        type="text"
        placeholder="Add a new task"
      />
      <button
        onClick={() => {
          if (!inputValue) {
            return;
          }
          addTodo(inputValue);
		  setInputValue('');
        }}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}
