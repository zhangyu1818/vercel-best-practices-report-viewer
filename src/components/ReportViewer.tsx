import { useMemo } from "react";
import { type Report, type RuleViolation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileCode, AlertCircle, CheckCircle } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

interface ReportViewerProps {
  report: Report;
  onBack?: () => void;
  isDark: boolean;
}

interface FlattenedViolation extends RuleViolation {
  filePath: string;
  fileName: string;
}

export function ReportViewer({ report, isDark }: ReportViewerProps) {
  const allViolations = useMemo(() => {
    // Sort files by violation count (descending) first, then alphabetical
    const sortedEntries = Object.entries(report).sort((a, b) => {
      const countDiff = b[1].length - a[1].length;
      if (countDiff !== 0) return countDiff;
      return a[0].localeCompare(b[0]);
    });

    // Flatten into a single list of violations
    return sortedEntries.flatMap(([filePath, violations]) =>
      violations.map((violation) => ({
        ...violation,
        filePath,
        fileName: filePath.split("/").pop() || filePath,
      })),
    );
  }, [report]);

  if (allViolations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground p-8 border rounded-lg bg-muted/10">
        <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full mb-4">
          <FileCode className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Violations Found
        </h3>
        <p>Great job! Your code adheres to all checked best practices.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Violation Report
          </h2>
          <p className="text-muted-foreground mt-2">
            Found {allViolations.length} issues across{" "}
            {Object.keys(report).length} files
          </p>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        {allViolations.map((violation, idx) => (
          <ViolationCard
            key={`${violation.filePath}-${idx}`}
            violation={violation}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}

function ViolationCard({
  violation,
  isDark,
}: {
  violation: FlattenedViolation;
  isDark: boolean;
}) {
  return (
    <Card className="overflow-hidden border transition-all">
      <CardHeader className="bg-muted/10 py-4 px-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-background rounded-md border">
              <FileCode className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="font-semibold text-base truncate"
                title={violation.filePath}
              >
                {violation.fileName}
              </span>
              <span className="text-xs text-muted-foreground truncate font-mono">
                {violation.filePath}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge variant="outline" className="font-mono px-3 py-1">
              Line {violation.lineNumber}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Rule: {violation.rule}
          </h3>
        </div>

        <div className="grid gap-6">
          {/* Problem Section */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 px-1">
              <AlertCircle className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-wide">
                Original Code
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-red-200 dark:border-red-900/40 flex-grow">
              <CodeBlock
                code={violation.lineContent.trim()}
                lang="tsx"
                isDark={isDark}
                className={`h-full text-[0.9rem] [&>pre]:!p-6 ${
                  isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]"
                }`}
              />
            </div>
          </div>

          {/* Solution Section */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 px-1">
              <CheckCircle className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-wide">
                Suggested Fix
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-green-200 dark:border-green-900/40 flex-grow">
              <CodeBlock
                code={violation.suggestion.trim()}
                lang="tsx"
                isDark={isDark}
                className={`h-full text-[0.9rem] [&>pre]:!p-6 ${
                  isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]"
                }`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
