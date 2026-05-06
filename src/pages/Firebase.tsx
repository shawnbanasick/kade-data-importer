import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50 flex items-center justify-center p-6">
      <main className="w-full max-w-4xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12">
        <header className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            {t("Firebase (JSON) Data Import")}
          </h1>

          <div className="ml-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-3 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-shadow shadow cursor-pointer"
            >
              {t("back")}
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-2 items-center">
          <div className="p-6 bg-gradient-to-br from-white to-sky-50 rounded-xl border border-white/60 shadow-sm">
            <h2 className="text-slate-700 font-semibold mb-3">
              {t("about_title")}
            </h2>
            <p className="text-slate-600 mb-4">{t("about_content")}</p>

            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 border border-slate-200 rounded-lg hover:bg-blue-50 transition cursor-pointer"
              >
                {t("home")}
              </button> */}
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-slate-700 mb-4">{t("version_info")}</p>

            <div className="inline-block px-4 py-2 bg-white/80 border border-slate-200 rounded-lg shadow">
              Version: 1.0.0
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
