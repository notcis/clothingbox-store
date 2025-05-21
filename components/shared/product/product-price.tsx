import { cn, formatNumber } from "@/lib/utils";

export default function ProductPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const stringValue = value.toFixed(2);

  const [inValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">฿</span>
      {formatNumber(Number(inValue))}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}
