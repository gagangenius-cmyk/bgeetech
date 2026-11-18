import type { AvatarSpec } from "@/components/team-avatar";

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  avatar: AvatarSpec;
};

// Bios describe each role in general terms. Add real credentials, experience and photos when you have them.
export const team: TeamMember[] = [
  {
    slug: "karan",
    name: "Karan",
    role: "Founder",
    bio: "Started BGeetech to give teams direct access to experienced practitioners, without long contracts or sales cycles.",
    skills: ["Vision and strategy", "Technology advisory", "Partnerships"],
    avatar: { skin: "#d9a07a", hair: "#1c1917", hairStyle: "quiff", shirt: "#1e3a8a", bg: ["#1e3a8a", "#d4a017"], beard: true },
  },
  {
    slug: "bharti",
    name: "Bharti",
    role: "CEO",
    bio: "Leads the company's direction, operations and client relationships, and keeps the whole team focused on results.",
    skills: ["Leadership", "Operations", "Client relationships"],
    avatar: { skin: "#e8b793", hair: "#241713", hairStyle: "long", shirt: "#4338ca", bg: ["#312e81", "#6366f1"], feminine: true },
  },
  {
    slug: "anooj-dhawan",
    name: "Anooj Dhawan",
    role: "Senior Team Leader",
    bio: "Leads project delivery, keeps every engagement on schedule and makes sure clients always know what happens next.",
    skills: ["Project leadership", "Client success", "Delivery planning"],
    avatar: { skin: "#e0ac86", hair: "#1f2937", hairStyle: "short", shirt: "#1d4ed8", bg: ["#1e3a8a", "#3b82f6"] },
  },
  {
    slug: "vikas-sharma",
    name: "Vikas Sharma",
    role: "Digital Content Writer",
    bio: "Turns ideas into clear, engaging content: website copy, articles and campaigns that explain the value of what we build.",
    skills: ["Website copy", "Blog articles", "Content strategy"],
    avatar: { skin: "#c68863", hair: "#2b1d18", hairStyle: "crop", shirt: "#0f766e", bg: ["#0b3a5b", "#2f7dd1"], glasses: true, mustache: true },
  },
  {
    slug: "anu-lamba",
    name: "Anu Lamba",
    role: "SEO Specialist",
    bio: "Helps websites get found: technical SEO, keyword research and content structure that earn qualified search traffic.",
    skills: ["Technical SEO", "Keyword research", "Analytics"],
    avatar: { skin: "#f0c4a0", hair: "#3a2a22", hairStyle: "short", shirt: "#6d28d9", bg: ["#0f2a6b", "#4f8bff"], beard: true },
  },
  {
    slug: "akshma",
    name: "Akshma",
    role: "Digital Branding Manager",
    bio: "Shapes how brands look and sound online, from visual identity to consistent messaging across every channel.",
    skills: ["Brand identity", "Social media", "Visual design"],
    avatar: { skin: "#d49a73", hair: "#201815", hairStyle: "bun", shirt: "#b45309", bg: ["#1e3a8a", "#d4a017"], feminine: true },
  },
];
