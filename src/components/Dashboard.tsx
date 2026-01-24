import { useMemo } from 'react';
import { type Report } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  report: Report;
}

export function Dashboard({ report }: DashboardProps) {
  const stats = useMemo(() => {
    const files = Object.keys(report);
    const totalFiles = files.length;
    const totalViolations = files.reduce((acc, file) => acc + report[file].length, 0);
    const healthScore = Math.max(0, 100 - (totalViolations * 2));
    
    // Calculate files with 0 violations
    const cleanFiles = files.filter(file => report[file].length === 0).length;

    return {
      totalFiles,
      totalViolations,
      healthScore,
      cleanFiles
    };
  }, [report]);

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card className="py-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          <Activity className={cn(
            "h-4 w-4",
            stats.healthScore >= 90 ? "text-green-500" : stats.healthScore >= 70 ? "text-yellow-500" : "text-red-500"
          )} />
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div className="text-lg font-bold">{stats.healthScore}</div>
          <p className="text-xs text-muted-foreground">
            Based on violation count
          </p>
        </CardContent>
      </Card>

      <Card className="py-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div className="text-lg font-bold">{stats.totalFiles}</div>
          <p className="text-xs text-muted-foreground">
            Analyzed source files
          </p>
        </CardContent>
      </Card>

      <Card className="py-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
          <AlertTriangle className={cn(
            "h-4 w-4",
            stats.totalViolations === 0 ? "text-green-500" : "text-red-500"
          )} />
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div className="text-lg font-bold">{stats.totalViolations}</div>
          <p className="text-xs text-muted-foreground">
            Issues detected
          </p>
        </CardContent>
      </Card>

      <Card className="py-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="text-sm font-medium">Clean Files</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div className="text-lg font-bold">{stats.cleanFiles}</div>
          <p className="text-xs text-muted-foreground">
            Files with no issues
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for conditional classes since we don't import cn inside the function scope usually, 
// but I'll import it at the top.
import { cn } from '@/lib/utils';
