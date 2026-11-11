import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import SiteLayout from "./components/SiteLayout";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import ServicesPage from "./pages/Services";
import ResourcesPage from "./pages/Resources";
import Contact from "./pages/Contact";
import Review from "./pages/Review";
import About, { LegalPage } from "./pages/About";
import { services } from "./data/services";
import { resources } from "./data/resources";
import { routeMetadata, siteRoutes } from "./data/siteRoutes";

function MissingPage() {
  return (
    <section className="not-found">
      <div className="container">
        <span className="eyebrow">LET'S GET YOU BACK ON TRACK</span>
        <h1>404</h1>
        <h2>This page isn't here.</h2>
        <p>
          It may have moved. Our services and courses are a good place to start.
        </p>
        <a href="/" className="button button-black">
          Back to home <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}

export default function App({ path: suppliedPath }: { path?: string }) {
  const rawPath =
    suppliedPath ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  const known = siteRoutes.some(route => route.path === path);
  useEffect(() => {
    const metadata = routeMetadata(path);
    document.title = metadata.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metadata.description);
    if (metadata.keywords?.length) {
      document
        .querySelector('meta[name="keywords"]')
        ?.setAttribute("content", metadata.keywords.join(", "));
    }
    if (!known && path !== "/404") window.location.replace("/404");
  }, [path, known]);
  let page;
  if (path === "/") page = <Home />;
  else if (path === "/services") page = <ServicesPage />;
  else if (path === "/courses") page = <Courses />;
  else if (path === "/contact") page = <Contact />;
  else if (path === "/review") page = <Review />;
  else if (path === "/about") page = <About />;
  else if (path === "/insights") page = <ResourcesPage />;
  else if (path === "/privacy" || path === "/terms")
    page = <LegalPage type={path === "/privacy" ? "privacy" : "terms"} />;
  else if (
    path.startsWith("/services/") &&
    services.some(service => `/services/${service.slug}` === path)
  )
    page = <ServicesPage slug={path.split("/")[2]} />;
  else if (
    path.startsWith("/insights/") &&
    resources.some(resource => `/insights/${resource.slug}` === path)
  )
    page = <ResourcesPage slug={path.split("/")[2]} />;
  else page = <MissingPage />;
  return (
    <SiteLayout path={path}>
      {page}
      <WhatsAppButton />
    </SiteLayout>
  );
}
