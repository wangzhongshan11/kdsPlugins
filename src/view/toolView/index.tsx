import * as React from 'react';
import "./index.css";

interface State {
    active: boolean;
}

export default class ToolView extends React.Component<{}, State> {
    state: Readonly<State> = { active: false };

    componentDidMount(): void {
        window.addEventListener("message", this.onMessage);
    }

    componentWillUnmount(): void {
        window.removeEventListener("message", this.onMessage);
    }

    private onMessage = (event: any) => {
        const messageData = event.data;
        if (messageData.type === 'leaveAlignTool') {
            this.setState({ active: false });
        }
        console.log(messageData.type);
    }

    private onClick = () => {
        const { active } = this.state;
        if (active) {
            window.parent.postMessage({ type: 'deActivateAlignTool' }, '*');
        } else {
            window.parent.postMessage({ type: 'activateAlignTool' }, '*');
        }
        console.log('active: ' + !active)
        this.setState({ active: !active });
    }

    render() {
        const { active } = this.state;
        const className = active ? 'tool-button-active' : 'button tool-button-normal';
        return <div className="button-wrapper">
            <button className={`button ${className}`} onClick={this.onClick}>对齐</button>
        </div>
    }
}

