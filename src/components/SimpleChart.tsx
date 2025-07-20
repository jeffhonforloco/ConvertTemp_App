import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  description?: string;
}

export function SimpleBarChart({ data, title, description }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-sm font-medium">{item.name}</div>
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface LineData {
  date: string;
  count: number;
}

interface SimpleLineChartProps {
  data: LineData[];
  title: string;
  description?: string;
}

export function SimpleLineChart({ data, title, description }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.count));
  const minValue = Math.min(...data.map(d => d.count));
  const range = maxValue - minValue || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const height = ((item.count - minValue) / range) * 200 + 20; // Min 20px height
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-muted-foreground mb-1">{item.count}</div>
                <div 
                  className="w-full bg-primary rounded-t transition-all duration-500 ease-out min-h-[4px]"
                  style={{ height: `${height}px` }}
                />
                <div className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}