"use client";

export default function PanelFooter() {
    return (
        <footer className="hidden lg:block flex flex-col shrink-0">
            <div className="h-14 bg-white border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
                <p>&copy; {new Date().getFullYear()} Mukurtham Admin. All rights reserved.</p>
                <div className="flex items-center gap-4 text-[11px]">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors">Support</a>
                </div>
            </div>
        </footer>

    );
}