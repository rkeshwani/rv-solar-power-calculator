import React from 'react';
import { useDroppable } from '@dnd-kit/core';
export function RVRoof({ children, roofDimensions }) {
    const { setNodeRef } = useDroppable({
        id: 'roof',
    });
    return (
        <div ref={setNodeRef}>
            <svg
                style={{
                    position: 'relative',
                    background: 'linear-gradient(0deg, lightgrey 1px, transparent 1px), linear-gradient(90deg, lightgrey 1px, transparent 1px)',
                    backgroundSize: `${(window.innerWidth * (roofDimensions.length / 45)) / roofDimensions.length}px ${(window.innerHeight * (roofDimensions.width / 45)) / roofDimensions.width}px`,
                }}
                width={`${(roofDimensions.length / 45) * 100}%`}
                height={`${(roofDimensions.width / 12) * 100}%`}
                viewBox={`0 0 ${roofDimensions.length} ${roofDimensions.width}`}
                className='roof'
            >{children}</svg>
        </div>);
}