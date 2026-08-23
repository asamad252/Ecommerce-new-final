import { FC } from 'react';

export interface LineSidebarProps {
  items?: (string | { label: string; [key: string]: unknown })[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: 'linear' | 'smooth' | 'sharp';
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  onItemClick?: (index: number, label: string | { label: string; [key: string]: unknown }) => void;
  className?: string;
}

export declare const LineSidebar: FC<LineSidebarProps>;
export default LineSidebar;
