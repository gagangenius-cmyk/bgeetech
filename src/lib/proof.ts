// Real client proof. Add ONLY genuine, permitted testimonials and case studies here: they appear on the home page
// automatically. Nothing is invented, so while these lists are empty the site shows "try it yourself" proof instead.

export type Testimonial = { quote: string; name: string; role: string; company?: string; url?: string };
export type CaseStudy = { title: string; client: string; challenge: string; result: string; href?: string; metrics?: { label: string; value: string }[] };

export const testimonials: Testimonial[] = [];
export const caseStudies: CaseStudy[] = [];
