import { Bot, Brain, Cloud, Code2, Compass, Crown, Palette, ShieldCheck, ShoppingCart, Smartphone, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/site";

const map: Record<Service["icon"], LucideIcon> = {
  code: Code2,
  cloud: Cloud,
  brain: Brain,
  palette: Palette,
  shield: ShieldCheck,
  compass: Compass,
  phone: Smartphone,
  cart: ShoppingCart,
  trend: TrendingUp,
  bot: Bot,
  workflow: Workflow,
  crown: Crown,
};

export function ServiceIcon({ name, className }: { name: Service["icon"]; className?: string }) {
  const Icon = map[name];
  return <Icon className={className} aria-hidden />;
}
