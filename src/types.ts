// src/types.ts

import { ReactNode } from 'react';

export interface ComponentInspectorProps {
  children: ReactNode;
  enabled?: boolean;
}

export interface ElementInfo {
  tagName: string;
  reactName?: string;
  props?: Record<string, any>;
  fiber?: any;
  element?: HTMLElement;
}

export interface FiberNode {
  name: string;
  fiber: any;
  children: FiberNode[];
}

export interface ServerInfo {
  id: string;
  name: string;
  description?: string;
}

export interface ToolInfo {
  name: string;
  description?: string;
}

export interface ResourceInfo {
  name: string;
  description?: string;
  uri: string;
}

export interface PromptInfo {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required: boolean;
  }>;
}

export interface QueryResult {
  serverId: string;
  success: boolean;
  response?: string;
  error?: string;
}
