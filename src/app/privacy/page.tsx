import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalPage } from "@/components/LegalPage";
import { legal } from "@/data/site";
import { siteOpenGraph } from "@/lib/site";

// Written for the pre-launch site: no analytics, no tracking cookies, newsletter
// sign-ups not yet collected. Update it when any of that changes.
export const metadata: Metadata = {
  title: "Privacy policy",
  alternates: { canonical: "/privacy" },
  openGraph: { ...siteOpenGraph, url: "/privacy" },
  description: "How Easytive collects, uses and protects personal data on easytive.com.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains what personal data Easytive collects when you use easytive.com, why we collect it and the choices
        you have. It is written to comply with India&apos;s Digital Personal Data Protection Act, 2023 and the Information
        Technology Act, 2000 and its rules.
      </p>

      <h2>1. Who we are</h2>
      <p>
        easytive.com is operated by {legal.company} (&quot;Easytive&quot;, &quot;we&quot;, &quot;us&quot;), {legal.address}. We
        are the data fiduciary for the personal data described here.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li>
          <strong>Newsletter.</strong> If you sign up for The Easy Letter, we collect your email address. While the site is in
          preview, the sign-up form does not send or store anything.
        </li>
        <li>
          <strong>WhatsApp messages.</strong> If you contact us through the WhatsApp button, we receive your phone number, your
          WhatsApp profile name and the messages you send.
        </li>
        <li>
          <strong>Technical data.</strong> Our hosting provider records standard server logs, such as your IP address, browser
          type, the pages you request and the time of the request. These are used to keep the site secure and working.
        </li>
      </ul>
      <p>
        We do not use analytics, advertising or tracking tools, and the public site sets no cookies. The staff-only admin area
        uses one essential sign-in cookie.
      </p>

      <h2>3. Health information</h2>
      <p>
        The website does not ask for health information. If you choose to share details about your health with us on WhatsApp,
        we use them only to reply to you. Easytive does not provide medical advice. Please speak to your doctor about any
        medical concern.
      </p>

      <h2>4. How we use your data</h2>
      <ul>
        <li>To send The Easy Letter, if you signed up.</li>
        <li>To answer your questions and messages.</li>
        <li>To run, secure and improve the website, and to prevent misuse.</li>
        <li>To meet our legal obligations.</li>
      </ul>
      <p>We process your data on the basis of your consent, or where the law otherwise permits it.</p>

      <h2>5. Who we share it with</h2>
      <p>We do not sell or rent your personal data. We share it only with:</p>
      <ul>
        <li>Service providers that run the site for us: Vercel (hosting) and Supabase (database and file storage).</li>
        <li>WhatsApp (Meta), when you choose to message us there. WhatsApp&apos;s own privacy policy applies to that chat.</li>
        <li>Authorities, where the law requires it.</li>
      </ul>

      <h2>6. Where your data is stored</h2>
      <p>
        Our service providers may store and process data outside India, including in Australia and other countries where they
        operate. We take reasonable steps to make sure your data is protected wherever it is processed.
      </p>

      <h2>7. How long we keep it</h2>
      <p>
        We keep your email address until you unsubscribe, and messages for as long as we need them to help you. Server logs are
        kept for a limited period by our hosting provider. We then delete or anonymise the data, unless the law requires us to
        keep it longer.
      </p>

      <h2>8. Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>tell you what personal data we hold about you and how we use it;</li>
        <li>correct, complete or update it;</li>
        <li>delete it;</li>
        <li>stop using it, by withdrawing your consent (for example, by unsubscribing);</li>
        <li>nominate someone to exercise these rights on your behalf.</li>
      </ul>
      <p>
        To make a request, email us at the address below. If you are not satisfied with our response, you can complain to the
        Data Protection Board of India.
      </p>

      <h2>9. Children</h2>
      <p>
        This website is not intended for anyone under 18. We do not knowingly collect personal data from children. If you
        believe a child has shared data with us, please contact us and we will delete it.
      </p>

      <h2>10. Security</h2>
      <p>
        We use reasonable security measures, including encrypted connections (HTTPS) and restricted access to our systems. No
        method of transmission or storage is completely secure, but we work to protect your data.
      </p>

      <h2>11. Links to other sites</h2>
      <p>
        Our site links to WhatsApp, Instagram, Facebook, X and LinkedIn. Those services have their own privacy policies, and we
        are not responsible for how they handle your data.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy, for example when we launch our shop or start collecting newsletter sign-ups. The date at the
        top shows when it last changed. See also our <Link href="/terms">terms and conditions</Link>.
      </p>

      <h2>13. Contact and Grievance Officer</h2>
      <p>
        For questions, requests or complaints about your personal data, contact our Grievance Officer, {legal.grievanceOfficer}
        . We will acknowledge your complaint and aim to resolve it within 30 days.
      </p>
      <LegalContact />
    </LegalPage>
  );
}
