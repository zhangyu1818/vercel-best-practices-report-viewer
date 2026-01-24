import { useState, useEffect } from 'react';
import { type Report } from '@/lib/types';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';
import { ReportViewer } from '@/components/ReportViewer';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ShieldCheck, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function App() {
  const [report, setReport] = useState<Report | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkStored = localStorage.getItem('theme') === 'dark';
    return isDarkSystem || isDarkStored;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };

  const handleUpload = (data: Report) => {
    setReport(data);
  };

  const reset = () => {
    setReport(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <div className="bg-foreground text-background p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden sm:block">
              Vercel Best Practices <span className="text-muted-foreground font-normal">Report</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {report && (
              <Button variant="outline" size="sm" onClick={reset} className="gap-2 h-9">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Load New</span>
              </Button>
            )}
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-9 h-9">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!report ? (
          <FileUpload onUpload={handleUpload} />
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Dashboard report={report} />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Detailed Analysis</h2>
              </div>
              <ReportViewer report={report} isDark={isDark} />
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with React 19, Tailwind CSS & shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
