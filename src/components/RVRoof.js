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
                }}
                width={`${(roofDimensions.length / 45) * 100}%`}
                height={`${(roofDimensions.width / 12) * 100}%`}
                viewBox={`0 0 ${roofDimensions.length} ${roofDimensions.width}`}
                className='roof'
            >
                <defs>
                    <pattern
                        id="smallGrid"
                        width="1"
                        height="1"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M 1 0 L 0 0 0 1`}
                            fill="none"
                            stroke="gray"
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
                {children}
            </svg>
        </div>
    );
}