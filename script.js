// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
const navLinksItems = document.querySelectorAll('.nav-link');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = progress + '%';
        }
    });
}, observerOptions);

// Observe all skill progress bars
document.querySelectorAll('.skill-progress').forEach(bar => {
    skillObserver.observe(bar);
});

// Animate elements on scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

// Add animation to cards
const cards = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(card);
});

// Contact form handling with AJAX submission
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Create form data
        const formData = new FormData(contactForm);
        
        try {
            // Submit to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccessPopup(name);
                contactForm.reset();
            } else {
                showNotification('Oops! There was a problem sending your message. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('Network error. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Email validation function
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Success popup function
function showSuccessPopup(name) {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.success-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-popup-overlay';
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    
    popup.innerHTML = `
        <div class="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="#10b981" stroke-width="4" fill="none" class="circle-animation"/>
                <path d="M25 40 L35 50 L55 30" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="check-animation"/>
            </svg>
        </div>
        <h2 class="success-title">Message Sent Successfully!</h2>
        <p class="success-message">Thank you${name ? ', ' + name : ''}! Your message has been sent. I'll get back to you as soon as possible.</p>
        <button class="success-btn" onclick="this.closest('.success-popup-overlay').remove()">Close</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Trigger animations
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    }, 5000);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.3s ease';
    notification.style.maxWidth = '400px';
    notification.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
    
    if (type === 'success') {
        notification.style.background = '#10b981';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations and popup styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .success-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
    }
    
    .success-popup-overlay.show {
        opacity: 1;
    }
    
    .success-popup {
        background: white;
        border-radius: 20px;
        padding: 40px 30px;
        max-width: 500px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
        animation: popupScale 0.3s ease forwards;
    }
    
    @keyframes popupScale {
        from {
            transform: scale(0.8);
        }
        to {
            transform: scale(1);
        }
    }
    
    .success-icon {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
    }
    
    .circle-animation {
        stroke-dasharray: 240;
        stroke-dashoffset: 240;
        animation: drawCircle 0.6s ease forwards;
    }
    
    @keyframes drawCircle {
        to {
            stroke-dashoffset: 0;
        }
    }
    
    .check-animation {
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
        animation: drawCheck 0.4s ease 0.4s forwards;
    }
    
    @keyframes drawCheck {
        to {
            stroke-dashoffset: 0;
        }
    }
    
    .success-title {
        font-size: 28px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 15px;
    }
    
    .success-message {
        font-size: 16px;
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 30px;
    }
    
    .success-btn {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border: none;
        padding: 12px 40px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .success-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .success-popup {
            background: #1e293b;
        }
        
        .success-title {
            color: #f1f5f9;
        }
        
        .success-message {
            color: #94a3b8;
        }
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
        .success-popup {
            padding: 30px 20px;
        }
        
        .success-title {
            font-size: 24px;
        }
        
        .success-message {
            font-size: 14px;
        }
        
        .success-icon svg {
            width: 60px;
            height: 60px;
        }
    }
`;
document.head.appendChild(style);

// Active nav link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing effect for hero subtitle (optional enhancement)
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect when page loads
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 500;
    }
});

// Add cursor effect (optional enhancement)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #6366f1;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease;
    display: none;
`;

document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Enlarge cursor on hover over interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, textarea');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.background = 'rgba(99, 102, 241, 0.2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'transparent';
    });
});

// Project card tilt effect (3D effect on hover)
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Log a welcome message
console.log('%c Welcome to my portfolio! 🚀', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c Feel free to explore the code and reach out if you have any questions!', 'color: #94a3b8; font-size: 14px;');