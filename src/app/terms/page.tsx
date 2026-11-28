import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalPage } from "@/components/LegalPage";
import { legal } from "@/data/site";
import { siteOpenGraph } from "@/lib/site";

// Terms for the pre-launch site (no sales yet). Add terms of sale, shipping and
// refunds when the shop launches.
export const metadata: Metadata = {
  title: "Terms and conditions",
  alternates: { canonical: "/terms" },
  openGraph: { ...siteOpenGraph, url: "/terms" },
  description: "The terms that apply when you use easytive.com.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and conditions">
      <p>
        These terms apply to your use of easytive.com, operated by {legal.company} (&quot;Easytive&quot;, &quot;we&quot;,
        &quot;us&quot;). By using the site, you agree to them. If you do not agree, please do not use the site.
      </p>

      <h2>1. About this website</h2>
      <p>
        Easytive is preparing to launch. The site currently shares information about our brand and articles on urinary
        health. Products are not sold through the site yet. When they are, separate terms of sale, shipping and refunds will
        apply to orders.
      </p>

      <h2>2. Not medical advice</h2>
      <p>
        Everything on this site, including The Easy Journal, is for general information only. It is not medical advice and
        does not replace a consultation with a doctor or other qualified healthcare professional. Do not ignore or delay
        seeking medical advice because of something you read here. In a medical emergency, contact your doctor or local
        emergency services straight away.
      </p>

      <h2>3. Our products</h2>
      <p>
        Easytive products are dietary supplements. They are not intended to diagnose, treat, cure or prevent any disease.
        Statements about them have not been evaluated by any regulatory authority, and results vary from person to person.
        Consult your doctor before use if you are pregnant, nursing, on medication or have a medical condition.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        The Easytive name and logo, and all text, images, videos and design on this site, belong to Easytive or its licensors.
        You may view and share pages for personal, non-commercial use. You may not copy, republish or use our content or brand
        for any other purpose without our written permission.
      </p>

      <h2>5. Using the site</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the site for anything unlawful or misleading;</li>
        <li>try to gain unauthorised access to the site, its admin area or our systems;</li>
        <li>interfere with the site&apos;s operation, for example with automated scraping or excessive requests;</li>
        <li>copy our content to present it as your own or as coming from Easytive.</li>
      </ul>

      <h2>6. Other websites and services</h2>
      <p>
        The site links to services we do not control, such as WhatsApp, Instagram, Facebook, X and LinkedIn. Their own terms
        apply when you use them, and we are not responsible for their content or practices.
      </p>

      <h2>7. Accuracy and availability</h2>
      <p>
        We work to keep the information on this site accurate and up to date, but we do not guarantee that it is complete or
        error-free. The site is provided &quot;as is&quot;, and we may change, suspend or remove any part of it at any time.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent permitted by law, Easytive is not liable for any loss or damage arising from your use of the site or
        your reliance on its content. Nothing in these terms limits any rights you have under Indian consumer protection law.
      </p>

      <h2>9. Privacy</h2>
      <p>
        Our <Link href="/privacy">privacy policy</Link> explains how we handle your personal data.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top shows when they last changed. Continuing to use the
        site after a change means you accept the updated terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute will be subject to the exclusive jurisdiction of the courts
        in {legal.jurisdiction}.
      </p>

      <h2>12. Contact</h2>
      <LegalContact />
    </LegalPage>
  );
}
