
import { useContext, useMemo, useState } from "react";
import { SolarPanelContext } from "../contexts/SolarPanelContext";
import reactable from "reactablejs";
function RoofItem({ reference, x, y, width, height, type, svgRef, getRef }) {
    const { solarPanels, setSolarPanels } = useContext(SolarPanelContext);
    const gridSize = window.innerWidth / 45;
    // const [position, setPosition] = useState({ x: x, y: y });
    const [dragging, setDragging] = useState(false);
    return (
        <svg>
            <rect
                ref={getRef}
                key={reference}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={type === 'solar' ? 'blue' : ''}
            />
            <text x={x + width / 2} y={y + height / 2} fill="white" style={{ fontSize: '1px', textAnchor: 'middle', dominantBaseline: 'middle' }}>{reference}</text>
        </svg>
    );
}

export default reactable(RoofItem);