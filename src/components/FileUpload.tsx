import { useState, useCallback } from 'react';
import { UploadCloud, FileJson, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type Report } from '@/lib/types';

interface FileUploadProps {
  onUpload: (report: Report) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const json = JSON.parse(content);
        if (typeof json !== 'object' || json === null) {
          throw new Error('Invalid JSON format');
        }
        onUpload(json as Report);
      } catch (err) {
        setError('Failed to parse JSON. Please check the file format.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Best Practices Report</h1>
          <p className="text-muted-foreground">Upload your analysis report to view insights.</p>
        </div>

        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group relative overflow-hidden",
            isDragging
              ? "border-primary bg-primary/5 ring-4 ring-primary/10"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30",
            error ? "border-destructive/50 bg-destructive/5" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
            <div className={cn(
              "p-4 rounded-full transition-colors duration-300",
              isDragging ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
              error ? "bg-destructive/10 text-destructive" : ""
            )}>
              {error ? <AlertCircle className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>
            
            <div className="space-y-1">
              <p className="font-medium">
                {error ? <span className="text-destructive">{error}</span> : "Drop your report.json here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
          </CardContent>
          
          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileInput}
          />
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileJson className="w-3 h-3" />
          <span>Compatible with Vercel React Best Practices</span>
        </div>
      </div>
    </div>
  );
}
