import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, GraduationCap, Search } from "lucide-react";
import { courses } from "../data/courses";
import ServiceWhatsAppRequest from "../components/ServiceWhatsAppRequest";

export default function Courses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All courses");
  const [selectedCourse, setSelectedCourse] = useState("");
  useEffect(() => {
    const requestedCourse = new URLSearchParams(window.location.search).get(
      "course"
    );
    if (requestedCourse) setSelectedCourse(requestedCourse);
  }, []);
  const results = useMemo(
    () =>
      courses.filter(
        course =>
          (category === "All courses" || course.category === category) &&
          `${course.name} ${course.topics}`
            .toLowerCase()
            .includes(query.toLowerCase().trim())
      ),
    [query, category]
  );
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">THE MANLUNG LEARNING HUB</span>
          <h1>
            Build skills.
            <br />
            <em>Open possibilities.</em>
          </h1>
          <p>
            30 cybersecurity courses. A place for every level of curiosity.
            Explore online learning from anywhere in Kenya, and ask us about
            course format and the next available intake.
          </p>
        </div>
      </section>
      <section className="page-section">
        <div className="container">
          <div className="course-toolbar">
            <div className="filter-tabs" aria-label="Course categories">
              {["All courses", "Foundation", "Defence", "Advanced"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCategory(tab)}
                  className={category === tab ? "selected" : ""}
                  aria-pressed={category === tab}
                >
                  {tab}
                </button>
              ))}
            </div>
            <label className="search-field">
              <Search size={18} />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Find a course..."
                aria-label="Search courses"
              />
            </label>
          </div>
          <div className="results-label" role="status">
            Showing {results.length} of {courses.length} courses{" "}
            <span>Course fees in Kenyan shillings</span>
          </div>
          <div className="courses-grid">
            {results.map(course => (
              <article className="course-card" key={course.name}>
                <div className="card-top">
                  <GraduationCap size={25} strokeWidth={1.5} />
                  <span className="tag">{course.category}</span>
                </div>
                <h2>{course.name}</h2>
                <p>{course.topics}</p>
                <div className="course-bottom">
                  <span>
                    <small>Course fee</small>KES{" "}
                    {course.price.toLocaleString("en-KE")}
                  </span>
                  <a
                    href={`/courses?course=${encodeURIComponent(course.name)}#course-request`}
                    aria-label={`Enquire about ${course.name} on WhatsApp`}
                    title={`Enquire about ${course.name} on WhatsApp`}
                  >
                    <span>Enquire</span>
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          {results.length === 0 && (
            <div className="empty-state">
              <Search size={32} />
              <h2>No matching courses</h2>
              <p>Try another keyword or browse all course categories.</p>
              <button
                className="button button-black"
                onClick={() => {
                  setCategory("All courses");
                  setQuery("");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
          <div className="course-disclaimer">
            <p>
              Course fees are shown for guidance. Confirm the current fee,
              availability, schedule, and delivery format with our team before
              enrolling. No payment is taken on this website.
            </p>
            <a className="text-link" href="/contact">
              Need help choosing? Let's talk <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <ServiceWhatsAppRequest
        id="course-request"
        heading="Ask us about a course"
        serviceCategory="Cybersecurity courses"
        options={courses.map(course => course.name)}
        initialValue={selectedCourse}
        introduction="Search the 30-course catalogue, select a course, or type another training request."
      />
    </>
  );
}
