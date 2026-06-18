import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { siteConfig } from '@/lib/constants';
import { Mail, Youtube, Github, Instagram, Facebook, MapPin, Send } from 'lucide-react';

const FORMSPREE_FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with me. I'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Get in Touch"
        description="I'd love to hear from you. Whether it's a question, collaboration idea, or just to say hi."
      />

      <section className="pb-12 md:pb-16">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card padding="lg">
                <h2 className="mb-6 text-xl font-semibold text-[var(--color-text)]">Send a Message</h2>
                {FORMSPREE_FORM_ID ? (
                  <form
                    action={`https://formspree.io/f/${FORMSPREE_FORM_ID}`}
                    method="POST"
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      required
                    />

                    <Textarea
                      label="Message"
                      name="message"
                      placeholder="Your message..."
                      rows={6}
                      required
                    />

                    <Button type="submit" size="lg" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-[var(--radius-card)] border border-[var(--color-yellow)]/30 bg-[var(--color-yellow-light)] p-4">
                    <p className="font-medium text-[var(--color-yellow)]">Contact form not configured</p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      To enable the contact form, add your Formspree form ID to the environment
                      variable{' '}
                      <code className="rounded-[var(--radius-sm)] bg-[var(--color-bg-secondary)] px-1 py-0.5">
                        NEXT_PUBLIC_FORMSPREE_FORM_ID
                      </code>
                      .<br />
                      Create a form at{' '}
                      <a
                        href="https://formspree.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-turquoise)] hover:underline"
                      >
                        formspree.io
                      </a>
                    </p>
                    <div className="mt-4">
                      <a
                        href={siteConfig.links.email}
                        className="text-[var(--color-turquoise)] hover:text-[var(--color-turquoise-hover)] inline-flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {siteConfig.links.email.replace('mailto:', '')}
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <h3 className="mb-4 font-semibold text-[var(--color-text)]">Email</h3>
                <a
                  href={siteConfig.links.email}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-pink)] flex items-center gap-3 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  {siteConfig.links.email.replace('mailto:', '')}
                </a>
              </Card>

              <Card>
                <h3 className="mb-4 font-semibold text-[var(--color-text)]">Location</h3>
                <div className="text-[var(--color-text-muted)] flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  {siteConfig.location}
                </div>
              </Card>

              <Card>
                <h3 className="mb-4 font-semibold text-[var(--color-text)]">Connect</h3>
                <div className="space-y-3">
                  {siteConfig.links.youtube && (
                    <a
                      href={siteConfig.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors"
                    >
                      <Youtube className="h-5 w-5 text-[var(--color-pink)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">YouTube</p>
                        <p className="text-xs text-[var(--color-text-muted)]">@joshua_argent</p>
                      </div>
                    </a>
                  )}

                  {siteConfig.links.github && (
                    <a
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors"
                    >
                      <Github className="h-5 w-5 text-[var(--color-text)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">GitHub</p>
                        <p className="text-xs text-[var(--color-text-muted)]">@joshuaargent</p>
                      </div>
                    </a>
                  )}

                  {siteConfig.links.instagram && (
                    <a
                      href={siteConfig.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-[var(--color-pink)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">Instagram</p>
                        <p className="text-xs text-[var(--color-text-muted)]">@joshua_argent</p>
                      </div>
                    </a>
                  )}

                  {siteConfig.links.facebook && (
                    <a
                      href={siteConfig.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 rounded-[var(--radius-md)] p-2 transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-[var(--color-turquoise)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">Facebook</p>
                        <p className="text-xs text-[var(--color-text-muted)]">@joshua_argent</p>
                      </div>
                    </a>
                  )}
                </div>
              </Card>

              <Card className="bg-[var(--color-turquoise-light)]">
                <h3 className="mb-2 font-semibold text-[var(--color-text)]">Response Time</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  I typically respond within 24-48 hours. For urgent matters, reach out via
                  Instagram DM.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
