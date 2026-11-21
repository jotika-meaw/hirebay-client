// Static marketing content (01 decision 8: no reviews endpoint).
// Copy is verbatim from design/source/Main.dc.html.

export const ratingSummary = {
  avg: 4.8,
  count: "2,140",
  label: "verified reviews",
};

export const reviews = [
  {
    name: "Nusrat Jahan",
    role: "Event planner · Dhaka",
    rating: 5,
    item: "PA system",
    quote:
      "Booked a line-array rig for a 600-guest reception. Delivery was on time and the owner even helped with the sound check.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Site engineer · Gazipur",
    rating: 5,
    item: "excavator",
    quote:
      "We saved almost a lakh compared with buying. The availability check meant no surprises on the start date.",
  },
  {
    name: "Farhan Kabir",
    role: "Filmmaker · Chattogram",
    rating: 4,
    item: "cinema rig",
    quote: "Every battery charged. Stripe checkout took less than a minute.",
  },
  {
    name: "Sadia Islam",
    role: "Farm owner · Rajshahi",
    rating: 5,
    item: "tractor",
    quote:
      "Monthly rental during harvest season made far more sense than a loan. Clear terms, honest owner, and the trailer was in better shape than ours.",
  },
  {
    name: "Arif Hossain",
    role: "Photographer · Sylhet",
    rating: 5,
    item: "drone",
    quote:
      "Favorited three drones, compared specs and booked the Mavic in two clicks.",
  },
  {
    name: "Mehedi Hasan",
    role: "Contractor · Khulna",
    rating: 4,
    item: "cargo van",
    quote:
      "Weekly van rental for a renovation job. The dashboard showed every payment and status.",
  },
];

export const faqs = [
  {
    q: "How is the rental total calculated?",
    a: "Rate × billable periods × quantity — per day, per started week or per started 30 days. You see it before you pay.",
  },
  {
    q: "Is my payment secure?",
    a: "Payments run through Stripe Checkout. Hirebay never stores card details; the transaction ID is saved once Stripe confirms.",
  },
  {
    q: "How do owners get approved?",
    a: "Owners submit photos, specs and terms. Listings stay Pending until an admin approves them.",
  },
  {
    q: "What if it’s already booked?",
    a: "Availability is checked against paid bookings for your exact dates before checkout.",
  },
  {
    q: "What happens when my rental ends?",
    a: "A scheduled job marks the booking Completed after the end date for both you and the owner.",
  },
];

export const howItWorks = [
  {
    no: "01",
    title: "Browse & compare",
    text: "Search by name or location; filter by category, rental type, price and availability.",
  },
  {
    no: "02",
    title: "Pick your dates",
    text: "Choose dates and quantity. The total and availability are checked instantly.",
  },
  {
    no: "03",
    title: "Pay with Stripe",
    text: "Secure Stripe Checkout confirms the booking and saves the transaction.",
  },
  {
    no: "04",
    title: "Delivered to site",
    text: "Gear arrives at your address; after the end date the rental closes itself.",
  },
];

export const trustedOwners = [
  "Karim Heavy Machinery",
  "LensBox BD",
  "Utsab Events",
  "PowerHub Comilla",
  "Rahim Traders",
  "AgroRent Rajshahi",
  "DriveLine Logistics",
  "SoundCraft BD",
];
