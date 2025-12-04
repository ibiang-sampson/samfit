export interface Trainer {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}