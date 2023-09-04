import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";
import { createSnapModifier, snapCenterToCursor, restrictToParentElement } from "@dnd-kit/modifiers";
export function RoofItem({ key, x, y, width, height, type }) {
    const { attributes, transform, listeners, setNodeRef } = useDraggable({
        id: 'item',
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    const gridSize = window.innerWidth / 45;
    const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
    return (
        <rect
            {...listeners}
            {...attributes}
            modifiers={[snapToGrid, snapCenterToCursor, restrictToParentElement]}
            style={style}
            ref={setNodeRef}
            key={key}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={type === 'solar' ? 'blue' : ''}

        />);
}