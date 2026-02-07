import "./App.css";

import { useState } from "react";

const VITE_LOGO = `/images/vite.svg`;
const REACT_LOGO = `/images/react.svg`;

/**
 * The main application component.
 */
function App() {
  const INITIAL_COUNT = 0;
  const [count, setCount] = useState(INITIAL_COUNT);

  return (
    <main>
      <div className="flex justify-center">
        <a href="https://vite.dev" rel="noreferrer" target="_blank">
          <img alt="Vite logo" className="logo" src={VITE_LOGO} />
        </a>
        <a href="https://react.dev" rel="noreferrer" target="_blank">
          <img
            alt="React logo"
            className="logo react logo-spin"
            src={REACT_LOGO}
          />
        </a>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold">Vite + React</h1>
        <button
          className="my-2 rounded-sm bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
          onClick={() => {
            const incrementValue = 1;
            setCount(prevCount => prevCount + incrementValue);
          }}
          type="button">
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </main>
  );
}

export default App;
