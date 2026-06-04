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

function AvatarStack() {
  return (
    <div className="avatar-stack" aria-label="Collaborators online">
      {["K", "S", "M", "A"].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function Header() {
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
      <a className="header-cta" href="#contact">Let's talk</a>
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
  return (
    <section className="newsletter-section" id="contact">
      <ScrollReveal className="newsletter-left">
        <p className="eyebrow">Subscribe to our newsletter</p>
        <h2>Stay close to the next useful idea.</h2>
      </ScrollReveal>
      <ScrollReveal className="newsletter-right" delay={150}>
        <form>
          <label htmlFor="email">Email address</label>
          <div className="form-row">
            <input id="email" type="email" placeholder="hello@example.com" />
            <button type="submit">Subscribe</button>
          </div>
        </form>
      </ScrollReveal>
    </section>
  );
}

function App() {
  return (
    <>
      <Header />
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

