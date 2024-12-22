import * as React from 'react';
import { Tooltip } from 'antd';
import "./index.css";
import "../assets/align.svg";
import "../assets/patchMakeGroup.svg";
import "../assets/copyCrossGroup.svg";
import "../assets/growArray.svg";
import "../assets/dropCrossGroup.svg";

enum ToolType {
    Context = 0,
    Apply = 1,
}

interface ToolItem {
    name: string;
    type: ToolType;
    key: string;
    icon?: string;
    tip?: string;
    tipImg?: string;
}

const tools: ToolItem[][] = [
    {
        name: "对齐",
        type: ToolType.Context,
        key: "AlignTool",
        tip: "对齐工具",
        icon: "align",
    },
    {
        name: "批量成组",
        type: ToolType.Apply,
        key: "PatchMakeGroupTool",
        tip: "批量成组工具",
        icon: "patchMakeGroup",

    },
    // {
    //     name: "跨组复制",
    //     type: ToolType.Context,
    //     key: "CopyCrossGroupTool",
    //     tip: "跨组复制工具",
    //     icon: "copyCrossGroup",

    // },
    // {
    //     name: "生长阵列",
    //     type: ToolType.Context,
    //     key: "GrowArrayTool",
    //     tip: "生长阵列工具",
    //     icon: "growArray",

    // },
    // {
    //     name: "跨组放入",
    //     type: ToolType.Context,
    //     key: "DropCrossGroupTool",
    //     tip: "跨组放入工具",
    //     icon: "dropCrossGroup",

    // },
].reduce<ToolItem[][]>((result, item) => {
    if (result.length === 0 || result[result.length - 1].length >= 3) {
        result.push([]);
    }
    result[result.length - 1].push(item);
    return result;
}, []);

interface State {
    activeToolKey?: string;
}

export default class ToolView extends React.Component<{}, State> {
    state: Readonly<State> = { activeToolKey: undefined };

    componentDidMount(): void {
        window.addEventListener("message", this.onMessage);
    }

    componentWillUnmount(): void {
        window.removeEventListener("message", this.onMessage);
    }

    private onMessage = (event: any) => {
        const messageData = event.data;
        if (messageData?.type?.startsWith('leave')) {
            this.setState({ activeToolKey: undefined });
        }
        console.log(messageData.type);
    }

    private onClick = (toolItem: ToolItem) => {
        const { activeToolKey } = this.state;
        if (activeToolKey === toolItem.key) {
            window.parent.postMessage({ type: `deActivate${toolItem.key}` }, '*');
            this.setState({ activeToolKey: undefined });
        } else {
            window.parent.postMessage({ type: `activate${toolItem.key}` }, '*');
            this.setState({ activeToolKey: toolItem.key });
        }
        if (toolItem.key === "PatchMakeGroupTool") {
            setTimeout(() => {
                window.parent.postMessage({ type: `deActivate${toolItem.key}` }, '*');
                this.setState({ activeToolKey: undefined });
            }, 50);
        }
        // console.log('active: ' + !active)
    }

    render() {
        const { activeToolKey } = this.state;
        return <div className='tools-wrapper'>
            {tools.map((row, index) => {
                return <div className="row-wrapper" key={index}>
                    {row.map(toolItem => {
                        const className = activeToolKey === toolItem.key ? 'tool-button-active' : 'button tool-button-normal';
                        return <div className='button-wrapper' key={toolItem.key}>
                            <Tooltip title={toolItem.name} color={"#f9f6b3"} overlayInnerStyle={{ color: "black" }}>
                                <button
                                    className={`button ${className}`}
                                    onClick={this.onClick.bind(this, toolItem)}
                                // key={toolItem.key}
                                // disabled={!!activeToolKey && activeToolKey !== toolItem.key}
                                >
                                    <svg className={`svg-icon`} >
                                        <use xlinkHref={`#${toolItem.icon}`} />
                                    </svg>
                                    {/* {toolItem.name[0]} */}
                                </button>
                            </Tooltip>


                        </div>
                    })}
                </div>
            })}
        </div>
    }
}

