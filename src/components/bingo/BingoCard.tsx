import { Card } from "@/components/ui/card";

interface BingoCardProps {
  title: string;
  showTitle: boolean;
  includeFreeSpace: boolean;
  bingoContent: string[];
}

export const BingoCard = ({ title, showTitle, includeFreeSpace, bingoContent }: BingoCardProps) => {
  return (
    <Card className="p-8 bg-[#F7C052]">
      <div className="aspect-square">
        {showTitle && (
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        )}
        <div className="grid grid-cols-5 gap-4 h-full">
          {Array.from({ length: 25 }).map((_, index) => {
            const isCenter = index === 12;
            const content = isCenter && includeFreeSpace ? "FREE" : bingoContent[isCenter ? index - 1 : index] || "";
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg flex items-center justify-center p-2 text-center text-sm border-2 border-gray-200"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};