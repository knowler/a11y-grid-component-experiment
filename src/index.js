import React from 'react';
import ReactDOM from 'react-dom';
import {uniq} from 'lodash-es';

import InteractiveGrid from './InteractiveGrid';

import './App.css';

function App() {
  const [config, setConfig] = React.useState({
    columns: 3,
    data: ['Indigo', 'Blue', 'Purple', 'Red', 'Green'],
  });

  const [form, setForm] = React.useState({
    columns: String(config.columns),
    data: config.data.join(', '),
  });

  React.useEffect(() => {
    setForm({
      columns: String(config.columns),
      data: config.data.join(', '),
    });
  }, [config]);

  const applyConfig = event => {
    setConfig({
      columns: String(form.columns),
      data: uniq(
        form.data
          .trim()
          .replace(/,$/, '')
          .split(',')
          .map(text => text.trim()),
      ),
    });
  };

  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    if (typeof config[event.target.name] === 'number') {
      applyConfig();
    }
  };

  return (
    <main>
      <form
        onBlur={applyConfig}
        onKeyUp={event => {
          if (event.keyCode === 13) applyConfig();
        }}
      >
        <label>
          <span>Columns</span>
          <input
            type="number"
            required
            name="columns"
            min={1}
            max={10}
            value={form.columns}
            onChange={handleChange}
          />
        </label>
        <label>
          <span>Data</span>
          <input type="text" required name="data" value={form.data} onChange={handleChange} />
        </label>
      </form>
      <InteractiveGrid {...config} />
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
