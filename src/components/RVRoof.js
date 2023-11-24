import React, { useContext } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SolarPanelContext } from '../contexts/SolarPanelContext';
export function RVRoof({ children, roofDimensions, svgRef }) {
    const { solarPanels, setSolarPanels } = useContext(SolarPanelContext);

    return (
        <div>
            <div style={{ display: 'flex', alignItems:"center" }}>
                <div style={{ marginRight: '10px', transform: 'rotate(-90deg)', transformOrigin: 'left top' }}>
                    Width
                </div>
                <svg
                    ref={svgRef}
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
                                strokeWidth="0.1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#smallGrid)">
                    </rect>
                    {children}
                </svg>
            </div>
            <div style={{ marginTop: '10px' }}>
                Length
            </div>
        </div>
    );
}