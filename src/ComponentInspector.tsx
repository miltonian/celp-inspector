// src/ComponentInspector.tsx
import React, {
    useState,
    useEffect,
    ReactNode,
    useRef,
    FormEvent
  } from 'react';
  import {
    X, Info, Code, ChevronRight, ChevronDown,
    Layers, Eye, EyeOff, Hand, MousePointer,
    Settings, Maximize, PanelRight, Server, Send
  } from 'lucide-react';
  import { cn } from './inspector-utils';
  import {
    ComponentInspectorProps,
    ElementInfo,
    FiberNode,
    ServerInfo,
    ToolInfo,
    ResourceInfo,
    PromptInfo,
    QueryResult,
  } from './types';
  
  /**
   * The main Inspector component.
   * 
   * Usage: 
   *   <ComponentInspector enabled>
   *     <App />
   *   </ComponentInspector>
   */


export function ComponentInspector({ children, enabled = false }: ComponentInspectorProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [componentTree, setComponentTree] = useState<FiberNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [inspectMode, setInspectMode] = useState(false); // Default to interaction mode
  const [isPickingElement, setIsPickingElement] = useState(false); // For manual element selection
  const overlayRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  
  // Section collapse states
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);
  const [isMcpExpanded, setIsMcpExpanded] = useState(false);
  
  // MCP Client state
  const [mcpApiUrl, setMcpApiUrl] = useState<string>('http://localhost:3001');
  const [availableServers, setAvailableServers] = useState<ServerInfo[]>([]);
  const [activeServers, setActiveServers] = useState<string[]>([]);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [mcpTools, setMcpTools] = useState<Record<string, ToolInfo[]>>({});
  const [mcpResources, setMcpResources] = useState<Record<string, ResourceInfo[]>>({});
  const [mcpPrompts, setMcpPrompts] = useState<Record<string, PromptInfo[]>>({});
  const [queryInput, setQueryInput] = useState<string>('');
  const [queryResults, setQueryResults] = useState<QueryResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullResponse, setFullResponse] = useState<string | null>(null);
  const [componentMcpServer, setComponentMcpServer] = useState<string | null>(null);
  const [componentMcpItemType, setComponentMcpItemType] = useState<'tool' | 'prompt' | 'resource' | null>(null);
  const [componentMcpItem, setComponentMcpItem] = useState<any>(null);
  
  // Show MCP settings section
  const [showMcpSettings, setShowMcpSettings] = useState(false);

  // Toggle inspector with keyboard shortcut (Alt+Shift+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'C') {
        setIsEnabled(prev => !prev);
      } else if (e.altKey && e.shiftKey && e.key === 'I') {
        // Add shortcut to toggle inspect mode (Alt+Shift+I)
        setInspectMode(prev => !prev);
      } else if (e.altKey && e.shiftKey && e.key === 'S') {
        // Add shortcut to toggle sidebar (Alt+Shift+S)
        setIsSidebarOpen(prev => !prev);
      } else if (e.altKey && e.shiftKey && e.key === 'M') {
        // Add shortcut to show MCP settings (Alt+Shift+M)
        setIsSidebarOpen(true);
        setShowMcpSettings(true);
        setIsMcpExpanded(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle messages from iframes for toggling component selection
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // alert('handleMessage')
      // Check if the message has the expected format
      if (event.data && typeof event.data === 'object' && event.data.type === 'TOGGLE_COMPONENT_SELECTION') {
        const { enabled } = event.data;
        
        // Show the inspector sidebar when enabled is true, hide when false
        if (enabled === true) {
          // setIsSidebarOpen(true);
          setInspectMode(true);
        } else if (enabled === false) {
          // setIsSidebarOpen(false);
          setInspectMode(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Find React fiber for an element
  const getFiberFromDOM = (element: HTMLElement) => {
    // React DevTools stores the fiber reference in internal properties
    // These property names might change in future React versions
    const key = Object.keys(element).find(
      key => key.startsWith('__reactFiber$') || 
             key.startsWith('__reactInternalInstance$')
    );
    
    return key ? element[key as keyof HTMLElement] : null;
  };

  // Get component name from fiber
  const getComponentName = (fiber: any): string => {
    if (!fiber) return 'Unknown';
    
    const { type } = fiber;
    if (typeof type === 'string') {
      return type; // HTML element
    }
    
    return type?.displayName || type?.name || 'Anonymous Component';
  };

  // Get component props from fiber
  const getComponentProps = (fiber: any) => {
    if (!fiber || !fiber.memoizedProps) return {};
    
    // Filter out children and internal props
    const { children, ...props } = fiber.memoizedProps;
    return props;
  };

  // Build component tree
  const buildComponentTree = (fiber: any, depth = 0, maxDepth = 10): FiberNode | null => {
    if (!fiber || depth > maxDepth) return null;

    const name = getComponentName(fiber);
    const node: FiberNode = {
      name,
      fiber,
      children: []
    };

    // Find child fibers
    let childFiber = fiber.child;
    while (childFiber) {
      const childNode = buildComponentTree(childFiber, depth + 1, maxDepth);
      if (childNode) {
        node.children.push(childNode);
      }
      childFiber = childFiber.sibling;
    }

    return node;
  };

  // Update element highlight position and size
  const updateHighlight = (element: HTMLElement | null) => {
    if (!element || !highlightRef.current) return;
    
    const rect = element.getBoundingClientRect();
    const highlight = highlightRef.current;
    
    highlight.style.left = `${rect.left}px`;
    highlight.style.top = `${rect.top}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.display = 'block';
  };

  // Set element info after selecting it
  const setElementInfo = (element: HTMLElement) => {
    const fiber = getFiberFromDOM(element);
    
    setSelectedElement({
      tagName: element.tagName.toLowerCase(),
      reactName: getComponentName(fiber),
      props: getComponentProps(fiber),
      fiber,
      element
    });

    // Reset MCP selections when a new element is selected
    setComponentMcpServer(null);
    setComponentMcpItemType(null);
    setComponentMcpItem(null);

    // Expand details section, collapse others if they were closed
    setIsDetailsExpanded(true);
    
    // Build component tree
    if (fiber) {
      const tree = buildComponentTree(fiber);
      setComponentTree(tree);
      
      // Auto-expand the root node
      if (tree) {
        setExpandedNodes(new Set([`${tree.name}-0`]));
      }
    }
  };

  // Start element picking mode
  const startPickingElement = () => {
    setIsPickingElement(true);
  };

  // Global event handlers for when inspector is active
  useEffect(() => {
    if (!isEnabled) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      
      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      
      // Skip if we're hovering over our own UI elements
      if (!element || 
          element === overlayRef.current || 
          element === highlightRef.current ||
          overlayRef.current?.contains(element) ||
          element.hasAttribute('data-inspector-ui') ||
          element.closest('[data-inspector-ui="true"]')) {
        if (highlightRef.current) {
          highlightRef.current.style.display = 'none';
        }
        return;
      }
      
      // Update floating indicator position
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
      
      // Update element highlight
      if ((showBoundaries && inspectMode) || isPickingElement) {
        setHoveredElement(element);
        updateHighlight(element);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      if (!isEnabled) return;
      
      // Skip if we're clicking on our own UI elements
      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!element || 
          element === overlayRef.current || 
          element === highlightRef.current ||
          overlayRef.current?.contains(element) ||
          element.hasAttribute('data-inspector-ui') ||
          element.closest('[data-inspector-ui="true"]')) {
        return;
      }

      // If in element picking mode, select the element and exit picking mode
      if (isPickingElement) {
        e.preventDefault();
        e.stopPropagation();
        
        setElementInfo(element);
        // setIsSidebarOpen(true);
        setIsPickingElement(false);
        
        // Send a message to the parent window (if in an iframe)
        try {
          const messageData = {
            type: 'ELEMENT_SELECTED',
            element: {
              // ...element,
              tagName: element.tagName.toLowerCase(),
              reactName: getComponentName(getFiberFromDOM(element)),
              id: element.id,
              className: element.className,
              dataset: JSON.stringify(element.dataset),
            }
          };
          window.parent.postMessage(messageData, '*');
          console.log('Sent element selection message to parent:', messageData);
        } catch (err) {
          console.error('Error sending message to parent:', err);
        }
        
        return;
      }

      // In interaction mode, don't do anything (just let the click pass through)
      if (!inspectMode) {
        return;
      }
      
      // In inspect mode, prevent default behavior to avoid triggering actions
      e.preventDefault();
      e.stopPropagation();
      
      setElementInfo(element);
      // setIsSidebarOpen(true);
      
      // Send a message to the parent window (if in an iframe)
      try {
        const messageData = {
          type: 'ELEMENT_SELECTED',
          element: {
            // ...element,
            tagName: element.tagName.toLowerCase(),
            reactName: getComponentName(getFiberFromDOM(element)),
            id: element.id,
            className: element.className,
            dataset: JSON.stringify(element.dataset),
          }
        };
        window.parent.postMessage(messageData, '*');
        console.log('Sent element selection message to parent:', messageData);
      } catch (err) {
        console.error('Error sending message to parent:', err);
      }
    };

    // Add global event listeners
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('click', handleGlobalClick, { capture: true });
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [isEnabled, showBoundaries, isSidebarOpen, inspectMode, isPickingElement]);

  const toggleNodeExpansion = (nodeName: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return newSet;
    });
  };

  const selectNodeInTree = (node: FiberNode) => {
    // Get DOM node from fiber if possible
    let domNode = null;
    
    // In React, the stateNode property often points to the DOM node
    if (node.fiber.stateNode instanceof HTMLElement) {
      domNode = node.fiber.stateNode;
    }
    
    if (domNode) {
      setSelectedElement({
        tagName: domNode.tagName.toLowerCase(),
        reactName: node.name,
        props: getComponentProps(node.fiber),
        fiber: node.fiber,
        element: domNode
      });
      
      // Update highlight
      updateHighlight(domNode);
      
      // Switch to details
      setIsDetailsExpanded(true);
    }
  };

  // Collapsible section component
  const CollapsibleSection = ({ 
    title, 
    icon, 
    isExpanded, 
    onToggle, 
    children, 
    className = "" 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    isExpanded: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={`border-b ${className}`}>
        <div 
          className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={onToggle}
        >
          <span className="mr-2">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span className="flex items-center gap-2 font-medium">
            {icon}
            {title}
          </span>
        </div>
        {isExpanded && (
          <div className="p-3 pt-0 border-t border-gray-100 dark:border-gray-800">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Render tree node recursively
  const renderTreeNode = (node: FiberNode, index: number, path = '') => {
    const currentPath = path ? `${path}-${index}` : String(index);
    const nodeId = `${node.name}-${currentPath}`;
    const isExpanded = expandedNodes.has(nodeId);
    
    return (
      <div key={nodeId} className="select-none">
        <div 
          className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
        >
          <span 
            className="mr-1" 
            onClick={() => toggleNodeExpansion(nodeId)}
          >
            {node.children.length > 0 ? (
              isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <span className="w-[14px] inline-block"></span>
            )}
          </span>
          <span 
            className="font-medium flex-1"
            onClick={() => selectNodeInTree(node)}
          >
            {node.name}
          </span>
        </div>
        
        {isExpanded && node.children.length > 0 && (
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2">
            {node.children.map((child, i) => renderTreeNode(child, i, currentPath))}
          </div>
        )}
      </div>
    );
  };

  // Helper function to create loading indicators
  const createLoadingElement = () => {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="loader"></div>
      </div>
    );
  };

  // MCP Client functions
  const fetchMcpServers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${mcpApiUrl}/api/servers`);
      const data = await response.json();
      
      setAvailableServers(data.servers || []);
      setActiveServers(data.activeConnections || []);
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
      setIsLoading(false);
      return { servers: [], activeConnections: [] };
    }
  };

  const connectToMcpServer = async (serverId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${mcpApiUrl}/api/servers/${serverId}/connect`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add to active servers if not already there
        if (!activeServers.includes(serverId)) {
          setActiveServers(prev => [...prev, serverId]);
        }
        
        // Update tools for it if it's selected
        if (selectedServers.includes(serverId)) {
          fetchMcpToolsForSelectedServers();
        }
      }
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error(`Error connecting to MCP server ${serverId}:`, error);
      setIsLoading(false);
      return { success: false, error: String(error) };
    }
  };

  const disconnectFromMcpServer = async (serverId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${mcpApiUrl}/api/servers/${serverId}/disconnect`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from active servers
        setActiveServers(prev => prev.filter(id => id !== serverId));
        
        // Remove from selected servers if present
        setSelectedServers(prev => prev.filter(id => id !== serverId));
        
        // Update tools display
        fetchMcpToolsForSelectedServers();
      }
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error(`Error disconnecting from MCP server ${serverId}:`, error);
      setIsLoading(false);
      return { success: false, error: String(error) };
    }
  };

  const fetchMcpToolsForSelectedServers = async () => {
    if (selectedServers.length === 0) {
      setMcpTools({});
      return;
    }
    
    try {
      setIsLoading(true);
      const toolsByServer: Record<string, ToolInfo[]> = {};
      
      // Fetch tools for each selected server
      for (const serverId of selectedServers) {
        try {
          const response = await fetch(`${mcpApiUrl}/api/servers/${serverId}/status`);
          const data = await response.json();
          
          if (data.connected && data.tools && data.tools.length > 0) {
            toolsByServer[serverId] = data.tools;
          }
        } catch (err) {
          console.error(`Error fetching tools for server ${serverId}:`, err);
        }
      }
      
      setMcpTools(toolsByServer);
      
      // Also update resources and prompts
      fetchMcpResourcesForSelectedServers();
      fetchMcpPromptsForSelectedServers();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tools for selected MCP servers:', error);
      setIsLoading(false);
    }
  };

  const fetchMcpResourcesForSelectedServers = async () => {
    if (selectedServers.length === 0) {
      setMcpResources({});
      return;
    }
    
    try {
      const resourcesByServer: Record<string, ResourceInfo[]> = {};
      
      // Fetch resources for each selected server
      for (const serverId of selectedServers) {
        try {
          const response = await fetch(`${mcpApiUrl}/api/servers/${serverId}/resources`);
          const data = await response.json();
          
          if (data.resources && data.resources.length > 0) {
            resourcesByServer[serverId] = data.resources;
          }
        } catch (err) {
          console.log(`Server ${serverId} does not support resources:`, err);
        }
      }
      
      setMcpResources(resourcesByServer);
    } catch (error) {
      console.error('Error fetching resources for selected MCP servers:', error);
    }
  };

  const fetchMcpPromptsForSelectedServers = async () => {
    if (selectedServers.length === 0) {
      setMcpPrompts({});
      return;
    }
    
    try {
      const promptsByServer: Record<string, PromptInfo[]> = {};
      
      // Fetch prompts for each selected server
      for (const serverId of selectedServers) {
        try {
          const response = await fetch(`${mcpApiUrl}/api/servers/${serverId}/prompts`);
          const data = await response.json();
          
          if (data.prompts && data.prompts.length > 0) {
            promptsByServer[serverId] = data.prompts;
          }
        } catch (err) {
          console.log(`Server ${serverId} does not support prompts:`, err);
        }
      }
      
      setMcpPrompts(promptsByServer);
    } catch (error) {
      console.error('Error fetching prompts for selected MCP servers:', error);
    }
  };

  const viewMcpResourceContent = async (serverId: string, resourceUri: string) => {
    try {
      // Create a modal dialog to display the resource content
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.position = 'fixed';
      modal.style.zIndex = '10000';
      modal.style.left = '0';
      modal.style.top = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalContent.style.backgroundColor = 'white';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '5px';
      modalContent.style.width = '80%';
      modalContent.style.maxWidth = '700px';
      modalContent.style.maxHeight = '80vh';
      modalContent.style.overflow = 'auto';
      modalContent.style.position = 'relative';
      
      const closeBtn = document.createElement('span');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '15px';
      closeBtn.style.fontSize = '24px';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.color = '#888';
      closeBtn.onclick = () => document.body.removeChild(modal);
      
      const title = document.createElement('h3');
      title.textContent = 'Resource Content';
      title.style.marginTop = '0';
      
      const content = document.createElement('div');
      content.className = 'resource-content';
      content.style.marginTop = '15px';
      content.style.padding = '10px';
      content.style.backgroundColor = '#f5f5f5';
      content.style.borderRadius = '3px';
      content.textContent = 'Loading...';
      
      modalContent.appendChild(closeBtn);
      modalContent.appendChild(title);
      modalContent.appendChild(content);
      modal.appendChild(modalContent);
      
      document.body.appendChild(modal);
      
      // Fetch the resource content
      const encodedUri = encodeURIComponent(resourceUri);
      const response = await fetch(`${mcpApiUrl}/api/servers/${serverId}/resources/${encodedUri}`);
      const data = await response.json();
      
      if (data.resource && data.resource.contents) {
        content.innerHTML = '';
        const preElement = document.createElement('pre');
        preElement.style.whiteSpace = 'pre-wrap';
        preElement.style.wordWrap = 'break-word';
        preElement.style.fontFamily = 'monospace';
        preElement.style.margin = '0';
        
        // Join content from all resource items
        const resourceText = data.resource.contents
          .map((item: any) => item.text)
          .join('\n\n');
        
        preElement.textContent = resourceText;
        content.appendChild(preElement);
      } else {
        content.innerHTML = '<p>No content available for this resource</p>';
      }
    } catch (error) {
      console.error('Error fetching resource content:', error);
      alert('Error loading resource content');
    }
  };

  const viewMcpPromptDetails = (serverId: string, prompt: PromptInfo) => {
    // Create a modal dialog to display the prompt details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.zIndex = '10000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '700px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '15px';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#888';
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    const title = document.createElement('h3');
    title.textContent = `Prompt: ${prompt.name}`;
    title.style.marginTop = '0';
    
    const description = document.createElement('p');
    description.textContent = prompt.description || 'No description available';
    
    const argumentsTitle = document.createElement('h4');
    argumentsTitle.textContent = 'Arguments:';
    
    const argumentsList = document.createElement('ul');
    
    if (prompt.arguments && prompt.arguments.length > 0) {
      prompt.arguments.forEach(arg => {
        const argItem = document.createElement('li');
        argItem.innerHTML = `<strong>${arg.name}</strong>: ${arg.description || 'No description'} ${arg.required ? '(Required)' : '(Optional)'}`;
        argumentsList.appendChild(argItem);
      });
    } else {
      const noArgs = document.createElement('li');
      noArgs.textContent = 'No arguments';
      argumentsList.appendChild(noArgs);
    }
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(argumentsTitle);
    modalContent.appendChild(argumentsList);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
  };

  const submitMcpQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!queryInput.trim() || selectedServers.length === 0 || isLoading) {
      return;
    }
    
    setIsLoading(true);
    setQueryResults(null);
    setFullResponse(null);
    
    try {
      const response = await fetch(`${mcpApiUrl}/api/servers/multi/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serverIds: selectedServers, query: queryInput }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error submitting query:', data.error);
      } else {
        // Check if we have a full response from a sequential query
        if (data.fullResponse) {
          setFullResponse(data.fullResponse);
        } else {
          setQueryResults(data.results);
        }
      }
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize MCP Client when tab becomes active
  useEffect(() => {
    if (isMcpExpanded) {
      fetchMcpServers();
    }
  }, [isMcpExpanded]);

  // Auto-connect to servers on initialization
  useEffect(() => {
    const initializeMcp = async () => {
      try {
        const data = await fetchMcpServers();
        
        // Auto-connect to available servers
        if (data?.servers && data.servers.length > 0) {
          // If servers are available but none are connected, connect to the first one
          if (data.activeConnections.length === 0 && data.servers.length > 0) {
            await connectToMcpServer(data.servers[0].id);
          }
        }
      } catch (error) {
        console.error('Error initializing MCP servers:', error);
      }
    };
    
    initializeMcp();
  }, []);

  // Update tools when selected servers change
  useEffect(() => {
    if (isMcpExpanded && selectedServers.length > 0) {
      fetchMcpToolsForSelectedServers();
    }
  }, [selectedServers, isMcpExpanded]);

  // Load tools/prompts/resources when component server changes
  useEffect(() => {
    const loadDataForComponentServer = async () => {
      if (!componentMcpServer) return;
      
      // Set loading state
      setIsLoading(true);
      
      try {
        // Check if this server is already in selectedServers
        if (!selectedServers.includes(componentMcpServer)) {
          // Add to selectedServers to trigger the other useEffect
          setSelectedServers(prev => [...prev, componentMcpServer]);
        } else {
          // If already in selectedServers, manually load the data
          // Load tools
          try {
            const response = await fetch(`${mcpApiUrl}/api/servers/${componentMcpServer}/status`);
            const data = await response.json();
            
            if (data.connected && data.tools && data.tools.length > 0) {
              setMcpTools(prev => ({
                ...prev,
                [componentMcpServer]: data.tools
              }));
            } else if (data.connected) {
              // Create an empty array so we know it's loaded but empty
              setMcpTools(prev => ({
                ...prev,
                [componentMcpServer]: []
              }));
            }
          } catch (err) {
            console.error(`Error fetching tools for server ${componentMcpServer}:`, err);
            // Create an empty array to indicate loading is complete
            setMcpTools(prev => ({
              ...prev,
              [componentMcpServer]: []
            }));
          }
          
          // Load resources
          try {
            const response = await fetch(`${mcpApiUrl}/api/servers/${componentMcpServer}/resources`);
            const data = await response.json();
            
            if (data.resources && data.resources.length > 0) {
              setMcpResources(prev => ({
                ...prev,
                [componentMcpServer]: data.resources
              }));
            } else {
              // Create an empty array so we know it's loaded but empty
              setMcpResources(prev => ({
                ...prev,
                [componentMcpServer]: []
              }));
            }
          } catch (err) {
            console.log(`Server ${componentMcpServer} does not support resources:`, err);
            // Create an empty array to indicate loading is complete
            setMcpResources(prev => ({
              ...prev,
              [componentMcpServer]: []
            }));
          }
          
          // Load prompts
          try {
            const response = await fetch(`${mcpApiUrl}/api/servers/${componentMcpServer}/prompts`);
            const data = await response.json();
            
            if (data.prompts && data.prompts.length > 0) {
              setMcpPrompts(prev => ({
                ...prev,
                [componentMcpServer]: data.prompts
              }));
            } else {
              // Create an empty array so we know it's loaded but empty
              setMcpPrompts(prev => ({
                ...prev,
                [componentMcpServer]: []
              }));
            }
          } catch (err) {
            console.log(`Server ${componentMcpServer} does not support prompts:`, err);
            // Create an empty array to indicate loading is complete
            setMcpPrompts(prev => ({
              ...prev,
              [componentMcpServer]: []
            }));
          }
        }
      } catch (error) {
        console.error('Error loading data for component server:', error);
      } finally {
        // Clear loading state
        setIsLoading(false);
      }
    };
    
    loadDataForComponentServer();
  }, [componentMcpServer]);

  // Update renderMcpClientTab function with the full implementation
  const renderMcpClientTab = () => {
    return (
      <div className="p-4 overflow-auto max-h-[calc(100vh-200px)]">
        {/* Servers Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Server size={16} /> Available Servers
          </h3>
          
          {/* API URL Config */}
          <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400">
              <label htmlFor="mcpApiUrl">API URL:</label>
              <input 
                id="mcpApiUrl"
                type="text" 
                value={mcpApiUrl} 
                onChange={(e) => setMcpApiUrl(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-xs"
              />
              <button 
                onClick={fetchMcpServers} 
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {/* Servers List */}
          <div className="border rounded overflow-hidden">
            {isLoading && availableServers.length === 0 ? (
              createLoadingElement()
            ) : availableServers.length === 0 ? (
              <p className="text-center py-4 text-gray-500 text-sm">No servers configured</p>
            ) : (
              <div className="max-h-48 overflow-y-auto">
                {availableServers.map((server) => {
                  const isActive = activeServers.includes(server.id);
                  
                  return (
                    <div 
                      key={server.id} 
                      className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{server.name || server.id}</div>
                        <div className="text-xs text-gray-500">{server.description || `Server for ${server.id}`}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs">{isActive ? 'Connected' : 'Disconnected'}</span>
                        </div>
                        
                        <button
                          className={`text-xs px-2 py-1 rounded ${
                            isActive 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                          onClick={() => isActive ? disconnectFromMcpServer(server.id) : connectToMcpServer(server.id)}
                        >
                          {isActive ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Server Selection and Query Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Ask a Question</h3>
          
          {/* Server Checkboxes */}
          <div className="mb-4">
            <p className="text-xs mb-1">Select Server(s):</p>
            
            <div className="border rounded p-2 mb-2 max-h-32 overflow-y-auto">
              {activeServers.length === 0 ? (
                <p className="text-gray-500 text-xs">No servers connected</p>
              ) : (
                activeServers.map(serverId => {
                  const server = availableServers.find(s => s.id === serverId);
                  if (!server) return null;
                  
                  return (
                    <div key={serverId} className="flex items-center mb-1 last:mb-0">
                      <input 
                        type="checkbox" 
                        id={`server-${serverId}`} 
                        value={serverId}
                        checked={selectedServers.includes(serverId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServers(prev => [...prev, serverId]);
                          } else {
                            setSelectedServers(prev => prev.filter(id => id !== serverId));
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`server-${serverId}`} className="text-xs">
                        {server.name || serverId}
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Query Form */}
          <form onSubmit={submitMcpQuery} className="mb-4">
            <textarea 
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Type your query here..."
              className="w-full px-3 py-2 border rounded mb-2 text-sm"
              rows={3}
            />
            
            <button 
              type="submit" 
              disabled={selectedServers.length === 0 || !queryInput.trim() || isLoading}
              className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm flex items-center gap-1 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
            >
              <Send size={14} />
              Submit
            </button>
          </form>
        </div>
        
        {/* Tools Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Available Tools</h3>
          
          <div className="border rounded p-3 bg-gray-50 dark:bg-gray-800">
            {selectedServers.length === 0 ? (
              <p className="text-gray-500 text-sm">No server selected</p>
            ) : isLoading ? (
              createLoadingElement()
            ) : Object.keys(mcpTools).length === 0 ? (
              <p className="text-gray-500 text-sm">No tools available for selected servers</p>
            ) : (
              Object.entries(mcpTools).map(([serverId, tools]) => {
                const server = availableServers.find(s => s.id === serverId);
                return (
                  <div key={serverId} className="mb-3 last:mb-0">
                    <div className="font-medium text-xs mb-1 text-gray-600 dark:text-gray-400">
                      {server?.name || serverId}:
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {tools.map((tool, index) => (
                        <div 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded dark:bg-blue-900/30 dark:text-blue-300"
                          title={tool.description || 'No description available'}
                        >
                          {tool.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Resources Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Available Resources</h3>
          
          <div className="border rounded p-3 bg-gray-50 dark:bg-gray-800">
            {selectedServers.length === 0 ? (
              <p className="text-gray-500 text-sm">No server selected</p>
            ) : isLoading ? (
              createLoadingElement()
            ) : Object.keys(mcpResources).length === 0 ? (
              <p className="text-gray-500 text-sm">No resources available for selected servers</p>
            ) : (
              Object.entries(mcpResources).map(([serverId, resources]) => {
                const server = availableServers.find(s => s.id === serverId);
                return (
                  <div key={serverId} className="mb-3 last:mb-0">
                    <div className="font-medium text-xs mb-1 text-gray-600 dark:text-gray-400">
                      {server?.name || serverId}:
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {resources.map((resource, index) => (
                        <div 
                          key={index} 
                          className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded cursor-pointer hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300"
                          title={resource.description || 'No description available'}
                          onClick={() => viewMcpResourceContent(serverId, resource.uri)}
                        >
                          {resource.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Prompts Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Available Prompts</h3>
          
          <div className="border rounded p-3 bg-gray-50 dark:bg-gray-800">
            {selectedServers.length === 0 ? (
              <p className="text-gray-500 text-sm">No server selected</p>
            ) : isLoading ? (
              createLoadingElement()
            ) : Object.keys(mcpPrompts).length === 0 ? (
              <p className="text-gray-500 text-sm">No prompts available for selected servers</p>
            ) : (
              Object.entries(mcpPrompts).map(([serverId, prompts]) => {
                const server = availableServers.find(s => s.id === serverId);
                return (
                  <div key={serverId} className="mb-3 last:mb-0">
                    <div className="font-medium text-xs mb-1 text-gray-600 dark:text-gray-400">
                      {server?.name || serverId}:
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {prompts.map((prompt, index) => (
                        <div 
                          key={index} 
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded cursor-pointer hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                          title={prompt.description || 'No description available'}
                          onClick={() => viewMcpPromptDetails(serverId, prompt)}
                        >
                          {prompt.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Response Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Response</h3>
          
          <div className="border rounded overflow-hidden">
            {isLoading ? (
              createLoadingElement()
            ) : fullResponse ? (
              <div className="p-3 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <pre className="text-xs whitespace-pre-wrap">
                  {fullResponse}
                </pre>
              </div>
            ) : queryResults ? (
              <div className="max-h-64 overflow-y-auto">
                {queryResults.map((result, index) => {
                  const server = availableServers.find(s => s.id === result.serverId);
                  
                  return (
                    <div key={index} className="border-b last:border-b-0">
                      <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium">
                        {server?.name || result.serverId}
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-800">
                        {result.success ? (
                          <pre className="text-xs whitespace-pre-wrap">
                            {result.response}
                          </pre>
                        ) : (
                          <div className="text-red-500 text-xs">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500 text-sm">Submit a query to see results</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add custom styles for MCP client
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .loader {
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #3498db;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full">
      {children}
      
      {/* Inspector Overlay - Only displays indicators, no pointer events */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9000] pointer-events-none"
        style={{ cursor: inspectMode || isPickingElement ? 'crosshair' : 'auto' }}
      >
        {/* Element highlight */}
        <div 
          ref={highlightRef}
          className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-10 pointer-events-none z-10"
          style={{ display: 'none' }}
        ></div>
        
        {/* Floating position indicator */}
        <div 
          className="absolute bg-blue-500 text-white px-2 py-1 text-xs rounded shadow-md pointer-events-none z-20"
          style={{ 
            left: position.x + 10, 
            top: position.y + 10,
            display: (inspectMode || isPickingElement) && !selectedElement ? 'block' : 'none'
          }}
        >
          {isPickingElement ? 'Click an element to inspect' : 'Inspector Mode'} (Alt+Shift+C to toggle)
        </div>
        
        {/* Floating Action Button to toggle sidebar */}
        <div
          data-inspector-ui="true"
          className="fixed bottom-4 left-4 z-[9999] pointer-events-auto"
        >
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            title="Toggle Inspector Sidebar"
          >
            <PanelRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div 
        data-inspector-ui="true"
        className={cn(
          "fixed right-0 top-0 h-full bg-white dark:bg-gray-900 shadow-xl z-[9999] overflow-auto transition-all duration-300 w-1/3 max-w-md min-w-64",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Info size={20} /> Component Inspector
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInspectMode(prev => !prev)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              title={inspectMode ? "Switch to interaction mode" : "Switch to inspect mode"}
            >
              {inspectMode ? <MousePointer size={18} /> : <Hand size={18} />}
            </button>
            <button
              onClick={() => setShowBoundaries(prev => !prev)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              title={showBoundaries ? "Hide component boundaries" : "Show component boundaries"}
            >
              {showBoundaries ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Mode and Element Selection */}
        <div className="px-4 py-2 text-sm flex flex-col gap-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Mode:</span>
              <span className={cn(
                "font-medium px-2 py-0.5 rounded",
                inspectMode ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              )}>
                {inspectMode ? 'Inspect Elements' : 'Normal Interaction'}
              </span>
            </div>
            <button
              onClick={() => setInspectMode(prev => !prev)}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              Switch Mode
            </button>
          </div>
          
          <button
            onClick={startPickingElement}
            className="w-full mt-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center gap-2"
            disabled={isPickingElement}
          >
            <Maximize size={16} />
            {isPickingElement ? 'Picking Element...' : 'Pick Element'}
          </button>
        </div>
        
        {/* Inspector Content - Unified View */}
        <div className="overflow-auto">
          {/* No Element Selected Message */}
          {!selectedElement ? (
            <div className="p-8 text-center text-gray-500">
              <Maximize className="mx-auto mb-4" size={32} />
              <p>No element selected</p>
              <p className="text-sm mt-2">Click the "Pick Element" button above to select an element</p>
            </div>
          ) : (
            <>
              {/* Component Details Section */}
              <CollapsibleSection
                title="Component Details"
                icon={<Info size={16} />}
                isExpanded={isDetailsExpanded}
                onToggle={() => setIsDetailsExpanded(prev => !prev)}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Element Type</h3>
                    <p className="text-lg font-bold">{selectedElement.tagName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">React Component</h3>
                    <p className="text-lg font-bold">{selectedElement.reactName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Code size={16} /> Props
                    </h3>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-sm">
                      {JSON.stringify(selectedElement.props, null, 2)}
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Component Tree Section */}
              <CollapsibleSection
                title="Component Tree"
                icon={<Layers size={16} />}
                isExpanded={isTreeExpanded}
                onToggle={() => setIsTreeExpanded(prev => !prev)}
              >
                {componentTree ? (
                  <div className="border rounded">
                    {renderTreeNode(componentTree, 0)}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500 text-sm">
                    Component tree not available for this element
                  </p>
                )}
              </CollapsibleSection>

              {/* MCP Integration Section */}
              <CollapsibleSection
                title="MCP Integration"
                icon={<Server size={16} />}
                isExpanded={isMcpExpanded}
                onToggle={() => setIsMcpExpanded(prev => !prev)}
              >
                <div className="space-y-4">
                  {/* Server status message */}
                  {activeServers.length === 0 ? (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800/30">
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">No MCP servers connected</p>
                      <button
                        onClick={() => {
                          setShowMcpSettings(true);
                          fetchMcpServers();
                        }}
                        className="mt-2 text-xs px-3 py-1 bg-yellow-100 dark:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-700/30 text-yellow-800 dark:text-yellow-300 rounded"
                      >
                        Configure MCP
                      </button>
                    </div>
                  ) : null}

                  {/* MCP Settings Section (conditionally shown) */}
                  {showMcpSettings ? (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium">MCP Settings</h3>
                        <button
                          onClick={() => setShowMcpSettings(false)}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          Hide Settings
                        </button>
                      </div>
                      
                      {/* API URL Config */}
                      <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400">
                          <label htmlFor="mcpApiUrl">API URL:</label>
                          <input 
                            id="mcpApiUrl"
                            type="text" 
                            value={mcpApiUrl} 
                            onChange={(e) => setMcpApiUrl(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded text-xs"
                          />
                          <button 
                            onClick={fetchMcpServers} 
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs"
                          >
                            Refresh
                          </button>
                        </div>
                      </div>
                      
                      {/* Servers List */}
                      <div className="border rounded overflow-hidden mb-3">
                        <h4 className="text-xs font-medium p-2 bg-gray-50 dark:bg-gray-800">Available Servers</h4>
                        {isLoading && availableServers.length === 0 ? (
                          createLoadingElement()
                        ) : availableServers.length === 0 ? (
                          <p className="text-center py-4 text-gray-500 text-sm">No servers configured</p>
                        ) : (
                          <div className="max-h-48 overflow-y-auto">
                            {availableServers.map((server) => {
                              const isActive = activeServers.includes(server.id);
                              
                              return (
                                <div 
                                  key={server.id} 
                                  className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{server.name || server.id}</div>
                                    <div className="text-xs text-gray-500">{server.description || `Server for ${server.id}`}</div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="text-xs">{isActive ? 'Connected' : 'Disconnected'}</span>
                                    </div>
                                    
                                    <button
                                      className={`text-xs px-2 py-1 rounded ${
                                        isActive 
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' 
                                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                                      }`}
                                      onClick={() => isActive ? disconnectFromMcpServer(server.id) : connectToMcpServer(server.id)}
                                    >
                                      {isActive ? 'Disconnect' : 'Connect'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Server Selection for Component */}
                  <div>
                    <label htmlFor="mcp-server-select" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Select MCP Server:
                    </label>
                    <select
                      id="mcp-server-select"
                      value={componentMcpServer || ''}
                      onChange={(e) => {
                        setComponentMcpServer(e.target.value || null);
                        setComponentMcpItemType(null);
                        setComponentMcpItem(null);
                      }}
                      className="w-full p-2 text-sm bg-white dark:bg-gray-800 border rounded"
                      disabled={activeServers.length === 0}
                    >
                      <option value="">Choose a server...</option>
                      {activeServers.map(serverId => {
                        const server = availableServers.find(s => s.id === serverId);
                        return (
                          <option key={serverId} value={serverId}>
                            {server?.name || serverId}
                          </option>
                        );
                      })}
                    </select>
                    {activeServers.length === 0 && (
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                        No servers connected. Use the "Configure MCP" button above to connect.
                      </p>
                    )}
                  </div>
                  
                  {/* Item Type Selection */}
                  {componentMcpServer && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Item Type:
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setComponentMcpItemType('tool')}
                          className={`px-3 py-1.5 text-xs rounded ${
                            componentMcpItemType === 'tool'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Tools
                        </button>
                        <button
                          onClick={() => setComponentMcpItemType('prompt')}
                          className={`px-3 py-1.5 text-xs rounded ${
                            componentMcpItemType === 'prompt'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Prompts
                        </button>
                        <button
                          onClick={() => setComponentMcpItemType('resource')}
                          className={`px-3 py-1.5 text-xs rounded ${
                            componentMcpItemType === 'resource'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Resources
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Item Selection */}
                  {componentMcpServer && componentMcpItemType && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select {componentMcpItemType === 'tool' ? 'Tool' : componentMcpItemType === 'prompt' ? 'Prompt' : 'Resource'}:
                      </div>
                      <div className="p-2 border rounded bg-gray-50 dark:bg-gray-800 max-h-40 overflow-y-auto">
                        {isLoading ? (
                          createLoadingElement()
                        ) : componentMcpItemType === 'tool' ? (
                          mcpTools[componentMcpServer] ? (
                            mcpTools[componentMcpServer].length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {mcpTools[componentMcpServer].map((tool, index) => (
                                  <div
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded cursor-pointer ${
                                      componentMcpItem === tool
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}
                                    onClick={() => setComponentMcpItem(tool)}
                                    title={tool.description || 'No description available'}
                                  >
                                    {tool.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-xs">No tools available for this server</p>
                            )
                          ) : (
                            <p className="text-gray-500 text-xs">Select a server with tools</p>
                          )
                        ) : componentMcpItemType === 'prompt' ? (
                          mcpPrompts[componentMcpServer] ? (
                            mcpPrompts[componentMcpServer].length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {mcpPrompts[componentMcpServer].map((prompt, index) => (
                                  <div
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded cursor-pointer ${
                                      componentMcpItem === prompt
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                                    }`}
                                    onClick={() => setComponentMcpItem(prompt)}
                                    title={prompt.description || 'No description available'}
                                  >
                                    {prompt.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-xs">No prompts available for this server</p>
                            )
                          ) : (
                            <p className="text-gray-500 text-xs">Select a server with prompts</p>
                          )
                        ) : componentMcpItemType === 'resource' ? (
                          mcpResources[componentMcpServer] ? (
                            mcpResources[componentMcpServer].length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {mcpResources[componentMcpServer].map((resource, index) => (
                                  <div
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded cursor-pointer ${
                                      componentMcpItem === resource
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300'
                                    }`}
                                    onClick={() => setComponentMcpItem(resource)}
                                    title={resource.description || 'No description available'}
                                  >
                                    {resource.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-xs">No resources available for this server</p>
                            )
                          ) : (
                            <p className="text-gray-500 text-xs">Select a server with resources</p>
                          )
                        ) : (
                          <p className="text-gray-500 text-xs">Select an item type first</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Selected Item Details and Action */}
                  {componentMcpItem && (
                    <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800">
                      <h4 className="text-sm font-medium mb-2">Selected {componentMcpItemType}:</h4>
                      <div className="mb-2">
                        <span className="text-xs font-medium">Name:</span> 
                        <span className="text-xs ml-1">{componentMcpItem.name}</span>
                      </div>
                      {componentMcpItem.description && (
                        <div className="mb-2">
                          <span className="text-xs font-medium">Description:</span> 
                          <span className="text-xs ml-1">{componentMcpItem.description}</span>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs flex items-center gap-1 hover:bg-blue-600"
                          onClick={() => {
                            // This would be implemented to actually use the selected item with the component
                            alert(`Would use ${componentMcpItemType} "${componentMcpItem.name}" with component "${selectedElement.reactName}"`);
                          }}
                        >
                          <Send size={12} />
                          Use with Component
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            </>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 text-sm text-gray-500">
          Alt+Shift+C: toggle inspector | Alt+Shift+S: toggle sidebar | Alt+Shift+M: MCP
        </div>
      </div>
    </div>
  );
}
  