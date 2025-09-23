// ===== CONFIGURAÇÕES GLOBAIS =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initLoading();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initGoogleTranslate();
});

// ===== LOADING =====
function initLoading() {
    const loading = document.getElementById('loading');
    
    // Simular tempo de carregamento
    setTimeout(() => {
        loading.classList.add('hidden');
        
        // Remover completamente após animação
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 1500);
}

// ===== NAVEGAÇÃO =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Ativar link atual baseado na scroll position
    window.addEventListener('scroll', activateCurrentLink);
}

function activateCurrentLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Header scroll effect
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMAÇÕES =====
function initAnimations() {
    // Intersection Observer para animações na scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.about-card, .feature, .sustainability-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== FORMULÁRIO DE CONTATO =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validação simples
            if (!data.name || !data.email || !data.interest || !data.message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Simular envio (substituir por integração real)
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Limpar formulário
            this.reset();
            
            // Aqui você pode adicionar integração com:
            // - EmailJS
            // - Formspree
            // - Sua própria API
            // - Google Forms
        });
    }
}

function showNotification(message, type) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'} ${message}</span>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== GOOGLE TRANSLATE =====
function initGoogleTranslate() {
    // Função para inicializar o Google Translate
    function googleTranslateElementInit() {
        if (typeof google !== 'undefined' && google.translate) {
            new google.translate.TranslateElement({
                pageLanguage: 'pt',
                includedLanguages: 'en,es,fr,de,it,pt',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        }
    }
    
    // Carregar script do Google Translate se necessário
    if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(script);
    }
    
    window.googleTranslateElementInit = googleTranslateElementInit;
}

// ===== UTILITÁRIOS =====
// Debounce function para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}