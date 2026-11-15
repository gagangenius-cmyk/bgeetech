export type Kind = "services" | "booking" | "shop";

export type Industry = {
  id: string;
  label: string;
  group: string;
  kind: Kind;
  cta: string;
  services: string[];
};

type Group = { name: string; kind: Kind; cta: string; items: string[] };

// Compact source: "id|Label|service one;service two;service three"
const groups: Group[] = [
  {
    name: "Home & local services",
    kind: "services",
    cta: "Book an appointment",
    items: [
      "barber|Barber shop|Haircuts;Beard trims;Hot towel shave",
      "hair-salon|Hair salon|Cut & style;Colour;Treatments",
      "beauty-spa|Beauty & spa|Facials;Massage;Manicure",
      "nail-studio|Nail studio|Manicure;Pedicure;Nail art",
      "carpenter|Carpenter|Custom furniture;Repairs;Fitted wardrobes",
      "plumber|Plumber|Leak repair;Installations;Emergency callout",
      "electrician|Electrician|Wiring;Lighting;Safety checks",
      "painter|Painter & decorator|Interior painting;Exterior painting;Wallpapering",
      "cleaning|Cleaning service|Home cleaning;Office cleaning;Deep clean",
      "landscaping|Landscaping & gardening|Lawn care;Garden design;Tree trimming",
      "pest-control|Pest control|Inspection;Treatment;Prevention plans",
      "auto-repair|Auto repair garage|Servicing;Diagnostics;Tyres & brakes",
      "car-wash|Car wash & detailing|Exterior wash;Interior valet;Ceramic coating",
      "laundry|Laundry & dry cleaning|Wash & fold;Dry cleaning;Pickup & delivery",
      "tailor|Tailor & alterations|Custom suits;Alterations;Repairs",
      "locksmith|Locksmith|Lockouts;Lock changes;Key cutting",
      "movers|Movers & packers|Local moves;Packing;Storage",
      "hvac|AC & HVAC|Installation;Servicing;Repairs",
      "roofing|Roofing contractor|Roof repair;Replacement;Inspections",
      "handyman|Handyman|Odd jobs;Assembly;Maintenance",
    ],
  },
  {
    name: "Food & hospitality",
    kind: "services",
    cta: "Reserve a table",
    items: [
      "restaurant|Restaurant|Dine in;Takeaway;Private dining",
      "cafe|Cafe & coffee shop|Coffee;Brunch;Pastries",
      "bakery|Bakery|Fresh bread;Custom cakes;Pastries",
      "catering|Catering|Weddings;Corporate events;Party platters",
      "food-truck|Food truck|Street food menu;Event booking;Locations",
      "cloud-kitchen|Cloud kitchen|Online menu;Delivery;Meal plans",
      "bar-lounge|Bar & lounge|Cocktails;Live music;Private hire",
      "hotel|Hotel & guest house|Rooms;Dining;Events",
    ],
  },
  {
    name: "Health & wellness",
    kind: "services",
    cta: "Book a visit",
    items: [
      "clinic|Medical clinic|General care;Check-ups;Specialists",
      "dental|Dental clinic|Check-ups;Whitening;Orthodontics",
      "physio|Physiotherapy|Assessment;Rehabilitation;Sports injury",
      "gym|Gym & fitness|Memberships;Personal training;Classes",
      "yoga|Yoga & meditation|Group classes;Private sessions;Retreats",
      "pharmacy|Pharmacy|Prescriptions;Wellness products;Home delivery",
      "veterinary|Veterinary clinic|Check-ups;Vaccinations;Surgery",
      "optician|Optician|Eye tests;Frames;Contact lenses",
      "mental-health|Counselling & therapy|Individual therapy;Couples;Online sessions",
      "ayurveda|Ayurveda & holistic|Consultations;Therapies;Herbal products",
    ],
  },
  {
    name: "Education",
    kind: "services",
    cta: "Enrol today",
    items: [
      "school|School|Admissions;Curriculum;Activities",
      "tutoring|Tutoring centre|Maths & science;Exam prep;One-to-one",
      "coaching|Coaching institute|Courses;Batches;Results",
      "language|Language school|Beginner;Conversation;Certification",
      "driving-school|Driving school|Lessons;Test prep;Packages",
      "daycare|Daycare & preschool|Programs;Safety;Parent portal",
      "online-courses|Online courses|Course library;Live classes;Certificates",
    ],
  },
  {
    name: "Professional services",
    kind: "services",
    cta: "Get a free consultation",
    items: [
      "law|Law firm|Consultations;Litigation;Documentation",
      "accounting|Accounting & tax|Bookkeeping;Tax filing;Payroll",
      "consulting|Business consulting|Strategy;Operations;Training",
      "real-estate|Real estate agent|Buy;Sell;Rent",
      "insurance|Insurance agency|Life;Health;Motor",
      "immigration|Immigration consultant|Visa assessment;Applications;Support",
      "architect|Architect & design|Planning;3D visuals;Supervision",
      "interior|Interior designer|Concepts;Furnishing;Turnkey projects",
      "recruitment|Recruitment agency|Hiring;Staffing;Executive search",
      "marketing|Marketing agency|SEO;Social media;Advertising",
      "it-services|IT services|Support;Cloud;Security",
    ],
  },
  {
    name: "Retail & e-commerce",
    kind: "shop",
    cta: "Shop now",
    items: [
      "online-store|Online store|New arrivals;Best sellers;Offers",
      "fashion|Fashion & clothing|Women;Men;Accessories",
      "jewellery|Jewellery|Rings;Necklaces;Custom orders",
      "electronics|Electronics|Phones;Laptops;Accessories",
      "grocery|Grocery & supermarket|Fresh produce;Pantry;Home delivery",
      "furniture|Furniture store|Living room;Bedroom;Office",
      "bookstore|Bookstore|New releases;Bestsellers;Gift cards",
      "florist|Florist|Bouquets;Events;Subscriptions",
      "pet-shop|Pet shop|Food;Toys;Grooming",
      "handmade|Handmade & crafts|Gifts;Home decor;Custom orders",
    ],
  },
  {
    name: "Travel & booking engines",
    kind: "booking",
    cta: "Search now",
    items: [
      "flight-booking|Flight booking engine|Search flights;Manage booking;Offers",
      "hotel-booking|Hotel booking engine|Search stays;Deals;Loyalty",
      "bus-booking|Bus ticket booking|Routes;Seat selection;E-tickets",
      "train-booking|Train & rail booking|Timetables;Seats;Passes",
      "car-rental|Car rental|Economy;SUV;Chauffeur",
      "cab-booking|Cab & taxi booking|Airport transfers;City rides;Corporate",
      "tour-operator|Tour operator|Holiday packages;Day tours;Group trips",
      "travel-agency|Travel agency|Flights & hotels;Visas;Insurance",
      "vacation-rentals|Vacation rentals|Villas;Apartments;Long stays",
      "event-tickets|Event ticketing|Concerts;Sports;Conferences",
    ],
  },
  {
    name: "Events & creative",
    kind: "services",
    cta: "Request a quote",
    items: [
      "wedding-planner|Wedding planner|Planning;Decor;Coordination",
      "event-management|Event management|Corporate;Private;Exhibitions",
      "photographer|Photographer|Portraits;Weddings;Commercial",
      "videographer|Videographer|Events;Promos;Editing",
      "dj-music|DJ & live music|Weddings;Clubs;Private parties",
      "art-gallery|Art gallery & studio|Exhibitions;Commissions;Workshops",
      "event-venue|Event venue|Halls;Outdoor;Packages",
    ],
  },
  {
    name: "Tech & online",
    kind: "services",
    cta: "Get started",
    items: [
      "saas|SaaS product|Features;Pricing;Integrations",
      "mobile-app|Mobile app showcase|Features;Screenshots;Download",
      "portfolio|Personal portfolio|Projects;Skills;Contact",
      "blog|Blog & magazine|Latest posts;Categories;Newsletter",
      "marketplace|Online marketplace|Browse;Sell;Safe payments",
      "directory|Business directory|Listings;Categories;Reviews",
      "job-board|Job board|Search jobs;Employers;Alerts",
    ],
  },
  {
    name: "Community & other",
    kind: "services",
    cta: "Get involved",
    items: [
      "ngo|NGO & charity|Our mission;Projects;Donate",
      "place-of-worship|Temple, church or mosque|Services;Events;Donations",
      "club|Club & association|Membership;Events;News",
      "sports-club|Sports club & academy|Training;Fixtures;Registration",
      "government|Public service|Information;Forms;Contact",
      "other|Something else|Our services;About us;Contact",
    ],
  },
];

export const industries: Industry[] = groups.flatMap((g) =>
  g.items.map((row) => {
    const [id, label, svc] = row.split("|");
    return { id, label, group: g.name, kind: g.kind, cta: g.cta, services: svc.split(";") };
  }),
);

export const industryGroups = groups.map((g) => g.name);
export const getIndustry = (id: string | null) => industries.find((i) => i.id === id);
