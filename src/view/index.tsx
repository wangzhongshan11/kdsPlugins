import * as React from 'react'
import * as ReactDOM from 'react-dom'
import "./index.css";
import ToolView from './toolView';

class App extends React.Component {
    render() {
        return (<div>
            <ToolView />
        </div>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));