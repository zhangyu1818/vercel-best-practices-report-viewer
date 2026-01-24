import { type FileReport } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';

interface FileDetailProps {
  file: FileReport;
}

export function FileDetail({ file }: FileDetailProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return "bg-destructive/10 text-destructive border-destructive/20";
      case 'warning': return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case 'info': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-green-500/10 text-green-600 border-green-500/20";
    }
  };

  // Sort violations by line number
  const sortedViolations = [...file.violations].sort((a, b) => a.line - b.line);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight break-all">{file.filePath}</h2>
          <p className="text-muted-foreground">
            {file.violations.length} violation{file.violations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {file.score !== undefined && (
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">File Score</span>
            <span className={`text-2xl font-bold ${
              file.score >= 90 ? "text-green-500" : file.score >= 70 ? "text-yellow-500" : "text-destructive"
            }`}>
              {file.score}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Violations List */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
          <h3 className="font-semibold">Violations</h3>
          <ScrollArea className="h-[600px] lg:h-auto border rounded-md bg-muted/50 p-4">
            <div className="space-y-4">
              {sortedViolations.map((violation, idx) => (
                <Card key={idx} className="border-l-4 border-l-transparent hover:border-l-primary transition-all">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className={getSeverityColor(violation.severity)}>
                        {violation.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        Line {violation.line}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-medium mt-2 leading-tight">
                      {violation.rule}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground">{violation.message}</p>
                    {violation.fix && (
                      <div className="mt-3 p-2 bg-muted rounded text-xs font-mono break-all">
                        <span className="text-green-600 font-bold">Fix: </span>
                        {violation.fix}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Code View */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
           <h3 className="font-semibold">Source Code</h3>
           <Card className="flex-1 min-h-0 overflow-hidden bg-[#0d1117] border-zinc-800">
             <ScrollArea className="h-[600px] lg:h-full w-full">
               <div className="p-4 font-mono text-sm">
                 {file.source ? (
                   <table className="w-full border-collapse text-zinc-400">
                     <tbody>
                       {file.source.split('\n').map((line, i) => {
                         const lineNum = i + 1;
                         const violation = file.violations.find(v => v.line === lineNum);
                         return (
                           <tr 
                            key={i} 
                            className={`${violation ? 'bg-red-500/10' : ''} hover:bg-zinc-800/50 transition-colors`}
                           >
                             <td className="w-12 text-right pr-4 text-zinc-600 select-none border-r border-zinc-800 mr-4">
                               {lineNum}
                             </td>
                             <td className="pl-4 whitespace-pre-wrap break-all relative">
                               {line}
                               {violation && (
                                 <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                                   <AlertCircle className="w-4 h-4 text-red-500 opacity-50" />
                                 </div>
                               )}
                             </td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                 ) : (
                   <div className="text-center text-zinc-500 py-12">
                     Source code not available in report
                   </div>
                 )}
               </div>
             </ScrollArea>
           </Card>
        </div>
      </div>
    </div>
  );
}
