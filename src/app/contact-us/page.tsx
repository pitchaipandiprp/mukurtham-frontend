import { Metadata } from "next";
import ContactUs from "@/components/pages/about/contact-us";

export const metadata: Metadata = {
    title: "Mukurtham - Contact Us",
    description: "Learn more about Mukurtham, your complete event booking partner for weddings and special events.",
};

export default function ContactUsPage() {
    return <ContactUs />
}
