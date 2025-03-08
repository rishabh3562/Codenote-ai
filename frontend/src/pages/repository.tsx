import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileExplorer, type FileNode } from '@/components/repository/file-explorer';
import { FileSelection } from '@/components/repository/file-selection';
import { FileInsights } from '@/components/repository/file-insights';
import { AIAnalysisModal } from '@/components/repository/ai-analysis-modal';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_FILES: FileNode[] = [
  {
    name: 'src',
    type: 'directory',
    children: [
      {
        name: 'components',
        type: 'directory',
        children: [
          {
            name: 'Button.tsx',
            type: 'file',
            size: '2.4 KB',
            lastModified: '2024-02-20',
          },
          {
            name: 'Navbar.tsx',
            type: 'file',
            size: '1.8 KB',
            lastModified: '2024-02-19',
          },
        ],
      },
      {
        name: 'App.tsx',
        type: 'file',
        size: '3.2 KB',
        lastModified: '2024-02-21',
      },
    ],
  },
  {
    name: 'package.json',
    type: 'file',
    size: '1.1 KB',
    lastModified: '2024-02-18',
  },
];

const DUMMY_DOCS = `
# Button Component

A reusable button component that supports various styles and states.

## Usage

\`\`\`tsx
import { Button } from './components/Button';

function App() {
  return (
    <Button variant="primary" onClick={() => console.log('Clicked!')}>
      Click me
    </Button>
  );
}
\`\`\`

## Props

- \`variant\`: 'primary' | 'secondary' | 'outline'
- \`size\`: 'sm' | 'md' | 'lg'
- \`disabled\`: boolean
`;

interface AIFunction {
  name: string;
  description: string;
  props: string[];
  returns: string;
}

interface AIFileInsight {
  name: string;
  functions: AIFunction[];
}

const DUMMY_AI_INSIGHTS: AIFileInsight[] = [
  {
    name: 'Button.tsx',
    functions: [
      {
        name: 'Button',
        description: 'A polymorphic button component that supports various styles and states',
        props: ['variant', 'size', 'disabled', 'children'],
        returns: 'ReactElement',
      },
    ],
  },
  {
    name: 'Navbar.tsx',
    functions: [
      {
        name: 'Navbar',
        description: 'Main navigation component with responsive design',
        props: ['links', 'user'],
        returns: 'ReactElement',
      },
    ],
  },
];

export function RepositoryPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const handleFileSelect = (path: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowAnalysisModal(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Repository Details: {id}</h1>

      <Tabs defaultValue="files" className="w-full">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="insights">File Insights</TabsTrigger>
          <TabsTrigger value="ai">AI Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <FileSelection
                files={DUMMY_FILES}
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
              />
              <AnimatePresence>
                {selectedFiles.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4"
                  >
                    <Button
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Selected Files
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-2 border rounded-lg p-4">
              {selectedFile ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selectedFile, null, 2)}
                </pre>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a file to view its contents
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{DUMMY_DOCS}</ReactMarkdown>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border rounded-lg">
              <FileExplorer
                files={DUMMY_FILES}
                onFileSelect={setSelectedFile}
              />
            </div>
            <div className="lg:col-span-2">
              <FileInsights file={selectedFile} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="space-y-6">
            {DUMMY_AI_INSIGHTS.map((file) => (
              <div key={file.name} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">{file.name}</h3>
                {file.functions.map((fn) => (
                  <div key={fn.name} className="mb-4">
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {fn.name}({fn.props.join(', ')}) → {fn.returns}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {fn.description}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AIAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        selectedFiles={Array.from(selectedFiles).map((path) => ({ name: path, type: 'file' }))}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}