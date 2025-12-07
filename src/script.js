// =======================================================
// 1. Dark/Light Mode Toggle
// =======================================================
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Function to set the theme
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
    }
}

// Initial theme check
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
    setTheme(storedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Check system preference if no stored theme
    setTheme('dark');
} else {
    setTheme('light');
}

// Event listener for the toggle button
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
});


// =======================================================
// 2. Typewriter Animation for Hero Section
// =======================================================
const typingTextElement = document.getElementById('typing-text');
const titles = ["Cybersecurity Manager", "Security Architecture Expert", "GRC Professional", "Certified Trainer"];
let titleIndex = 0;
let charIndex = 0;

function type() {
    const currentTitle = titles[titleIndex];
    if (charIndex < currentTitle.length) {
        typingTextElement.textContent += currentTitle.charAt(charIndex);
        charIndex++;
        setTimeout(type, 80); // Typing speed
    } else {
        setTimeout(erase, 1500); // Wait before erasing
    }
}

function erase() {
    const currentTitle = titles[titleIndex];
    if (charIndex > 0) {
        typingTextElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 40); // Erasing speed
    } else {
        titleIndex = (titleIndex + 1) % titles.length; // Move to next title
        setTimeout(type, 500); // Wait before typing next title
    }
}

// Start the typewriter animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000); 
});


// =======================================================
// 3. Scroll-Triggered Animations (Intersection Observer)
// =======================================================

// Function to handle the Skill progress bars animation
function animateSkills(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('[data-skill-level]');
            skillItems.forEach(item => {
                const level = item.getAttribute('data-skill-level');
                const progressBar = item.querySelector('.skill-progress-bar');
                if (progressBar.style.width === '0%') { // Animate only once
                    progressBar.style.width = `${level}%`;
                }
            });
            // observer.unobserve(entry.target); // Uncomment to animate only once
        }
    });
}

// Function to handle general section animations (Fade-in and Translate)
function animateSections(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            entry.target.classList.add('opacity-100', 'translate-y-0');

            // Special handling for the Timeline cards (staggered fade)
            const timelineCards = entry.target.querySelectorAll('.timeline-card');
            timelineCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('opacity-0', 'translate-y-8');
                    card.classList.add('opacity-100', 'translate-y-0');
                    card.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
                }, index * 200); 
            });

            // observer.unobserve(entry.target); // Uncomment to animate only once
        }
    });
}

const skillSection = document.getElementById('skills');
const generalSections = document.querySelectorAll('[data-animate-on-scroll]');

// Intersection Observer for Skills
const skillObserver = new IntersectionObserver(animateSkills, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2 // Trigger when 20% of the section is visible
});

if (skillSection) {
    skillObserver.observe(skillSection);
}

// Intersection Observer for General Sections (Projects, Experience, Contact)
const sectionObserver = new IntersectionObserver(animateSections, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the section is visible
});

generalSections.forEach(section => {
    sectionObserver.observe(section);
});


// =======================================================
// 4. Smooth Scrolling for Navigation
// =======================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// =======================================================
// 5. Contact Form Submission (AJAX - Requires separate backend)
// =======================================================
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    formMessage.classList.remove('hidden', 'text-green-500', 'text-red-500');
    formMessage.classList.add('text-primary');
    formMessage.textContent = 'Sending message...';
    formMessage.classList.remove('hidden');

    // IMPORTANT: Replace this placeholder URL with your LIVE BACKEND endpoint (e.g., from Render/Heroku)
    const backendEndpoint = 'http://localhost:3000/submit'; 

    try {
        const response = await fetch(backendEndpoint, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            formMessage.classList.remove('text-primary');
            formMessage.classList.add('text-green-500');
            formMessage.textContent = result.message || 'Thank you! Your message has been sent successfully.';
            contactForm.reset();
        } else {
            formMessage.classList.remove('text-primary');
            formMessage.classList.add('text-red-500');
            formMessage.textContent = result.error || 'Oops! There was an error sending your message.';
        }
    } catch (error) {
        console.error('Submission Error:', error);
        formMessage.classList.remove('text-primary');
        formMessage.classList.add('text-red-500');
        formMessage.textContent = 'Network error. Please try again later. (Is the backend running?)';
    }
});
