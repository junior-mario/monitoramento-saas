declare module "react-grid-layout" {
  import * as React from "react";

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    static?: boolean;
    minW?: number;
    minH?: number;
  }

  export interface GridLayoutProps {
    className?: string;
    layout: Layout[];
    cols?: number;
    rowHeight?: number;
    width?: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    compactType?: "vertical" | "horizontal" | null;
    draggableHandle?: string;
    onLayoutChange?: (layout: Layout[]) => void;
    children?: React.ReactNode;
  }

  const GridLayout: React.ComponentType<GridLayoutProps>;
  export default GridLayout;

  export function WidthProvider<P>(
    ComposedComponent: React.ComponentType<P>
  ): React.ComponentType<P>;

  export const Responsive: React.ComponentType<any>;
}