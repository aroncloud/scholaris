import LandingFooter from "@/components/website/LandingFooter";
import LandingHeader from "@/components/website/LandingHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <div>
            <LandingHeader />
            <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen bg-blue-sky mt-28 mb-20`}>
                {children}
            </div>
            <LandingFooter />
        </div>
    );
}
