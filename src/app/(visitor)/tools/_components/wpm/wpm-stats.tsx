import { Card, CardContent } from "@/components/ui/card";
import type { WPMStats } from "./wpm-test";

interface WPMStatsProps {
  stats: WPMStats;
  timeLeft: number;
}

export default function WPMStats({ stats, timeLeft }: Readonly<WPMStatsProps>) {
  return (
    <div className="flex justify-center mb-6">
      <Card className="w-fit">
        <CardContent className="p-4">
          <div className="flex items-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">{stats.errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}