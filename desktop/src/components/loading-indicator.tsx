import { cn } from "@/lib/utils";
import "./css/loading-indicator.css";

type LoadingIndicatorProps = {
  readonly className?: string;
};

export default function LoadingIndicator({ className }: LoadingIndicatorProps) {
  return (
    <div className={cn("dot-spinner size-6", className)}>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
}
