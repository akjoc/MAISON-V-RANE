export interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'Orders' | 'Care' | 'Services' | 'Maison'
}

/** Mock content for the demonstration prototype. */
export const faqs: FaqItem[] = [
  {
    id: 'demo',
    category: 'Orders',
    question: 'Is anything on this website actually for sale?',
    answer:
      'No. MAISON VÉRANE is a fictional maison built as a design prototype. Every product, price, boutique, service and confirmation in this experience is simulated. No payment is taken and no order is placed.',
  },
  {
    id: 'shipping',
    category: 'Orders',
    question: 'How would delivery work for a real order?',
    answer:
      'In this prototype, checkout is a demonstration only. As a documented placeholder, the maison would offer insured delivery, signature on receipt and a 30-day return window from the date of delivery.',
  },
  {
    id: 'straps',
    category: 'Care',
    question: 'Can I change the strap myself?',
    answer:
      'Yes. The Aéroform uses a tool-free quick-release system with a guarded lever, so straps can be exchanged without affecting water resistance. The strap archive holds six references.',
  },
  {
    id: 'service',
    category: 'Care',
    question: 'How often should a mechanical watch be serviced?',
    answer:
      'A mechanical calibre is generally serviced every five to seven years, or sooner if the rate drifts or the watch is exposed to water. The prototype service form does not transmit data.',
  },
  {
    id: 'water',
    category: 'Care',
    question: 'Can I swim with an Aéroform?',
    answer:
      'The 40 and 42 mm models are rated to 10 bar (100 m) and are suitable for swimming. The Skeleton Édition is rated to 5 bar and should not be submerged. Screw the crown down before contact with water.',
  },
  {
    id: 'appointments',
    category: 'Services',
    question: 'How do appointments work?',
    answer:
      'Choose a fictional salon, a service and a time. The confirmation you see is generated locally in your browser; nothing is sent to a real boutique or calendar.',
  },
  {
    id: 'personalisation',
    category: 'Services',
    question: 'What can be personalised?',
    answer:
      'In this prototype: caseback engraving, strap selection and a choice of dial direction. The configurator runs entirely in your browser and saves locally.',
  },
  {
    id: 'warranty',
    category: 'Maison',
    question: 'What warranty is offered?',
    answer:
      'As clearly identified mock content, the fictional maison describes a five-year international warranty covering defects in materials and workmanship, excluding wear, accidental damage and water ingress through an open crown.',
  },
  {
    id: 'fictional',
    category: 'Maison',
    question: 'Are the boutiques real?',
    answer:
      'No. The boutique finder lists eight fictional locations with illustrative addresses, marked as such. There is no real store to visit.',
  },
  {
    id: 'account',
    category: 'Orders',
    question: 'Does the demo account store my details?',
    answer:
      'Authentication is simulated entirely in the browser. The demo account does not check credentials and does not transmit anything. Your session is stored only in local storage on this device.',
  },
]
