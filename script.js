// ===== DOM Elements =====
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const loader = document.querySelector('.loader');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typedTextElement = document.querySelector('.typed-text');
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');
const contactForm = document.getElementById('contactForm');

// ===== Loading Animation =====
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1500);
});

// ===== Dark/Light Mode Toggle =====
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  
  if (body.classList.contains('light')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
  
  const sunIcon = themeToggle.querySelector('.fa-sun');
  const moonIcon = themeToggle.querySelector('.fa-moon');
  
  if (body.classList.contains('light')) {
    sunIcon.style.color = '#fbbf24';
    moonIcon.style.color = '#94a3b8';
  } else {
    sunIcon.style.color = '#94a3b8';
    moonIcon.style.color = '#fff';
  }
});

// ===== Particle Background System =====
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    this.init();
    this.animate();
    this.addEventListeners();
  }
  
  init() {
    this.resize();
    this.createParticles();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.1})`
      });
    }
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      
      this.drawConnections(particle);
    });
  }
  
  drawConnections(particle) {
    this.particles.forEach(otherParticle => {
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 120)})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(otherParticle.x, otherParticle.y);
        this.ctx.stroke();
      }
    });
  }
  
  animate() {
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
  
  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles = [];
      this.createParticles();
    });
  }
}

new ParticleSystem();

// ===== Typing Animation =====
const phrases = [
  'Full Stack Web Developer',
  'IT Professional',
  'UI/UX Designer',
  'Mobile App Developer',
  'Problem Solver'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }
  
  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeEffect, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeEffect, 500);
  } else {
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
}

if (typedTextElement) {
  setTimeout(typeEffect, 2000);
}

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
  let current = '';
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').substring(1);
    if (href === current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);

// ===== Mobile Menu Toggle =====
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenuBtn.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      if (navMenu.classList.contains('active')) {
        mobileMenuBtn.click();
      }
    }
  });
});

// ===== Skills Filter =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.filter;
    
    skillCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ===== Animated Counters =====
const counters = document.querySelectorAll('.counter-number, .stat-number');

function animateCounter(counter) {
  const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
  let current = 0;
  const increment = target / 100;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
    }
  };
  
  updateCounter();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll(
  '.service-card, .case-card, .skill-card, .trust-card, .about-content, .about-stats, .contact-info, .contact-form'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { 
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  revealObserver.observe(el);
});

// ===== Form Handling =====
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';
        
        setTimeout(() => {
          input.style.borderColor = '';
        }, 3000);
      }
    });
    
    if (isValid) {
      const button = contactForm.querySelector('button');
      const originalText = button.innerHTML;
      
      button.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
      button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        contactForm.reset();
      }, 3000);
    }
  });
}

// ===== 3D Tilt Effect =====
const tiltCards = document.querySelectorAll('.service-card, .case-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// ===== Floating Badges Animation =====
const badges = document.querySelectorAll('.badge');
badges.forEach((badge, index) => {
  badge.style.animationDelay = `${index * 0.5}s`;
});

// ===== Footer Quote Animation =====
const footerQuote = document.querySelector('.footer-quote');

if (footerQuote) {
  const quoteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        
        const icon = entry.target.querySelector('.quote-icon');
        if (icon) {
          icon.style.transform = 'rotate(0deg) scale(1)';
        }
      }
    });
  }, { threshold: 0.3 });
  
  footerQuote.style.opacity = '0';
  footerQuote.style.transform = 'translateY(30px) scale(0.95)';
  footerQuote.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  
  const icon = footerQuote.querySelector('.quote-icon');
  if (icon) {
    icon.style.transform = 'rotate(-10deg) scale(0.8)';
    icon.style.transition = 'all 0.8s ease 0.3s';
  }
  
  quoteObserver.observe(footerQuote);
}

// ===== Copyright Year =====
const copyrightElement = document.querySelector('.copyright');
if (copyrightElement) {
  const currentYear = new Date().getFullYear();
  copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
}

// ===== Social Links Hover Effect =====
const socialLinks = document.querySelectorAll('.social-icon, .footer-social-link');

socialLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.transform = 'translateY(-5px) scale(1.1)';
  });
  
  link.addEventListener('mouseleave', () => {
    link.style.transform = '';
  });
});

// ===== Logo Glow Effect =====
const footerLogo = document.querySelector('.footer-logo');

if (footerLogo) {
  setInterval(() => {
    footerLogo.style.boxShadow = '0 0 30px var(--electric-glow)';
    setTimeout(() => {
      footerLogo.style.boxShadow = '0 10px 30px -5px var(--electric-glow)';
    }, 200);
  }, 3000);
}