
import { Program, Service, Trainer, Testimonial, PricingPlan } from './types';
import { Dumbbell, HeartPulse, Trophy, Users, Clock, Zap, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1920",
    alt: "Trainer helping client"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1920",
    alt: "Weight lifting"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=1920",
    alt: "Running track"
  }
];

export const FACILITY_GALLERY = [
  {
    id: 1,
    title: "Main Weight Room",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Cardio Zone",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Yoga Studio",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Functional Training Area",
    image: "https://images.unsplash.com/photo-1517963879466-e9b5ce3825bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Boxing Ring",
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Locker Rooms",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&q=80&w=800"
  }
];

export const TRANSFORMATION_GALLERY = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    caption: "PUSH LIMITS"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800",
    caption: "EXPERT GUIDANCE"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    caption: "COMMUNITY ENERGY"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    caption: "MIND & BODY"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800",
    caption: "HIGH INTENSITY"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    caption: "STRENGTH"
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 1,
    title: "Strength Training",
    description: "Build raw power and muscle definition with our expert-led weightlifting sessions.",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Cardio & HIIT",
    description: "Burn fat and improve endurance with high-intensity interval training.",
    image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Yoga & Mobility",
    description: "Restore balance, flexibility, and mental focus in our serene studio.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Crossfit",
    description: "Functional movements performed at high intensity for total body conditioning.",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600"
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 1,
    name: "Marcus Johnson",
    role: "Head Strength Coach",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    name: "Alisha Williams",
    role: "Yoga & Mobility Specialist",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    name: "David Okafor",
    role: "HIIT & Cardio Expert",
    image: "https://images.unsplash.com/photo-1561532325-7d5231a2dede?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    role: "CrossFit Coach",
    image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Boxing Instructor",
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 6,
    name: "Sophie Chen",
    role: "Nutritionist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Member since 2021",
    text: "Jedafit changed my life. The trainers are incredibly supportive and the community is unmatched.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Athlete",
    text: "The equipment is top-tier and the facility is always clean. Highly recommend the strength program.",
    rating: 5
  },
  {
    id: 3,
    name: "Jessica Davis",
    role: "Yoga Enthusiast",
    text: "I love the morning yoga classes. It's the perfect way to start my day with energy and focus.",
    rating: 4
  },
  {
    id: 4,
    name: "Robert Fox",
    role: "Bodybuilder",
    text: "The free weights section is massive. I've never had to wait for a squat rack. Serious gym for serious gains.",
    rating: 5
  },
  {
    id: 5,
    name: "Emily Carter",
    role: "Weight Loss Journey",
    text: "I was intimidated at first, but the community here is so welcoming. Down 30lbs and feeling stronger than ever!",
    rating: 5
  }
];

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Personal Training",
    description: "One-on-one coaching tailored to your specific goals and fitness level.",
    icon: "Dumbbell"
  },
  {
    id: 2,
    title: "Weight Loss Program",
    description: "Comprehensive nutrition and exercise plans designed for sustainable weight loss.",
    icon: "HeartPulse"
  },
  {
    id: 3,
    title: "Cardio & HIIT",
    description: "Heart-pumping sessions to boost stamina and burn calories fast.",
    icon: "Zap"
  },
  {
    id: 4,
    title: "Yoga Classes",
    description: "Find your flow with Vinyasa, Hatha, and restorative yoga sessions.",
    icon: "Users"
  },
  {
    id: 5,
    title: "Crossfit",
    description: "Community-driven high-intensity functional training.",
    icon: "Trophy"
  },
  {
    id: 6,
    title: "Strength & Conditioning",
    description: "Sport-specific training to improve athletic performance.",
    icon: "Dumbbell"
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 1,
    name: "Basic",
    price: "$29",
    features: ["Gym Access", "Locker Room Access", "1 Intro Session", "Free WiFi"]
  },
  {
    id: 2,
    name: "Standard",
    price: "$59",
    features: ["All Basic Features", "Group Classes Included", "Guest Pass (1/mo)", "Nutrition Guide"],
    isPopular: true
  },
  {
    id: 3,
    name: "Premium",
    price: "$99",
    features: ["All Standard Features", "Unlimited Guest Passes", "Sauna & Spa Access", "Monthly Body Scan"]
  },
  {
    id: 4,
    name: "VIP",
    price: "$199",
    features: ["All Premium Features", "4 Personal Training Sessions", "Private Locker", "Laundry Service"]
  }
];

export const PRICING_FAQS = [
  {
    question: "Can I cancel my membership at any time?",
    answer: "Yes, we offer flexible month-to-month contracts. You can cancel up to 24 hours before your next billing cycle with no hidden fees."
  },
  {
    question: "What is included in the guest pass?",
    answer: "Guest passes allow you to bring a friend to workout with you. They get full access to the gym floor and locker rooms. Premium and VIP plans include unlimited guest passes."
  },
  {
    question: "Do you offer personal training packages?",
    answer: "Yes! Our VIP plan includes 4 sessions per month. We also offer separate personal training packages that can be added to any membership level."
  },
  {
    question: "Is the gym open on holidays?",
    answer: "Jedafit is open 24/7, 365 days a year, so you never have to miss a workout, even on holidays."
  },
  {
    question: "Can I freeze my membership if I go on vacation?",
    answer: "Absolutely. You can freeze your membership for up to 3 months per year for a small maintenance fee."
  }
];

export const BOOKING_FAQS = [
  {
    question: "Do I need to be a member to book a class?",
    answer: "While membership guarantees access and better rates, we do offer drop-in passes for non-members for select classes."
  },
  {
    question: "What if I need to cancel my booking?",
    answer: "You can cancel up to 4 hours before the session starts without penalty. Late cancellations may incur a small fee or forfeit a session credit."
  },
  {
    question: "What should I bring to my session?",
    answer: "Please bring a water bottle, a towel, and comfortable workout attire. For specific classes like Yoga or Boxing, you may bring your own mat or gloves, though we have rentals available."
  },
  {
    question: "How far in advance can I book?",
    answer: "Sessions can be booked up to 14 days in advance. Popular slots fill up quickly, so we recommend booking as early as possible."
  },
  {
    question: "Is the gym open on holidays?",
    answer: "Yes! If a class is full, join the waitlist. If a spot opens up, you'll be automatically enrolled and notified via email."
  }
];

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Bookings', path: '/bookings' },
  { name: 'Contact', path: '/contact' },
];
