import { Bot, Brain, Bug, Database, Globe, Receipt, Users, Cloud, Code2, Compass, Crown, Palette, ShieldCheck, ShoppingCart, Smartphone, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import type { ServiceIcon as IconName } from "@/lib/site";

const map: Record<IconName, LucideIcon> = {
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
  globe: Globe,
  database: Database,
  bug: Bug,
  users: Users,
  receipt: Receipt,
};

export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = map[name];
  return <Icon className={className} aria-hidden />;
}
