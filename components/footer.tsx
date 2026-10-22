import Link from "next/link";
import { Brand } from "./ui";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand light />
            <p>
              Care in every school journey.
              <br />
              Connection along the way.
            </p>
          </div>
          <div>
            <h2>Families & schools</h2>
            <Link href="/parents">For parents</Link>
            <Link href="/schools">For schools</Link>
            <Link href="/safety">Our approach to safety</Link>
          </div>
          <div>
            <h2>Get to know TroTro</h2>
            <Link href="/about">Our story</Link>
            <Link href="/contact">Get in touch</Link>
            <Link href="/download">Get the app</Link>
          </div>
          <div className="footer-invitation">
            <h2>A question about the ride?</h2>
            <p>We’re here to help with the next step.</p>
            <a href="mailto:trotrotransit@gmail.com">trotrotransit@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TroTro. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
          </div>
        </div>
        <p className="footer-disclosure">
          Transportation availability depends on your school and service area.
          Downloading the app does not guarantee a ride. Lifestyle photographs
          and film are AI-created illustrative scenes, not depictions of actual
          TroTro people or operations.
        </p>
      </div>
    </footer>
  );
}
