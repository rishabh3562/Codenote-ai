import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FileNode } from './file-explorer';
import { File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileSelectionProps {
  files: FileNode[];
  selectedFiles: Set<string>;
  onFileSelect: (path: string) => void;
}

export function FileSelection({ files, selectedFiles, onFileSelect }: FileSelectionProps) {
  const renderNode = (node: FileNode, path: string = '') => {
    const currentPath = `${path}/${node.name}`;

    if (node.type === 'file') {
      return (
        <div
          key={currentPath}
          className="flex items-center py-2 px-4 hover:bg-accent/50 transition-colors"
        >
          <Checkbox
            id={currentPath}
            checked={selectedFiles.has(currentPath)}
            onCheckedChange={() => onFileSelect(currentPath)}
            className="mr-2"
          />
          <label
            htmlFor={currentPath}
            className="flex items-center flex-1 cursor-pointer"
          >
            <File className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="flex-1 truncate">{node.name}</span>
            {node.size && (
              <span className="text-sm text-muted-foreground ml-2">{node.size}</span>
            )}
          </label>
        </div>
      );
    }

    return (
      <div key={currentPath}>
        <div className="flex items-center py-2 px-4">
          <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{node.name}</span>
        </div>
        <div className="ml-4 border-l">
          {node.children?.map((child) => renderNode(child, currentPath))}
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg">
      {files.map((file) => renderNode(file))}
    </div>
  );
}