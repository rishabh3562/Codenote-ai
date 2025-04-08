import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { File, Folder } from 'lucide-react';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  size?: string;
  lastModified?: string;
  path?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const renderNode = (node: FileNode, path: string = '') => {
    const currentPath = `${path}/${node.name}`;
    const nodeWithPath = { ...node, path: currentPath };

    if (node.type === 'file') {
      return (
        <div
          key={currentPath}
          className="flex items-center py-2 px-4 hover:bg-accent cursor-pointer"
          onClick={() => onFileSelect(nodeWithPath)}
        >
          <File className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="flex-1 truncate">{node.name}</span>
          {node.size && (
            <span className="text-sm text-muted-foreground ml-2">
              {node.size}
            </span>
          )}
        </div>
      );
    }

    return (
      <AccordionItem key={currentPath} value={currentPath}>
        <AccordionTrigger className="py-2 px-4">
          <div className="flex items-center">
            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="truncate">{node.name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {node.children?.map((child) => renderNode(child, currentPath))}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Accordion type="multiple" className="w-full">
      {files.map((file) => renderNode(file))}
    </Accordion>
  );
}
