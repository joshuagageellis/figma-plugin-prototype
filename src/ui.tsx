import * as React from 'react'
import * as ReactDOM from 'react-dom'

// Local Deps.
import UnitGroup from './ui/unit-group'
import CSSOutput from './ui/css-output';

type State = {
  cssPartials: { [key: string]: any },
  unit: string,
  baseFont: number,
};

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      cssPartials: {},
      unit: '',
      baseFont: 16,
    };

    this.handleUnitSelect = this.handleUnitSelect.bind(this);
    this.handleBaseFontChange = this.handleBaseFontChange.bind(this);
  }

  handleUnitSelect(e: any) {
    this.setState({
      unit: e.target.value
    });
  }

  handleBaseFontChange(e: any) {
     this.setState({
      baseFont: e.target.value
    });
  }

  render() {
    return (
      <div className='app'>
        <UnitGroup unit={this.state.unit} onChange={this.handleUnitSelect} onBaseFontChange={this.handleBaseFontChange} />
        <CSSOutput unit={this.state.unit} baseFont={this.state.baseFont} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'));