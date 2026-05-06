// import reactLogo from "./../assets/react.svg";
// import viteLogo from "/vite.svg";
// import { useState } from "react";
import { Link } from "react-router";
import LocaleSwitcher from "../components/LocaleSwitcher.tsx";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";
// import { toast } from "sonner";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-rose-50 flex items-center justify-center p-6">
      <main className="w-full max-w-4xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12">
        <header className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            KADE - Legacy Data Converter
          </h1>

          <div className="ml-auto">
            <LocaleSwitcher />
          </div>
        </header>{" "}
        <section className="mt-8 grid gap-6 md:grid-cols-2 items-center">
          <div className="text-center md:text-left gap-4 flex flex-col items-center md:items-start">
            <p className="text-slate-700 mb-4 ">{t("Select Data Source")}</p>

            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild variant="secondary">
                <Link to={"/Google Sheets"} className="">
                  {t("Google Sheets")}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={"/Firebase (JSON)"} className="">
                  {t("Firebase (JSON)")}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={"/Netlify"} className="">
                  {t("Netlify")}
                </Link>
              </Button>
            </div>
            {/* <Button
              variant="outline"
              onClick={() =>
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                })
              }
            >
              Show Toast
            </Button> */}
          </div>
        </section>
        {/* <footer className="mt-8 text-center text-sm text-slate-500">
          Made with ❤️ by Giacomo
        </footer> */}
      </main>
    </div>
  );
}
