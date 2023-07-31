declare module '@changey/react-leaflet-markercluster'{
    /// <reference types="leaflet.markercluster" />
import { ComponentType } from 'react';
import { DivIcon, Icon, MarkerCluster, Point, PolylineOptions } from 'leaflet';

interface MarkerClusterGroupProps {
    children?: ReactNode;
    
    showCoverageOnHover?: boolean | undefined;

    
    zoomToBoundsOnClick?: boolean | undefined;

   
    spiderfyOnMaxZoom?: boolean | undefined;

    
    removeOutsideVisibleBounds?: boolean | undefined;

    
    animate?: boolean | undefined;

    
    animateAddingMarkers?: boolean | undefined;

  
    disableClusteringAtZoom?: number | undefined;

    
    maxClusterRadius?: number | ((zoom: number) => number) | undefined;

   
    polygonOptions?: PolylineOptions | undefined;

   
    singleMarkerMode?: boolean | undefined;

 
    spiderLegPolylineOptions?: PolylineOptions | undefined;

 
    spiderfyDistanceMultiplier?: number | undefined;

   
    iconCreateFunction?: ((cluster: MarkerCluster) => Icon | DivIcon) | undefined;

    spiderfyShapePositions?: ((count: number, centerPt: Point) => Point[]) | undefined;

 
    clusterPane?: string | undefined;

    
    chunkedLoading?: boolean | undefined;

   
    chunkInterval?: number | undefined;

   
    chunkDelay?: number | undefined;

    
        chunkProgress?: ((processed: number, total: number, elapsed: number) => void) | null;
}

declare const MarkerClusterGroup: ComponentType<MarkerClusterGroupProps>;

export default MarkerClusterGroup;
}

