// ============================================
// 1. LOADING KOMPONENTËVE (Header dhe Footer)
// ============================================

function getComponentPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/') || currentPath.includes('\\pages\\')) {
        return '../components/';
    }
    return 'components/';
}

async function loadComponent(componentPath, targetId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
            
            if (targetId === 'header-placeholder') {
                updateHeaderLinks();
                setActiveNavLink();
                initializeMobileMenu();
                
                const heroSlider = document.querySelector('.hero-slider');
                const pageHeader = document.querySelector('.page-header');
                const header = document.querySelector('.header');
                
                if (header) {
                    if (!heroSlider && !pageHeader) {
                        header.classList.add('has-background');
                    } else {
                        header.classList.remove('has-background');
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Gabim në ngarkimin e komponentit ${componentPath}:`, error);
    }
}

function updateHeaderLinks() {
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes('/pages/') || 
                           currentPath.includes('\\pages\\') ||
                           (currentPath.split('/').pop() !== 'index.html' && currentPath.split('/').pop() !== '');
    
    const linkMap = {
        'index': 'index.html',
        'about': 'about.html',
        'services': 'services.html',
        'appointment': 'appointment.html',
        'contact': 'contact.html'
    };
    
    const navLinks = document.querySelectorAll('.nav-menu a[data-link]');
    navLinks.forEach(link => {
        const linkKey = link.getAttribute('data-link');
        const fileName = linkMap[linkKey];
        
        if (isInPagesFolder) {
            if (linkKey === 'index') {
                link.setAttribute('href', '../' + fileName);
            } else {
                link.setAttribute('href', fileName);
            }
        } else {
            if (linkKey === 'index') {
                link.setAttribute('href', fileName);
            } else {
                link.setAttribute('href', 'pages/' + fileName);
            }
        }
    });
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'index',
        'about.html': 'about',
        'services.html': 'services',
        'appointment.html': 'appointment',
        'contact.html': 'contact'
    };
    
    const currentPageKey = pageMap[currentPage] || 'index';
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === currentPageKey) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const componentBasePath = getComponentPath();
    
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        loadComponent(componentBasePath + 'header.html', 'header-placeholder');
    }
    
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        loadComponent(componentBasePath + 'footer.html', 'footer-placeholder');
    }
});

// ============================================
// 2. MENU MOBILE (Për telefona)
// ============================================

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (menuToggle && navMenu) {
        navMenu.classList.toggle('active');
        menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    }
}

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        newMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function() {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const menuToggle = document.getElementById('menuToggle');
                if (menuToggle) {
                    menuToggle.textContent = '☰';
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
});

// ============================================
// 3. SCROLL SMOOTH
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// 4. ANIMACIONI I STATISTIKAVE
// ============================================

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

document.addEventListener('DOMContentLoaded', animateStats);

// ============================================
// 5. FORMUARI I KONTAKTIT
// ============================================

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showAlert('Ju lutemi plotësoni të gjitha fushat e detyrueshme!', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showAlert('Ju lutemi shkruani një email të vlefshëm!', 'error');
        return;
    }
    
    console.log('Të dhënat e formularit:', formData);
    showAlert('Faleminderit! Mesazhi juaj u dërgua me sukses. Do t\'ju kontaktojmë së shpejti.', 'success');
    document.getElementById('contactForm').reset();
}

// ============================================
// 6. FUNKSIONI PËR TREGUAR ALERT (Mesazhe)
// ============================================

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#7BB3E3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    
    if (!document.getElementById('alert-animation-style')) {
        const style = document.createElement('style');
        style.id = 'alert-animation-style';
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
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 4000);
}

// ============================================
// 7. SCROLL TO TOP BUTTON
// ============================================

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #7BB3E3 0%, #A8D5F0 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        display: none;
        transition: all 0.3s;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ============================================
// 8. HEADER SCROLL EFFECT
// ============================================

function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const heroSlider = document.querySelector('.hero-slider');
    const pageHeader = document.querySelector('.page-header');
    
    if (header) {
        if (heroSlider || pageHeader) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        } else {
            header.classList.add('scrolled');
        }
    }
}

window.addEventListener('scroll', handleHeaderScroll);
document.addEventListener('DOMContentLoaded', () => {
    handleHeaderScroll();
});

// ============================================
// 9. SMOOTH SCROLL PËR LINK-ET
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ============================================
// 10. VALIDIMI I FORMULARIT NË KOHË REALE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    }
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Kjo fushë është e detyrueshme!';
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ju lutemi shkruani një email të vlefshëm!';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#f44336';
        
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = 'color: #f44336; font-size: 0.9rem; margin-top: 0.5rem;';
        field.parentElement.appendChild(errorDiv);
    } else {
        field.classList.remove('error');
        field.style.borderColor = '#4caf50';
    }
    
    return isValid;
}

// ============================================
// 11. EFEKTI I HOVER PËR KARTAT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.service-card, .news-card, .value-card, .team-member');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

console.log('JavaScript u ngarkua me sukses! 🎉');

// ============================================
// 12. REZERVIMI I TERMINAVE
// ============================================

const doctorsInfo = {
    'dr-agron': {
        name: 'Dr. Agron Berisha',
        specialty: 'Kardiologji',
        experience: 'Mbi 15 vjet përvojë në kardiologji. Specializuar në trajtimin e sëmundjeve të zemrës.',
        education: 'Doktoraturë në Kardiologji, Universiteti i Prishtinës'
    },
    'dr-lirije': {
        name: 'Dr. Lirije Gashi',
        specialty: 'Pediatri',
        experience: 'Mbi 12 vjet përvojë në pediatri. Eksperte në kujdesin për fëmijët.',
        education: 'Specializim në Pediatri, Spitali i Fëmijëve'
    },
    'dr-arben': {
        name: 'Dr. Arben Krasniqi',
        specialty: 'Kardiologji',
        experience: 'Mbi 10 vjet përvojë në kardiologji. Specializuar në procedura invazive.',
        education: 'Doktoraturë në Kardiologji, Universiteti i Prishtinës'
    },
    'dr-valbona': {
        name: 'Dr. Valbona Morina',
        specialty: 'Gjinekologji',
        experience: 'Mbi 8 vjet përvojë në gjinekologji. Eksperte në shëndetin e grave.',
        education: 'Specializim në Gjinekologji, Spitali Universitar'
    },
    'dr-besnik': {
        name: 'Dr. Besnik Rexhepi',
        specialty: 'Ortopedi',
        experience: 'Mbi 14 vjet përvojë në ortopedi. Specializuar në kirurgji ortopedike.',
        education: 'Doktoraturë në Ortopedi, Universiteti i Prishtinës'
    },
    'dr-ardita': {
        name: 'Dr. Ardita Shala',
        specialty: 'Neurologji',
        experience: 'Mbi 9 vjet përvojë në neurologji. Eksperte në trajtimin e sëmundjeve nervore.',
        education: 'Specializim në Neurologji, Spitali Universitar'
    }
};

function updateDoctorInfo() {
    const doctorSelect = document.getElementById('doctorSelect');
    const doctorInfo = document.getElementById('doctorInfo');
    const doctorDetails = document.getElementById('doctorDetails');
    const doctorSpecialty = document.getElementById('doctorSpecialty');
    const doctorExperience = document.getElementById('doctorExperience');
    
    if (!doctorSelect || !doctorInfo) return;
    
    const selectedDoctor = doctorSelect.value;
    
    if (selectedDoctor && doctorsInfo[selectedDoctor]) {
        const doctor = doctorsInfo[selectedDoctor];
        
        doctorDetails.textContent = `👨‍⚕️ ${doctor.name}`;
        doctorSpecialty.textContent = `🏥 Specialiteti: ${doctor.specialty}`;
        doctorExperience.textContent = `📚 ${doctor.experience}`;
        
        doctorInfo.style.display = 'block';
    } else {
        doctorInfo.style.display = 'none';
    }
}

function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;
        
        dateInput.setAttribute('min', minDate);
        
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxYear = maxDate.getFullYear();
        const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
        const maxDay = String(maxDate.getDate()).padStart(2, '0');
        dateInput.setAttribute('max', `${maxYear}-${maxMonth}-${maxDay}`);
    }
}

function updateAvailableHours() {
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    
    if (!dateInput || !timeSelect) return;
    
    const selectedDate = new Date(dateInput.value);
    const dayOfWeek = selectedDate.getDay();
    
    while (timeSelect.options.length > 1) {
        timeSelect.remove(1);
    }
    
    const weekdaysHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    const saturdayHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
    let availableHours = [];
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        availableHours = weekdaysHours;
    } else if (dayOfWeek === 6) {
        availableHours = saturdayHours;
    } else {
        const noAppointmentOption = document.createElement('option');
        noAppointmentOption.value = '';
        noAppointmentOption.textContent = 'Nuk ka rezervime të disponueshme';
        noAppointmentOption.disabled = true;
        timeSelect.appendChild(noAppointmentOption);
        return;
    }
    
    availableHours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        timeSelect.appendChild(option);
    });
}

function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    const formData = {
        patientName: document.getElementById('patientName').value.trim(),
        patientEmail: document.getElementById('patientEmail').value.trim(),
        patientPhone: document.getElementById('patientPhone').value.trim(),
        patientAge: document.getElementById('patientAge').value,
        doctor: document.getElementById('doctorSelect').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        visitReason: document.getElementById('visitReason').value.trim()
    };
    
    if (!validateAppointmentForm(formData)) {
        return;
    }
    
    console.log('Rezervimi i terminave:', formData);
    
    const doctorName = doctorsInfo[formData.doctor]?.name || 'Doktor i panjohur';
    const dateObj = new Date(formData.appointmentDate);
    const formattedDate = dateObj.toLocaleDateString('sq-AL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const successMessage = `✅ Rezervimi u bë me sukses! 📋 Detajet: 👤 ${formData.patientName} | 👨‍⚕️ ${doctorName} | 📅 ${formattedDate} | ⏰ ${formData.appointmentTime} | 📧 Konfirmimi do të dërgohet në ${formData.patientEmail}`;
    
    showAlert(successMessage, 'success');
    document.getElementById('appointmentForm').reset();
    document.getElementById('doctorInfo').style.display = 'none';
    setMinDate();
}

function validateAppointmentForm(formData) {
    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || 
        !formData.patientAge || !formData.doctor || !formData.appointmentDate || 
        !formData.appointmentTime || !formData.visitReason) {
        showAlert('Ju lutemi plotësoni të gjitha fushat!', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.patientEmail)) {
        showAlert('Ju lutemi shkruani një email të vlefshëm!', 'error');
        return false;
    }
    
    if (formData.patientPhone.length < 8) {
        showAlert('Ju lutemi shkruani një numër telefoni të vlefshëm!', 'error');
        return false;
    }
    
    const age = parseInt(formData.patientAge);
    if (isNaN(age) || age < 1 || age > 120) {
        showAlert('Ju lutemi shkruani një moshë të vlefshme (1-120)!', 'error');
        return false;
    }
    
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showAlert('Ju lutemi zgjidhni një datë në të ardhmen!', 'error');
        return false;
    }
    
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) {
        showAlert('E Dielë nuk ka rezervime! Ju lutemi zgjidhni një ditë tjetër.', 'error');
        return false;
    }
    
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('appointmentForm')) {
        setMinDate();
        
        const doctorSelect = document.getElementById('doctorSelect');
        if (doctorSelect) {
            doctorSelect.addEventListener('change', updateDoctorInfo);
        }
        
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            dateInput.addEventListener('change', updateAvailableHours);
        }
    }
});

// ============================================
// 13. HERO SLIDER
// ============================================

let currentSlideIndex = 0;
let slideInterval;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    resetAutoSlide();
}

function currentSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = slideNumber - 1;
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    resetAutoSlide();
}

function autoSlide() {
    changeSlide(1);
}

function startAutoSlide() {
    slideInterval = setInterval(autoSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.hero-slider');
    
    if (slider) {
        startAutoSlide();
        
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                changeSlide(1);
            }
            if (touchEndX > touchStartX + 50) {
                changeSlide(-1);
            }
        }
    }
});

