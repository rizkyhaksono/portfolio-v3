import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Language, TestDuration } from "./wpm-test";

interface TestSettingsProps {
  language: Language;
  duration: TestDuration;
  onLanguageChange: (language: Language) => void;
  onDurationChange: (duration: TestDuration) => void;
  onClose: () => void;
}

export default function TestSettings({
  language,
  duration,
  onLanguageChange,
  onDurationChange,
  onClose
}: Readonly<TestSettingsProps>) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Duration</Label>
          <RadioGroup
            value={duration.toString()}
            onValueChange={(value) => onDurationChange(parseInt(value) as TestDuration)}
            className="mt-2"
          >
            {[15, 30, 60, 120].map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <RadioGroupItem value={time.toString()} id={`duration-${time}`} />
                <Label htmlFor={`duration-${time}`}>{time} seconds</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium">Language</Label>
          <RadioGroup
            value={language}
            onValueChange={(value) => onLanguageChange(value as Language)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="lang-en" />
              <Label htmlFor="lang-en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="id" id="lang-id" />
              <Label htmlFor="lang-id">Indonesian</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={onClose} className="w-full">
          Apply Settings
        </Button>
      </CardContent>
    </Card>
  );
}