
import { PageBlock, newBlock } from "./page-blocks";

/**
 * Extracts default block data from built-in pages to provide a starting point in the admin dashboard.
 * Since parsing JSX is complex, we use hardcoded snapshots of the main sections.
 */
export function getBuiltInBlocks(slug: string): PageBlock[] {
  switch (slug) {
    case 'about':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'Established 2024',
          title: 'Oriva Jewels',
          text: 'We are end-to-end manufacturers of Diamonds & Jewellery. A modern maison where heritage meets innovation, crafted for the discerning.'
        },
        {
          id: 'philosophy',
          type: 'image_text',
          eyebrow: 'Our Legacy',
          title: 'The Birth of Conscious Brilliance',
          text: 'Oriva Jewels was founded with a singular, visionary purpose: to redefine the landscape of fine jewelry by harmonizing absolute luxury with uncompromising ethical responsibility.',
          image: '/src/assets/insta-6.jpg',
          reverse: false
        },
        {
          id: 'atelier',
          type: 'heading',
          eyebrow: 'Craftsmanship',
          title: 'The Atelier',
          text: 'Every stone chosen. Every piece finished by hand.'
        },
        {
          id: 'journey',
          type: 'heading',
          eyebrow: 'The Journey',
          title: 'From a sketch to her finger.',
          text: 'Unlike traditional jewellers, we manage the entire lifecycle of our pieces. By sourcing rough diamonds directly and manufacturing in our own facility.'
        }
      ];
    
    case 'assurance':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'Maison Assurance',
          title: 'The Oriva promise.',
          text: 'Our vision is to become a global leader in conscious fine jewelry, proving that the world\'s most magnificent designs can be crafted responsibly.'
        },
        {
          id: 'advantage',
          type: 'heading',
          title: 'The Oriva Advantage',
          text: 'Operating our own state-of-the-art facilities ensures absolute quality control at every stage of production.'
        },
        {
          id: 'expertise',
          type: 'heading',
          title: 'Our Core Expertise',
          text: 'Creating masterfully grown, fully certified lab diamonds that mirror the flawless brilliance of nature.'
        }
      ];
    
    case 'bespoke':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'Bespoke Commission',
          title: 'Commission an heirloom.',
          text: 'One piece. One person. One moment. A private diamond commission, made entirely by hand in our atelier.'
        },
        {
          id: 'steps',
          type: 'heading',
          eyebrow: 'The Journey',
          title: 'Three chapters.',
          text: 'The Conversation, The Design, The Making. A private commissioning journey.'
        }
      ];

    case 'occasions':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'Shop by Occasion',
          title: 'The moments worth marking.',
          text: 'Every Oriva piece is made for a life. Our guide to the moments our clients return to most.'
        }
      ];

    case 'education':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'The Diamond Guide',
          title: 'The Four Cs.',
          text: 'A quiet primer on how we choose the stones that leave our atelier - and how you might choose one for yourself.'
        }
      ];

    case 'ring-size-guide':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'Client Services',
          title: 'Ring size, in 30 seconds.',
          text: 'A quiet method to size your finger at home - or send us an existing ring and we\'ll size it for you. Full international conversion below.'
        }
      ];
      
    case 'contact':
      return [
        {
          id: 'hero',
          type: 'heading',
          eyebrow: 'Correspondence',
          title: 'A private conversation, at your convenience.',
          text: 'Our atelier is available worldwide. Every enquiry receives a personal reply, typically within a few hours.'
        }
      ];

    case 'home':
      return []; // Return empty so CustomPageWrapper correctly falls back to hardcoded index.tsx layout

    default:
      return [newBlock("heading"), newBlock("paragraph")];
  }
}
