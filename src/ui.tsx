import * as React from 'react'
import * as ReactDOM from 'react-dom'

// Local Deps.
import CSSGenerator from './ui/css-generator'

type State = {
  cssPartials: { [key: string]: any }
};

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      cssPartials: {},
    };
  }

  render() {
    return (
      <div className='app'>
        <CSSGenerator partials={this.state.cssPartials} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'));