import { Metadata } from "next";
import AboutUs from "@/components/pages/about/about-us";

export const metadata: Metadata = {
    title: "Mukurtham - About Us",
    description: "Learn more about Mukurtham, your complete event booking partner for weddings and special events.",
};

export default function AboutUsPage() {
    return <AboutUs />;
}
