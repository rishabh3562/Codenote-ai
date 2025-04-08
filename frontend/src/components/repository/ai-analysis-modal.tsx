import React from 'react';
import { FileNode } from './file-explorer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Code2, GitBranch, Shield } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles: FileNode[];
  isAnalyzing: boolean;
}

export function AIAnalysisModal({
  isOpen,
  onClose,
  selectedFiles,
  isAnalyzing,
}: AIAnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>AI Analysis Results</DialogTitle>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Code Quality</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The code follows good practices but could benefit from better
                  error handling and type safety improvements.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Architecture</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Component structure is well-organized. Consider implementing
                  the repository pattern for better data management.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Security</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  No major security issues found. Implement input validation for
                  user-provided data.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Suggestions</h3>
                </div>
                <ul className="text-sm text-muted-foreground list-disc pl-4">
                  <li>Add comprehensive error handling</li>
                  <li>Implement proper TypeScript types</li>
                  <li>Consider adding unit tests</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Code Improvements</h3>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                {`// Suggested improvements for selected files:

1. Add proper error handling:
try {
  await processData();
} catch (error) {
  handleError(error);
  notifyUser();
}

2. Implement TypeScript types:
interface ProcessOptions {
  validate: boolean;
  retry: number;
}

3. Add loading states:
const [isLoading, setIsLoading] = useState(false);`}
              </pre>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Save Analysis
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
