import { useEffect, useRef, useState } from "react";

const heroStats = ["Strategy", "Research", "Design"];

const services = [
  {
    kicker: "Office of multiple interest content",
    title: "Collaborative & partnership",
  },
  {
    kicker: "The hanger US Air force digital experimental",
    title: "We talk about our weight",
  },
  {
    kicker: "Delta faucet content, social, digital",
    title: "Piloting digital confidence",
  },
];

const offers = [
  "Insight mapping",
  "Experience strategy",
  "Brand systems",
  "Digital launches",
];

const testimonials = [
  {
    name: "Kola Nadiya",
    role: "Product lead",
    quote:
      "The team gave our ideas structure and kept the launch moving without losing the original energy.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sunil S",
    role: "Founder",
    quote:
      "They turned research, messaging and visuals into a clear growth story our whole team could use.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
];

function ScrollReveal({ children, className = "", delay = 0, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`reveal-on-scroll ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.scrollY / totalScroll) * 100;
        setProgress(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="scroll-progress-container"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}

function AvatarStack() {
  return (
    <div className="avatar-stack" aria-label="Collaborators online">
      {["K", "S", "M", "A"].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function Header({ theme, toggleTheme }) {
  return (
    <header className="site-header load-fade-in">
      <a className="brand" href="#top" aria-label="Progress Studio home">
        <span className="brand-mark">P</span>
        <span>Progress Studio</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#offer">Offer</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>
        <a className="header-cta" href="#contact">Let's talk</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy load-slide-up">
        <p className="eyebrow">Tomorrow should be shaped today</p>
        <h1>
          Tomorrow should be <span>here today</span>
        </h1>
        <p>
          We are a team of strategists, designers, communicators and researchers.
          Together, we believe that progress only happens when you refuse to play
          things safe.
        </p>
        <a className="text-link" href="#work">Read more</a>
      </div>

      <div className="hero-media load-scale-in" aria-label="Team workshop preview">
        <div className="triangle triangle-one floating-shape-1" />
        <img
          className="circle-image circle-image-large floating-image-1"
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85"
          alt="People collaborating around a laptop"
        />
        <img
          className="circle-image circle-image-small floating-image-2"
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85"
          alt="A planning meeting"
        />
        <AvatarStack />
        <div className="name-tag hover-wiggle">Tejasree Momula</div>
      </div>

      <div className="hero-footer load-fade-in-delayed">
        {heroStats.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function ProgressBlock() {
  return (
    <section className="progress-section" id="work">
      <ScrollReveal className="frame-box">
        <div className="triangle triangle-two floating-shape-2" />
        <img
          className="circle-image progress-photo floating-image-3"
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85"
          alt="Creative team reviewing project material"
        />
        <div className="progress-copy">
          <h2>
            See how we can help you <span>progress</span>
          </h2>
          <p>
            We add a layer of fearless insights and action that allows change
            makers to accelerate progress in areas such as brand, design,
            digital comms and social research.
          </p>
          <a className="text-link" href="#offer">Read more</a>
        </div>
        <AvatarStack />
        <div className="name-tag name-tag-bottom hover-wiggle">Kola Nadiya</div>
      </ScrollReveal>
    </section>
  );
}

function Services() {
  return (
    <section className="services-section" id="offer">
      <ScrollReveal className="section-title">
        <h2>
          What we can <span>offer</span> you!
        </h2>
      </ScrollReveal>
      <div className="service-list">
        {services.map((service, index) => (
          <ScrollReveal key={service.title} delay={index * 100} className="service-row-wrapper">
            <a className="service-row" href="#contact">
              <small>{service.kicker}</small>
              <strong>{service.title}</strong>
              <span aria-hidden="true">→</span>
            </a>
          </ScrollReveal>
        ))}
      </div>
      <div className="offer-grid">
        {offers.map((offer, index) => (
          <ScrollReveal key={offer} delay={index * 100} className="offer-card-wrapper">
            <article>
              <span>{offer.slice(0, 2)}</span>
              <h3>{offer}</h3>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="testimonial-section" id="reviews">
      <ScrollReveal className="section-title">
        <h2>
          What our customer <span>say</span>
        </h2>
      </ScrollReveal>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <ScrollReveal key={testimonial.name} delay={index * 150} className="testimonial-card-wrapper">
            <article className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <p>“{testimonial.quote}”</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      return;
    }
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 700);
  };

  return (
    <section className="newsletter-section" id="contact">
      <ScrollReveal className="newsletter-left">
        <p className="eyebrow">Subscribe to our newsletter</p>
        <h2>Stay close to the next useful idea.</h2>
      </ScrollReveal>
      <ScrollReveal className="newsletter-right" delay={150}>
        {status === "success" ? (
          <div className="newsletter-success">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkmark-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div>
              <h3>You're on the list!</h3>
              <p>We'll email you with our next progress update.</p>
            </div>
            <button onClick={() => setStatus("idle")} className="reset-btn">Change email</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <div className="form-row">
              <input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                required
              />
              <button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        )}
      </ScrollReveal>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <ScrollProgress />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <ProgressBlock />
        <Services />
        <Testimonials />
        <Newsletter />
      </main>
      <footer>
        <span>Progress Studio</span>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}

export default App;

