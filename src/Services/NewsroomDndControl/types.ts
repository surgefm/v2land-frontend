import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

// Drag data types (attached to draggable items via getInitialData)

export interface NewsDragData {
  [key: string | symbol]: unknown;
  type: 'news';
  newsId: number;
  sourceDroppableId: string;
}

export interface StackDragData {
  [key: string | symbol]: unknown;
  type: 'stack';
  stackId: number;
  index: number;
  sourceDroppableId: string;
}

export type DragData = NewsDragData | StackDragData;

// Drop target data types (attached to drop targets via getData)

export interface NewsListDropData {
  [key: string | symbol]: unknown;
  type: 'news-list';
  droppableId: string;
}

export interface StackListDropData {
  [key: string | symbol]: unknown;
  type: 'stack-list';
  droppableId: string;
}

export interface StackItemDropData {
  [key: string | symbol]: unknown;
  type: 'stack-item';
  stackId: number;
  index: number;
  closestEdge: Edge | null;
}

export type DropData = NewsListDropData | StackListDropData | StackItemDropData;

// Type guards

export function isNewsDragData(data: Record<string, unknown>): data is NewsDragData {
  return data.type === 'news';
}

export function isStackDragData(data: Record<string, unknown>): data is StackDragData {
  return data.type === 'stack';
}

export function isNewsListDropData(data: Record<string, unknown>): data is NewsListDropData {
  return data.type === 'news-list';
}

export function isStackListDropData(data: Record<string, unknown>): data is StackListDropData {
  return data.type === 'stack-list';
}

export function isStackItemDropData(data: Record<string, unknown>): data is StackItemDropData {
  return data.type === 'stack-item';
}

// Utility for computing destination index from closest-edge

export function getDestinationIndex(
  targetIndex: number,
  edge: Edge,
  sourceIndex: number
): number {
  if (edge === 'top') {
    return sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  }
  // edge === 'bottom'
  return sourceIndex < targetIndex ? targetIndex : targetIndex + 1;
}
