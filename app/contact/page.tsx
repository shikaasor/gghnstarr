import { Container } from '@/components/layout/Container';
import ContactForm from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact & Engagement | GGHN STARR',
  description:
    'Get in touch with the GGHN STARR initiative for partnerships, media inquiries, policy brief requests, or technical questions.',
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-white pt-16 pb-8">
        <Container className="max-w-2xl">
          <h1 className="font-serif text-3xl font-bold text-navy-950 mb-4">
            We&apos;d love to hear from you
          </h1>
          <p className="text-slate-600 text-lg">
            Whether you&apos;re a health ministry exploring partnership opportunities, a journalist covering AMR
            policy, or a researcher interested in our methodology. Reach out. We respond to every message.
          </p>
        </Container>
      </section>
      <section className="py-10 bg-slate-50">
        <Container className="max-w-2xl">
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
