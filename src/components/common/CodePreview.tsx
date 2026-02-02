import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  language: string;
  fileName?: string;
  className?: string;
  maxHeight?: string;
}

export function CodePreview({
  code,
  language,
  fileName,
  className,
  maxHeight = '400px',
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `generated.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('rounded-lg border border-border bg-code overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
          {fileName && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-xs font-mono text-muted-foreground">{fileName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className="ml-1 text-xs">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            <Download size={14} />
            <span className="ml-1 text-xs">Download</span>
          </Button>
        </div>
      </div>
      <pre
        className="p-4 overflow-auto scrollbar-thin font-mono text-sm text-code-foreground"
        style={{ maxHeight }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default CodePreview;
