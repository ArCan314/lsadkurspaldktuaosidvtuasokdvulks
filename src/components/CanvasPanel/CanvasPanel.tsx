import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

const CanvasPanel: React.FC = () => {
    const ref = React.useRef(null);
    let graph = null;

    useEffect(() => {
        if (!graph) {
            let data = {
                nodes: [
                    {
                        id: 'node1',
                        x: 100,
                        y: 100
                    },
                    {
                        id: 'node2',
                        x: 200,
                        y: 100
                    }
                ],
                edges: [
                    {
                        source: 'node1',
                        target: 'node2'
                    }
                ]
            }

            graph = new G6.Graph({
                container: ReactDOM.findDOMNode(ref.current),
                renderer: "svg",
                modes: {
                    default: ["zoom-canvas", "drag-node", "drag-canvas"],
                },
                minZoom: 0.5,
                maxZoom: 3,
            });
            graph.data(data);
            graph.render();
        }
    }, [])
    return <div ref={ref} style={{ minWidth: '100%', minHeight: '100%', maxHeight: '100%', maxWidth: '100%', border: '1px solid #ddd' }}></div>;
};

export default CanvasPanel;