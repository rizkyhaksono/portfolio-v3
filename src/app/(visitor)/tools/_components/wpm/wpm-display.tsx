import { Card, CardContent } from "@/components/ui/card";

interface WPMTextDisplayProps {
  targetText: string;
  userInput: string;
}

export default function WPMTextDisplay({ targetText, userInput }: Readonly<WPMTextDisplayProps>) {
  const renderCharacter = (char: string, index: number) => {
    let className = "text-lg";

    if (index < userInput.length) {
      if (userInput[index] === char) {
        className += " bg-green-200 text-green-800";
      } else {
        className += " bg-red-200 text-red-800";
      }
    } else if (index === userInput.length) {
      className += " bg-blue-200 text-blue-800 animate-pulse";
    } else {
      className += " text-gray-600";
    }

    return (
      <span key={index} className={className}>
        {char === " " ? "\u00A0" : char}
      </span>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="font-mono leading-relaxed text-justify break-words">
          {targetText.split("").map((char, index) => renderCharacter(char, index))}
        </div>
      </CardContent>
    </Card>
  );
}