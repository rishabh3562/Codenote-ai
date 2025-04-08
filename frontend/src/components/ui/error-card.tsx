import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = 'Something went wrong',
  description = 'There was an error loading the data. Please try again.',
  onRetry,
}: ErrorCardProps) {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-center">{description}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
