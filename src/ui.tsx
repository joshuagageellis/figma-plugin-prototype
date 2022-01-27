import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './css/main.css';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import hljs from 'highlight.js/lib/core';
import cssLang from 'highlight.js/lib/languages/css.js';
import 'highlight.js/styles/monokai.css';
hljs.registerLanguage('css', cssLang);
hljs.configure({
  ignoreUnescapedHTML: true
});

import CSSGroup from './ui/css-group';
import CSSExportAll from './ui/css-export';

const App = () => {
  const [textTypes, setTextTypes] = useState([]);
  const [apiErrors, setApiErrors] = useState([]);
  const [sampleText, setSampleText] = useState('Sample Text');
  const [baseFontSize, setBaseFontSize] = useState(16);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.pluginMessage.textTypes) {
        setTextTypes(() => {
          let tmp = Object.assign({}, textTypes);
          tmp = event.data.pluginMessage.textTypes;
          return tmp;
        });
        hljs.highlightAll();
      }

      if (event.data.pluginMessage.errors) {
        setApiErrors(event.data.pluginMessage.errors);
      }
    });
  }, []);

  useEffect(() => {
    hljs.highlightAll();
  }, [baseFontSize]);

  const triggerAction = (e: any, type: string) =>{
    e.preventDefault();
    parent.postMessage({
      pluginMessage: {
        type: type,
        baseFontSize,
        sampleText
      }
    }, '*');
  }

  return (
    <div className='app'>
      <h2>Render All Type CSS</h2>
        <form onSubmit={(e) => triggerAction(e, 'process-css')}>
          <label className='input__label' htmlFor='sample-text'>Sample Text Output</label>
          <input className='input__field' type='text' id='sample-text' placeholder='Sample text...' value={sampleText} onChange={(e) => setSampleText(e.target.value)} />
          <label className='input__label' htmlFor='base-font-size'>Base Font Size</label>
          <input className='input__field' type='number' id='base-font-size' value={baseFontSize} onChange={(e) => setBaseFontSize(Number(e.target.value))} />
          <button className='button button--primary' type='submit'>{'Render CSS Snippets'}</button>
        </form>
        <button className='render-nodes button button--secondary' onClick={(e) => triggerAction(e, 'render-type')}>
          {'Render Figma Nodes'}
        </button>
        {apiErrors.length > 0 ? <h4 className='warning-label'>{'You are likely missing local font files.'}</h4>: null}
        {apiErrors.length ? apiErrors.map((error, index) => <p className='warning-error' key={index}>{error}</p>) : null}
        {textTypes.length ? <CSSExportAll types={textTypes} baseFontSize={baseFontSize} /> : null}
        {textTypes.length ? textTypes.map((type: any) => <CSSGroup baseFontSize={baseFontSize} key={type.id} type={type} />) : null}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('react-root'));
