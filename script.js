// script.js
// Vintage Rides Full Website Functionality

// Table of Contents
// -----------------------------------------------------------------------------
// 1.  Global Variables & DOMElements Cache
// 2.  Mock Data (Cars)
// 3.  Utility Functions (Debounce, Selectors)
// 4.  Core UI Initializations
//     - Navbar Functionality (Sticky, Mobile Toggle, Active Link)
//     - Modal System
//     - Form Handling & Validation (Generic, Password Toggle)
//     - Scroll-Triggered Animations
//     - Smooth Scrolling
//     - Chat Widget
// 5.  User Authentication Simulation & Navbar Update
// 6.  Page-Specific Initializations & Functionality
//     - Index Page (Swiper Carousel for Featured Cars)
//     - Cars Page (Listings, Filtering, Sorting, Car Details Modal)
//     - Compare Page
//     - Cart Page
//     - Login/Register Page
//     - Contact Page
// 7.  DOMContentLoaded Event Listener (Main Execution)
// -----------------------------------------------------------------------------

// 1. Global Variables & DOMElements Cache
// -----------------------------------------------------------------------------
const DOMElements = {};
let allCars = []; // Will be populated with mockCarsData
let shoppingCart = [];
let currentCarFilters = { searchTerm: '', priceRange: 'all', year: 'all', make: 'all', sortBy: 'default' };
// Cache DOM elements for performance

function cacheDOMElements() {
    DOMElements.navbar = document.getElementById('navbar');
    DOMElements.mobileNavToggle = document.getElementById('mobile-nav-toggle');
    DOMElements.mainNav = DOMElements.navbar ? DOMElements.navbar.querySelector('nav ul#main-navigation') : null; // Target the UL directly
    DOMElements.navLinks = DOMElements.mainNav ? DOMElements.mainNav.querySelectorAll('li > a') : [];
    DOMElements.navAuthLink = document.getElementById('nav-auth-link');
    DOMElements.footerAuthLink = document.getElementById('footer-auth-link');
    DOMElements.cartItemCountIcon = document.getElementById('cart-item-count');

    DOMElements.modals = document.querySelectorAll('.modal');
    DOMElements.carDetailModal = document.getElementById('carDetailModal');

    DOMElements.chatToggleBtn = document.getElementById('chat-toggle-btn');
    DOMElements.chatWidget = document.getElementById('chat-widget');
    if (DOMElements.chatWidget) {
        DOMElements.chatMessagesContainer = DOMElements.chatWidget.querySelector('#chat-widget-messages');
        DOMElements.chatInput = DOMElements.chatWidget.querySelector('#chat-widget-input input[type="text"]');
        DOMElements.chatSendBtn = DOMElements.chatWidget.querySelector('#chat-widget-input button');
        DOMElements.chatCloseBtn = DOMElements.chatWidget.querySelector('.close-chat-btn');
    }

    // Cars Page Elements
    DOMElements.carListingsContainer = document.getElementById('car-listings-container');
    DOMElements.filterForm = document.getElementById('car-filters-form');
    DOMElements.searchInput = document.getElementById('search-term');
    DOMElements.priceFilter = document.getElementById('filter-price');
    DOMElements.yearFilter = document.getElementById('filter-year');
    DOMElements.makeFilter = document.getElementById('filter-make');
    DOMElements.sortFilter = document.getElementById('filter-sort');
    DOMElements.resultsCountElement = document.getElementById('results-count'); // For showing car count

    // Compare Page Elements
    DOMElements.compareCar1Select = document.getElementById('compare-car1');
    DOMElements.compareCar2Select = document.getElementById('compare-car2');
    DOMElements.compareButton = document.getElementById('compare-btn');
    DOMElements.comparisonResultTableBody = document.getElementById('comparison-result-table');
    DOMElements.compareHeaderCar1 = document.getElementById('compare-header-car1');
    DOMElements.compareHeaderCar2 = document.getElementById('compare-header-car2');
    DOMElements.compareFormFeedback = document.getElementById('compare-form-feedback');


    // Cart Page Elements
    DOMElements.cartItemsContainer = document.getElementById('cart-items-container');
    DOMElements.cartSubtotal = document.getElementById('cart-subtotal');
    DOMElements.cartTax = document.getElementById('cart-tax');
    DOMElements.cartTotal = document.getElementById('cart-total');
    DOMElements.checkoutButton = document.getElementById('checkout-btn');

    console.log("DOM Elements Cached.");
}

// 2. Mock Data (Cars)
// -----------------------------------------------------------------------------
const mockCarsData = [
    { id: 1, make: 'Chevrolet', model: 'Bel Air', year: 1957, price: 65000, mileage: 45000, engine: 'V8', image: 'https://cdn.dealeraccelerate.com/car/1/802/53919/1920x1440/w/1956-chevrolet-bel-air', description: 'Iconic American classic with stunning fins and chrome.', status: 'Available', badge: 'Featured' },
    { id: 2, make: 'Ford', model: 'Mustang Shelby GT500', year: 1967, price: 180000, mileage: 22000, engine: 'V8 Big-Block', image: 'https://cdn.dealeraccelerate.com/rkm/1/8238/561375/1920x1440/1967-ford-mustang-shelby-gt500-tribute', description: 'A legendary muscle car with raw power and timeless appeal.', status: 'Available' },
    { id: 3, make: 'Volkswagen', model: 'Beetle', year: 1963, price: 25000, mileage: 80000, engine: 'Flat-4', image: 'https://bonhamscarsonline.twic.pics/c58b4f6f-e8ff-4f80-861f-45ccb8dddbea/media-da8b5941-6320-47be-92ff-9e1f3cd554ba.jpg', description: 'The beloved "Bug", a symbol of counter-culture and practicality.', status: 'Sold', badge: 'Sold' },
    { id: 4, make: 'Jaguar', model: 'E-Type Series 1', year: 1961, price: 250000, mileage: 30000, engine: 'Inline-6', image: 'https://www.supercars.net/blog/wp-content/uploads/2016/02/Screenshot-2016-02-23-18.19.38.png', description: 'Often called the most beautiful car ever made.', status: 'Available' },
    { id: 5, make: 'Porsche', model: '911 Carrera RS', year: 1973, price: 550000, mileage: 50000, engine: 'Flat-6', image: 'https://images.classic.com/vehicles/a8f1da682ad4e672032dd0a0ac33b5ce71b20049?ar=16%3A9&fit=crop&w=600', description: 'A lightweight, homologation special, highly sought after.', status: 'Available', badge: 'Just Arrived' },
    { id: 6, make: 'Mercedes-Benz', model: '300SL Gullwing', year: 1955, price: 1200000, mileage: 15000, engine: 'Inline-6', image: 'https://silverarrowcars.com/wp-content/uploads/2021/12/198A0402-LowRes.jpg', description: 'Iconic gullwing doors and racing pedigree.', status: 'Available' },
    { id: 7, make: 'Ferrari', model: '250 GTO', year: 1962, price: 48000000, mileage: 5000, engine: 'V12', image: 'https://www.maxim.com/wp-content/uploads/2024/05/1963-Ferrari-250-GTL-Berlinetta-Lusso-by-Scaglietti-Paolo-Carlini-┬⌐2023-Courtesy-of-RM-Sothebys.jpg?w=1024', description: 'The holy grail of classic cars, extremely rare and valuable.', status: 'Sold', badge: 'Sold' },
    { id: 8, make: 'Aston Martin', model: 'DB5', year: 1964, price: 950000, mileage: 60000, engine: 'Inline-6', image: 'https://www.supercars.net/blog/wp-content/uploads/2016/04/1098471-1024.jpg', description: 'The James Bond car, epitome of British style and performance.', status: 'Available' },
    { id: 9, make: 'Cadillac', model: 'Eldorado Biarritz', year: 1959, price: 120000, mileage: 70000, engine: 'V8', image: 'https://cdn.dealeraccelerate.com/vanguard/1/28343/1452230/1920x1440/1957-cadillac-eldorado-biarritz-convertible', description: 'Peak of American automotive extravagance with massive tailfins.', status: 'Available', badge: 'Featured' },
    { id: 10, make: 'BMW', model: '2002 Turbo', year: 1974, price: 90000, mileage: 55000, engine: 'Turbo Inline-4', image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/BMW_2002_Turbo_%282008-06-28%29_ret.jpg', description: 'One of the first turbocharged production cars, a driver\'s delight.', status: 'Available', badge: 'Just Arrived' },
    { id: 11, make: 'Lancia', model: 'Stratos HF Stradale', year: 1975, price: 450000, mileage: 35000, engine: 'V6 (Ferrari Dino)', image: 'https://www.designboom.com/twitterimages/uploads/2021/09/1975-lancia-stratos-HF-stradale-designboom-fb.jpg', description: 'Legendary rally champion with a distinctive wedge shape.', status: 'Sold', badge: 'Sold' },
    { id: 12, make: 'Toyota', model: '2000GT', year: 1967, price: 750000, mileage: 40000, engine: 'Inline-6', image: 'https://media.goodingco.com/image/upload/c_fill,g_auto,q_90,w_1800/v1/Prod/PB23_Pebble%20Beach%20Auctions%202023/659_1967%20Toyota%202000%20GT/1967_Toyota_2000_GT_2_ask2xw', description: 'Japan\'s first supercar, known for its beauty and refinement.', status: 'Available' },
];

// 3. Utility Functions
// -----------------------------------------------------------------------------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 4. Core UI Initializations
// -----------------------------------------------------------------------------
function initializeNavbar() {
    if (!DOMElements.navbar) { console.error("Navbar element not found for initialization."); return; }

    const headerHeight = DOMElements.navbar.offsetHeight || 70;
    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight) { DOMElements.navbar.classList.add('scrolled'); }
        else { DOMElements.navbar.classList.remove('scrolled'); }
    });

    if (DOMElements.mobileNavToggle && DOMElements.mainNav) {
        DOMElements.mobileNavToggle.addEventListener('click', () => {
            DOMElements.mainNav.classList.toggle('mobile-nav-active');
            const isExpanded = DOMElements.mainNav.classList.contains('mobile-nav-active');
            DOMElements.mobileNavToggle.setAttribute('aria-expanded', isExpanded.toString());
            DOMElements.mobileNavToggle.innerHTML = isExpanded 
                ? '<i class="fas fa-times"></i><span class="sr-only">Close Navigation</span>' 
                : '<i class="fas fa-bars"></i><span class="sr-only">Open Navigation</span>';
        });

        DOMElements.mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (DOMElements.mainNav.classList.contains('mobile-nav-active')) {
                    DOMElements.mainNav.classList.remove('mobile-nav-active');
                    DOMElements.mobileNavToggle.setAttribute('aria-expanded', 'false');
                    DOMElements.mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i><span class="sr-only">Open Navigation</span>';
                }
            });
        });
    }
}

function updateActiveNavLink() {
    if (!DOMElements.navLinks || DOMElements.navLinks.length === 0) return;
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    DOMElements.navLinks.forEach(link => {
        link.classList.remove('active');
        let linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === "" && link.getAttribute('href').endsWith('/')) linkPath = 'index.html'; // Handle root path
        
        if (linkPath === currentPath || (currentPath === 'index.html' && (linkPath === '' || linkPath === 'index.html'))) {
            link.classList.add('active');
        }
    });
}

function initializeModals() {
    const modalTriggers = $$('[data-modal-target]');
    modalTriggers.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling if card itself is clickable
            const targetModalId = button.getAttribute('data-modal-target');
            const modal = $(`#${targetModalId}`);
            if (modal) {
                // If it's a car detail modal trigger, pass carId
                const carId = button.dataset.carId;
                if (targetModalId === 'carDetailModal' && carId) {
                    showCarDetailsModal(carId); // showCarDetailsModal will call openModal
                } else {
                    openModal(modal);
                }
            }
        });
    });

    DOMElements.modals.forEach(modal => {
        const closeButtons = modal.querySelectorAll('.modal-close-btn, [data-modal-dismiss]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => closeModal(modal));
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal(modal);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openModalElem = $('.modal.show');
            if (openModalElem) closeModal(openModalElem);
        }
    });
}

function openModal(modalElement, contentHTML = null) {
    if (!modalElement) return;
    const modalBody = modalElement.querySelector('.modal-body');
    if (contentHTML && modalBody) {
        modalBody.innerHTML = contentHTML;
    }
    modalElement.classList.add('show');
    document.body.style.overflow = 'hidden';
    modalElement.setAttribute('aria-hidden', 'false');
    const focusableElement = modalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElement) focusableElement.focus();
}

function closeModal(modalElement) {
    if (!modalElement || !modalElement.classList.contains('show')) return;
    modalElement.classList.remove('show');
    document.body.style.overflow = '';
    modalElement.setAttribute('aria-hidden', 'true');
}

function initializeForms() {
    $$('form.needs-validation').forEach(form => {
        form.addEventListener('submit', event => {
            if (!validateForm(form)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });

    $$('.password-toggle-btn').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInputId = toggle.getAttribute('data-toggle-password');
            const passwordInput = $(`#${passwordInputId}`);
            if (passwordInput) togglePasswordVisibility(passwordInput, toggle);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
        let fieldValid = true;
        let message = input.dataset.errorMessage || `Please provide a valid ${input.name || 'value'}.`;

        if (input.type === 'email') fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        else if (input.type === 'password' && input.dataset.confirmPassword) {
            const originalPassword = $(`#${input.dataset.confirmPassword}`);
            fieldValid = input.value === originalPassword.value && input.value.length > 0;
            if(!fieldValid && input.value.length > 0) message = "Passwords do not match.";
        } else if (input.type === 'checkbox') fieldValid = input.checked;
        else fieldValid = input.value.trim() !== '';

        if (input.minLength > 0 && input.value.trim().length < input.minLength) {
            fieldValid = false;
            message = `Must be at least ${input.minLength} characters.`;
        }
        
        if (!fieldValid) isValid = false;
        showValidationFeedback(input, fieldValid, message);
    });
    return isValid;
}

function showValidationFeedback(inputElement, isValid, message = '') {
    const formGroup = inputElement.closest('.form-group, .input-group'); // Handle direct parent or input-group
    if (!formGroup) return;

    let feedbackElement = formGroup.parentNode.querySelector(`.form-feedback[data-for="${inputElement.id}"], .form-feedback.w-100`); // More specific selector or general one
    if (!feedbackElement && formGroup.nextElementSibling && formGroup.nextElementSibling.classList.contains('form-feedback')) {
        feedbackElement = formGroup.nextElementSibling;
    }
    if (!feedbackElement) { // Create if not found
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'form-feedback';
        if (inputElement.id) feedbackElement.setAttribute('data-for', inputElement.id);
        const parentToInsertAfter = inputElement.closest('.input-group') || inputElement;
        parentToInsertAfter.parentNode.insertBefore(feedbackElement, parentToInsertAfter.nextSibling);
    }
    
    if (isValid) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        feedbackElement.textContent = '';
        feedbackElement.className = 'form-feedback valid';
    } else {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        feedbackElement.textContent = message;
        feedbackElement.className = 'form-feedback invalid w-100'; // ensure w-100 for input groups
    }
    feedbackElement.style.display = message || (isValid && feedbackElement.classList.contains('valid') && feedbackElement.textContent) ? 'block' : 'none';
}

function togglePasswordVisibility(passwordInput, toggleButton) {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    toggleButton.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
}

function initializeScrollAnimations() {
    const animatedElements = $$('.scroll-fade-in');
    if (!animatedElements.length || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
}

function initializeSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && targetId.startsWith('#') && targetId !== '#!' && targetId !== '#') {
                const targetElement = $(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = DOMElements.navbar ? DOMElements.navbar.offsetHeight : 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });
}

function initializeChatWidget() {
    if (!DOMElements.chatToggleBtn || !DOMElements.chatWidget || !DOMElements.chatMessagesContainer || !DOMElements.chatInput || !DOMElements.chatSendBtn || !DOMElements.chatCloseBtn) {
        console.warn("One or more chat elements missing. Chat disabled.");
        return;
    }
    const initialGreeting = "Hi there! 👋 Welcome to Vintage Rides. How can I help you today?";

    DOMElements.chatToggleBtn.addEventListener('click', () => {
        const isOpen = DOMElements.chatWidget.classList.toggle('open');
        DOMElements.chatToggleBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-comments"></i>';
        DOMElements.chatToggleBtn.classList.toggle('chat-is-open', isOpen);
        DOMElements.chatToggleBtn.setAttribute('aria-expanded', isOpen.toString());
        if (isOpen && DOMElements.chatMessagesContainer.children.length === 0) {
            addChatMessage(initialGreeting, 'bot', DOMElements.chatMessagesContainer);
        }
        if (isOpen) DOMElements.chatInput.focus();
    });

    DOMElements.chatCloseBtn.addEventListener('click', () => {
        DOMElements.chatWidget.classList.remove('open');
        DOMElements.chatToggleBtn.innerHTML = '<i class="fas fa-comments"></i>';
        DOMElements.chatToggleBtn.classList.remove('chat-is-open');
        DOMElements.chatToggleBtn.setAttribute('aria-expanded', 'false');
    });

    function sendUserMessage() {
        const messageText = DOMElements.chatInput.value.trim();
        if (messageText === '') return;
        addChatMessage(messageText, 'user', DOMElements.chatMessagesContainer);
        DOMElements.chatInput.value = '';
        DOMElements.chatInput.focus();
        setTimeout(() => {
            let botReply = "Thanks! A specialist will be with you shortly.";
            if (messageText.match(/hello|hi/i)) botReply = "Hello! How can I assist you today?";
            else if (messageText.match(/price|cost|how much/i)) botReply = "For pricing, please view the car's detail page or contact sales.";
            addChatMessage(botReply, 'bot', DOMElements.chatMessagesContainer);
        }, 1200);
    }
    DOMElements.chatSendBtn.addEventListener('click', sendUserMessage);
    DOMElements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUserMessage(); }
    });
}

function addChatMessage(text, senderType, container) {
    if (!container) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', senderType);
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// 5. User Authentication Simulation & Navbar Update
// -----------------------------------------------------------------------------
function updateUserLoginStateInNavbar() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInVintageUser'));
    if (DOMElements.navAuthLink) {
        if (loggedInUser) {
            DOMElements.navAuthLink.textContent = 'User Profile';
            DOMElements.navAuthLink.href = 'user.html';
            DOMElements.navAuthLink.classList.remove('nav-login-btn'); 
            DOMElements.navAuthLink.classList.add('nav-profile-btn');
        } else {
            DOMElements.navAuthLink.textContent = 'Login / Register';
            DOMElements.navAuthLink.href = 'login.html';
            DOMElements.navAuthLink.classList.add('nav-login-btn');
            DOMElements.navAuthLink.classList.remove('nav-profile-btn');
        }
    }
    if (DOMElements.footerAuthLink) { // Update footer link too
        if (loggedInUser) {
            DOMElements.footerAuthLink.textContent = 'My Profile';
            DOMElements.footerAuthLink.href = 'user.html';
        } else {
            DOMElements.footerAuthLink.textContent = 'Member Login';
            DOMElements.footerAuthLink.href = 'login.html';
        }
    }
}

// 6. Page-Specific Initializations & Functionality
// -----------------------------------------------------------------------------

// Index Page
function initializeIndexPage() {
    console.log("Index page specific JS loaded.");
    // Swiper for featured cars is initialized separately if on index page
}

// In your Page-Specific Initializations section (around line 328)
// In your Page-Specific Initializations section
function initializeFeaturedCarsSwiper() {
    if (document.querySelector('.featured-cars-swiper')) {
        new Swiper('.featured-cars-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            loop: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 0,
                stretch: -50,
                depth: 200,
                modifier: 1.5,
                slideShadows: false
            },
            navigation: {
                nextEl: '.featured-cars-next',
                prevEl: '.featured-cars-prev',
            },
            pagination: {
                el: '.featured-cars-pagination',
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.2,
                    coverflowEffect: {
                        stretch: -20,
                        depth: 100,
                        modifier: 1.2
                    }
                },
                768: {
                    slidesPerView: 2,
                    coverflowEffect: {
                        stretch: -30,
                        depth: 150,
                        modifier: 1.3
                    }
                },
                992: {
                    slidesPerView: 2.5,
                    coverflowEffect: {
                        stretch: -40,
                        depth: 200,
                        modifier: 1.4
                    }
                },
                1200: {
                    slidesPerView: 3,
                    coverflowEffect: {
                        stretch: -50,
                        depth: 200,
                        modifier: 1.5
                    }
                }
            }
        });
    }
}


// Cars Page
function initializeCarsPage() {
    if (!DOMElements.carListingsContainer) { console.warn("Car listings container not found on cars page."); return; }
    allCars = [...mockCarsData]; // Initialize with full dataset
    populateFilterDropdowns();
    applyAndSortFilters(); // Initial render with default filters/sort

    if (DOMElements.filterForm) {
        DOMElements.filterForm.addEventListener('submit', (e) => { e.preventDefault(); applyAndSortFilters(); });
        // Listen to changes on individual filter inputs for dynamic updates
        [DOMElements.searchInput, DOMElements.priceFilter, DOMElements.yearFilter, DOMElements.makeFilter, DOMElements.sortFilter].forEach(el => {
            if (el) {
                const eventType = (el.tagName === 'INPUT' && el.type === 'text') ? 'keyup' : 'change';
                el.addEventListener(eventType, debounce(applyAndSortFilters, 350));
            }
        });
        
        const resetFiltersBtn = DOMElements.filterForm.querySelector('#reset-filters-btn');
        if(resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                DOMElements.filterForm.reset(); // Resets form fields
                // Manually clear currentCarFilters and re-apply
                currentCarFilters = { searchTerm: '', priceRange: 'all', year: 'all', make: 'all', sortBy: 'default' };
                applyAndSortFilters();
            });
        }
    }
    console.log("Cars page initialized.");
}

function populateFilterDropdowns() {
    if (DOMElements.yearFilter) {
        DOMElements.yearFilter.innerHTML = '<option value="all">All Years</option>';
        const years = [...new Set(allCars.map(car => car.year))].sort((a, b) => b - a);
        years.forEach(year => DOMElements.yearFilter.add(new Option(year, year)));
    }
    if (DOMElements.makeFilter) {
        DOMElements.makeFilter.innerHTML = '<option value="all">All Makes</option>';
        const makes = [...new Set(allCars.map(car => car.make))].sort();
        makes.forEach(make => DOMElements.makeFilter.add(new Option(make, make.toLowerCase())));
    }
}

function renderCarListings(carsToRender) {
    if (!DOMElements.carListingsContainer) return;
    DOMElements.carListingsContainer.innerHTML = ''; // Clear
    const resultsCount = carsToRender.length;
    if (DOMElements.resultsCountElement) {
        const countSpan = DOMElements.resultsCountElement.querySelector('.count-number');
        if (countSpan) countSpan.textContent = resultsCount;
        DOMElements.resultsCountElement.innerHTML = `Showing <span class="count-number">${resultsCount}</span> car${resultsCount !== 1 ? 's' : ''}.`;

    }


    if (resultsCount === 0) {
        DOMElements.carListingsContainer.innerHTML = '<p class="no-results lead text-center p-5">No cars match your current criteria. Try adjusting your filters.</p>';
        return;
    }

    carsToRender.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'card car-item';
        carCard.innerHTML = `
            ${car.badge ? `<div class="card-badge card-badge-${car.badge.toLowerCase().replace(/\s+/g, '-')}">${car.badge}</div>` : ''}
            <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${car.make} ${car.model}</h3>
                <p class="card-subtitle">${car.year}</p>
                <p class="card-text">${car.description.length > 80 ? car.description.substring(0, 77) + '...' : car.description}</p>
                <p class="card-price">$${car.price.toLocaleString()}</p>
            </div>
            <div class="card-footer d-flex justify-content-center align-items-center">
                <button class="btn btn-primary btn-sm view-details-btn" data-modal-target="carDetailModal" data-car-id="${car.id}">View Details</button>
                <button class="btn btn-secondary btn-sm add-to-cart-btn" data-car-id="${car.id}" ${car.status === 'Sold' ? 'disabled' : ''}>
                    ${car.status === 'Sold' ? 'Sold Out' : 'Add to Cart'}
                </button>
            </div>
        `;
        DOMElements.carListingsContainer.appendChild(carCard);
    });
    // Re-initialize modal triggers for new cards
    initializeModals(); 
    // Add to cart listeners
    DOMElements.carListingsContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            addToCart(btn.dataset.carId);
        });
    });
}

function applyAndSortFilters() {
    if (DOMElements.searchInput) currentCarFilters.searchTerm = DOMElements.searchInput.value.toLowerCase();
    if (DOMElements.priceFilter) currentCarFilters.priceRange = DOMElements.priceFilter.value;
    if (DOMElements.yearFilter) currentCarFilters.year = DOMElements.yearFilter.value;
    if (DOMElements.makeFilter) currentCarFilters.make = DOMElements.makeFilter.value;
    if (DOMElements.sortFilter) currentCarFilters.sortBy = DOMElements.sortFilter.value;

    let filteredCars = allCars.filter(car => {
        const matchesSearch = !currentCarFilters.searchTerm || 
                              car.make.toLowerCase().includes(currentCarFilters.searchTerm) ||
                              car.model.toLowerCase().includes(currentCarFilters.searchTerm) ||
                              car.year.toString().includes(currentCarFilters.searchTerm);
        let matchesPrice = currentCarFilters.priceRange === 'all';
        if (!matchesPrice) {
            const [min, max] = currentCarFilters.priceRange.split('-');
            if (max) matchesPrice = car.price >= parseInt(min) && car.price <= parseInt(max);
            else if (currentCarFilters.priceRange.startsWith('under')) matchesPrice = car.price < parseInt(min.replace('under',''));
            else if (currentCarFilters.priceRange.startsWith('over')) matchesPrice = car.price > parseInt(min.replace('over',''));
        }
        const matchesYear = currentCarFilters.year === 'all' || car.year.toString() === currentCarFilters.year;
        const matchesMake = currentCarFilters.make === 'all' || car.make.toLowerCase() === currentCarFilters.make;
        return matchesSearch && matchesPrice && matchesYear && matchesMake;
    });

    // Sorting logic
    switch (currentCarFilters.sortBy) {
        case 'price-asc': filteredCars.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filteredCars.sort((a, b) => b.price - a.price); break;
        case 'year-asc': filteredCars.sort((a, b) => a.year - b.year); break;
        case 'year-desc': filteredCars.sort((a, b) => b.year - a.year); break;
        case 'make-asc': filteredCars.sort((a, b) => a.make.localeCompare(b.make)); break;
    }
    renderCarListings(filteredCars);
}

function showCarDetailsModal(carId) {
    const car = allCars.find(c => c.id.toString() === carId);
    if (!car || !DOMElements.carDetailModal) return;
    const modalTitle = DOMElements.carDetailModal.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = `${car.year} ${car.make} ${car.model}`;
    const modalContentHTML = `
        <img src="${car.image}" alt="${car.make} ${car.model}" class="img-fluid mb-3 rounded" style="max-height: 300px; object-fit: cover;">
        <p><strong>Price:</strong> $${car.price.toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${car.mileage.toLocaleString()} miles</p>
        <p><strong>Engine:</strong> ${car.engine}</p>
        <p><strong>Status:</strong> ${car.status} ${car.badge ? `(${car.badge})` : ''}</p>
        <hr>
        <p>${car.description}</p>
        <div class="mt-3 text-end">
            <button class="btn btn-primary add-to-cart-btn" data-car-id="${car.id}" ${car.status === 'Sold' ? 'disabled' : ''}>
                ${car.status === 'Sold' ? 'Sold Out' : '<i class="fas fa-cart-plus"></i> Add to Cart'}
            </button>
        </div>
    `;
    openModal(DOMElements.carDetailModal, modalContentHTML);
    // Add to cart listener for button inside modal
    const modalAddToCartBtn = DOMElements.carDetailModal.querySelector('.add-to-cart-btn');
    if(modalAddToCartBtn){
        // Remove old listener to prevent multiple additions if modal is reopened for same car
        const newBtn = modalAddToCartBtn.cloneNode(true);
        modalAddToCartBtn.parentNode.replaceChild(newBtn, modalAddToCartBtn);
        newBtn.addEventListener('click', () => {
            if(newBtn.disabled) return;
            addToCart(newBtn.dataset.carId);
            // Optionally close modal or give feedback
            // closeModal(DOMElements.carDetailModal);
        });
    }
}


// Compare Page
// In script.js

// (Ensure mockCarsData is defined globally or passed correctly)
// let allCars = [...mockCarsData]; // This should be at a higher scope, like global or after mockCarsData definition

function initializeComparePage() {
    // Check if essential DOMElements for this page are cached and exist
    if (!DOMElements.compareCar1Select || !DOMElements.compareCar2Select || 
        !DOMElements.compareButton || !DOMElements.comparisonResultTableBody) {
        console.warn("One or more critical compare page elements are missing. Compare functionality might be impaired.");
        // Optionally, you could disable the compare button or show a message on the page
        if(DOMElements.compareCar1Select) DOMElements.compareCar1Select.innerHTML = '<option value="">Error: Setup issue</option>';
        if(DOMElements.compareCar2Select) DOMElements.compareCar2Select.innerHTML = '<option value="">Error: Setup issue</option>';
        if(DOMElements.compareButton) DOMElements.compareButton.disabled = true;
        return; 
    }

    // Ensure allCars is populated (it should be from the global scope)
    if (!allCars || allCars.length === 0) {
        // If allCars isn't ready, try to initialize it from mockCarsData
        if (typeof mockCarsData !== 'undefined' && mockCarsData.length > 0) {
            allCars = [...mockCarsData];
            console.log("Initialized allCars from mockCarsData in initializeComparePage.");
        } else {
            console.error("Car data (allCars or mockCarsData) is not available for compare page selectors.");
            DOMElements.compareCar1Select.innerHTML = '<option value="">No cars available</option>';
            DOMElements.compareCar2Select.innerHTML = '<option value="">No cars available</option>';
            DOMElements.compareButton.disabled = true;
            return;
        }
    }
    
    populateCompareSelectors(); // Call the function to fill the dropdowns

    DOMElements.compareButton.addEventListener('click', handleComparison);

    // Clear feedback when selections change (this is good UX)
    [DOMElements.compareCar1Select, DOMElements.compareCar2Select].forEach(selectElement => {
        if (selectElement) {
            selectElement.addEventListener('change', () => {
                if (DOMElements.compareFormFeedback) {
                    DOMElements.compareFormFeedback.textContent = '';
                }
            });
        }
    });
    console.log("Compare page initialized.");
}

function populateCompareSelectors() {
    // Filter for available cars only, if desired for comparison
    // const availableCars = allCars.filter(car => car.status === 'Available');
    const carsToPopulate = allCars; // Or use availableCars if you only want to compare available ones

    if (carsToPopulate.length === 0) {
        console.warn("No cars to populate in compare selectors.");
        const noCarsOption = '<option value="">No cars available for comparison</option>';
        if (DOMElements.compareCar1Select) DOMElements.compareCar1Select.innerHTML = noCarsOption;
        if (DOMElements.compareCar2Select) DOMElements.compareCar2Select.innerHTML = noCarsOption;
        return;
    }

    // Populate both select elements
    [DOMElements.compareCar1Select, DOMElements.compareCar2Select].forEach(selectElement => {
        if (!selectElement) return; // Skip if element not found

        // Preserve the first default option (e.g., "-- Select a Car --") if it exists and you want to keep it
        const firstOptionHTML = selectElement.options.length > 0 && selectElement.options[0].value === "" 
                                ? `<option value="">${selectElement.options[0].text}</option>` 
                                : '<option value="">-- Select a Car --</option>';
        selectElement.innerHTML = firstOptionHTML; // Clear existing options except the placeholder

        carsToPopulate.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id; // Use car ID as the value
            option.textContent = `${car.year} ${car.make} ${car.model} ($${car.price.toLocaleString()})`; // Text for display
            selectElement.appendChild(option);
        });
    });
    console.log("Compare selectors populated with car options.");
}

// The handleComparison() and renderComparisonTable() functions should remain as previously defined.
function handleComparison() {
    const carId1 = DOMElements.compareCar1Select.value;
    const carId2 = DOMElements.compareCar2Select.value;
    let message = "";
    if (!carId1 || !carId2) message = "Please select two cars to compare.";
    else if (carId1 === carId2) message = "Please select two different cars for comparison.";
    
    if(DOMElements.compareFormFeedback) DOMElements.compareFormFeedback.textContent = message;

    if (message) {
        DOMElements.comparisonResultTableBody.innerHTML = `<tr><td colspan="3" class="text-center p-4 lead">${message}</td></tr>`;
        if(DOMElements.compareHeaderCar1) DOMElements.compareHeaderCar1.textContent = "Vehicle 1";
        if(DOMElements.compareHeaderCar2) DOMElements.compareHeaderCar2.textContent = "Vehicle 2";
        return;
    }
    const car1 = allCars.find(c => c.id.toString() === carId1);
    const car2 = allCars.find(c => c.id.toString() === carId2);
    if (!car1 || !car2) { 
        if(DOMElements.compareFormFeedback) DOMElements.compareFormFeedback.textContent = "Selected car data not found."; 
        DOMElements.comparisonResultTableBody.innerHTML = `<tr><td colspan="3" class="text-center p-4 lead">Error: Car data missing.</td></tr>`;
        return; 
    }

    if(DOMElements.compareHeaderCar1) DOMElements.compareHeaderCar1.textContent = `${car1.year} ${car1.make} ${car1.model}`;
    if(DOMElements.compareHeaderCar2) DOMElements.compareHeaderCar2.textContent = `${car2.year} ${car2.make} ${car2.model}`;
    renderComparisonTable(car1, car2);
}

function renderComparisonTable(car1, car2) {
    if (!DOMElements.comparisonResultTableBody) return;
    const features = [
        { label: 'Image', key: 'image', type: 'image' }, { label: 'Make', key: 'make' }, { label: 'Model', key: 'model' }, 
        { label: 'Year', key: 'year' }, { label: 'Price', key: 'price', type: 'currency' }, 
        { label: 'Mileage', key: 'mileage', type: 'number' }, { label: 'Engine', key: 'engine'},
        { label: 'Description', key: 'description', type: 'longtext'}
    ];
    let tableHTML = '';
    features.forEach(f => {
        let v1 = car1[f.key] !== undefined && car1[f.key] !== null ? car1[f.key] : 'N/A';
        let v2 = car2[f.key] !== undefined && car2[f.key] !== null ? car2[f.key] : 'N/A';
        
        if (f.type === 'image' && v1 !== 'N/A' && v2 !== 'N/A') { 
            v1 = `<img src="${v1}" class="compare-car-image" alt="${car1.model || 'Car 1'}">`; 
            v2 = `<img src="${v2}" class="compare-car-image" alt="${car2.model || 'Car 2'}">`; 
        } else if (f.type === 'currency' && typeof v1 === 'number' && typeof v2 === 'number') { 
            v1 = `$${v1.toLocaleString()}`; 
            v2 = `$${v2.toLocaleString()}`; 
        } else if (f.type === 'number' && typeof v1 === 'number' && typeof v2 === 'number') { 
            v1 = v1.toLocaleString(); 
            v2 = v2.toLocaleString(); 
        } else if (f.type === 'longtext' && typeof v1 === 'string' && typeof v2 === 'string') {
            v1 = v1.length > 100 ? v1.substring(0, 97) + '...' : v1;
            v2 = v2.length > 100 ? v2.substring(0, 97) + '...' : v2;
        }
        const highlight = (v1 !== v2 && f.type !== 'image' && v1 !== 'N/A' && v2 !== 'N/A') ? 'highlight-diff' : ''; // Highlight only if both values are present and different
        tableHTML += `<tr><td><strong>${f.label}</strong></td><td class="${highlight}">${v1}</td><td class="${highlight}">${v2}</td></tr>`;
    });
    DOMElements.comparisonResultTableBody.innerHTML = tableHTML;
}


// Cart Page
function initializeCartPage() {
    if (!DOMElements.cartItemsContainer) { console.warn("Cart elements not found."); return; }
    shoppingCart = JSON.parse(localStorage.getItem('vintageCarCart')) || [];
    renderCartItems();
    if (DOMElements.checkoutButton) {
        DOMElements.checkoutButton.addEventListener('click', () => {
            if (shoppingCart.length === 0) { alert("Your cart is empty!"); return; }
            alert("Proceeding to checkout (simulation). Thank you!");
            shoppingCart = []; saveCart(); renderCartItems();
        });
    }
    const promoBtn = document.getElementById('apply-promo-btn'); // From cart.html inline script, moved here for centralization
    const promoInput = document.getElementById('promo-code');
    const promoFeedback = document.getElementById('promo-feedback');
    if(promoBtn && promoInput && promoFeedback){
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if(code === "VINTAGE10") { promoFeedback.textContent = "VINTAGE10 applied! (Simulated 10% off)"; promoFeedback.className = 'form-feedback valid d-block text-success';}
            else if (code === "") { promoFeedback.textContent = "Please enter code."; promoFeedback.className = 'form-feedback invalid d-block text-danger'; }
            else { promoFeedback.textContent = "Invalid code."; promoFeedback.className = 'form-feedback invalid d-block text-danger'; }
            setTimeout(() => { promoFeedback.textContent = ''; promoFeedback.className = 'form-feedback';}, 5000);
        });
    }
    console.log("Cart page initialized.");
}

function addToCart(carId) {
    const car = allCars.find(c => c.id.toString() === carId);
    if (!car) { alert("Car not found!"); return; }
    if (car.status === 'Sold') { alert(`${car.make} ${car.model} is sold out.`); return; }
    if (shoppingCart.find(item => item.id === car.id)) { alert(`${car.make} ${car.model} is already in cart.`); return; }
    shoppingCart.push({ ...car, quantity: 1 });
    alert(`${car.make} ${car.model} added to cart!`);
    saveCart();
    updateCartIconCounter();
}

function renderCartItems() {
    if (!DOMElements.cartItemsContainer) return;
    DOMElements.cartItemsContainer.innerHTML = '';
    if (shoppingCart.length === 0) {
        DOMElements.cartItemsContainer.innerHTML = '<tr><td colspan="6" class="text-center p-4 lead">Your cart is empty. <a href="cars.html">Find your classic!</a></td></tr>';
    } else {
        shoppingCart.forEach((item, index) => {
            const row = DOMElements.cartItemsContainer.insertRow();
            row.className = 'cart-item-row';
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.make}" class="cart-item-image"></td>
                <td><strong>${item.make} ${item.model}</strong><br><small>${item.year}</small></td>
                <td>$${item.price.toLocaleString()}</td>
                <td><input type="number" value="1" min="1" max="1" class="form-control form-control-sm quantity-input" data-item-index="${index}" readonly title="Vintage cars are unique; quantity is 1."></td>
                <td>$${item.price.toLocaleString()}</td>
                <td><button class="btn btn-danger btn-sm remove-from-cart-btn" data-item-index="${index}"><i class="fas fa-trash"></i> Remove</button></td>`;
        });
        DOMElements.cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.itemIndex)));
        });
    }
    updateCartTotals();
}

function removeFromCart(index) {
    shoppingCart.splice(index, 1);
    saveCart();
    renderCartItems();
}

function updateCartTotals() {
    const subtotal = shoppingCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.08; // Example 8%
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    if (DOMElements.cartSubtotal) DOMElements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (DOMElements.cartTax) DOMElements.cartTax.textContent = `$${tax.toFixed(2)}`;
    if (DOMElements.cartTotal) DOMElements.cartTotal.textContent = `$${total.toFixed(2)}`;
    if (DOMElements.checkoutButton) DOMElements.checkoutButton.disabled = shoppingCart.length === 0;
}

function saveCart() { localStorage.setItem('vintageCarCart', JSON.stringify(shoppingCart)); }

function updateCartIconCounter() {
    if (!DOMElements.cartItemCountIcon) return;
    const count = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    DOMElements.cartItemCountIcon.textContent = count;
    DOMElements.cartItemCountIcon.style.display = count > 0 ? 'flex' : 'none'; // 'flex' if it's styled as a flex item
}

// Login/Register Page (Tab switching & form submission is now part of initializeForms)
function initializeLoginPage() { // This focuses on tab switching. Form submission is via initializeForms + page-specific logic if needed.
    const tabControls = $$('#authTab .nav-link[data-tab]');
    const tabPanes = $$('#authTabContent .tab-pane');

    if (tabControls.length > 0 && tabPanes.length > 0) {
        // Activate first tab by default if none are active
        const firstTabControl = tabControls[0];
        const firstTabPaneId = firstTabControl.dataset.tab;
        const firstTabPane = $(`#${firstTabPaneId}`);
        if(firstTabControl && firstTabPane && !firstTabControl.classList.contains('active')){ // Check if not already active
            firstTabControl.classList.add('active');
            firstTabControl.setAttribute('aria-selected', 'true');
            firstTabPane.classList.add('active');
        }
        
        tabControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTabId = control.dataset.tab;
                tabControls.forEach(tc => { tc.classList.remove('active'); tc.setAttribute('aria-selected', 'false'); });
                control.classList.add('active');
                control.setAttribute('aria-selected', 'true');
                tabPanes.forEach(pane => pane.classList.remove('active'));
                const targetPane = $(`#${targetTabId}`);
                if (targetPane) targetPane.classList.add('active');
            });
        });
    }

    // Login form submission
    const loginForm = $('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // Validation is now global via initializeForms
            // If validation passes (implicitly by not being prevented by initializeForms)...
            if (event.defaultPrevented) return; // If validateForm already prevented it.
            event.preventDefault(); // Still prevent default for simulation

            // SIMULATE SUCCESSFUL LOGIN:
            const userEmailInput = loginForm.querySelector('#login-email');
            const userEmail = userEmailInput ? userEmailInput.value : 'test@example.com';
            let userName = "Valued User";
            if (userEmail.includes('@')) {
                userName = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
            const mockUser = { email: userEmail, name: userName, id: 'user-' + Date.now() };
            localStorage.setItem('loggedInVintageUser', JSON.stringify(mockUser));
            alert('Login successful! Redirecting to your profile...');
            window.location.href = 'user.html';
        });
    }
    
    // Registration form submission
    const registerForm = $('#register-form');
    if(registerForm){
        registerForm.addEventListener('submit', (event) => {
            if (event.defaultPrevented) return;
            event.preventDefault();
            alert("Registration successful (simulation)! Please login.");
            const loginTabButton = $('#login-tab-btn');
            if (loginTabButton) loginTabButton.click(); 
        });
    }
    console.log("Login page tab system initialized.");
}

// Contact Page
function initializeContactPage() {
    const inquiryTypeSelect = $('#contact-inquiry-type');
    const carDetailsGroup = $('#car-details-group');
    const contactForm = $('#contact-form');
    const formSubmissionFeedback = $('#contact-form-submission-feedback');

    if (inquiryTypeSelect && carDetailsGroup) {
        inquiryTypeSelect.addEventListener('change', function() {
            const carDetailsInput = $('#contact-car-details');
            if (this.value === 'car_specific_question') {
                carDetailsGroup.style.display = 'block';
                if (carDetailsInput) carDetailsInput.setAttribute('required', 'required');
            } else {
                carDetailsGroup.style.display = 'none';
                if (carDetailsInput) {
                    carDetailsInput.removeAttribute('required'); carDetailsInput.value = '';
                    carDetailsInput.classList.remove('is-valid', 'is-invalid');
                    const feedbackEl = carDetailsInput.closest('.form-group').querySelector('.form-feedback');
                    if(feedbackEl) feedbackEl.textContent = '';
                }
            }
        });
    }
    if (contactForm && formSubmissionFeedback) {
        contactForm.addEventListener('submit', function(event) {
            if (event.defaultPrevented) { // If global validation already failed
                formSubmissionFeedback.innerHTML = `<div class="alert alert-danger" role="alert"><i class="fas fa-exclamation-triangle"></i> Please correct the form errors.</div>`;
                setTimeout(() => { formSubmissionFeedback.innerHTML = ''; }, 5000);
                return;
            }
            event.preventDefault(); // Prevent default for simulation even if global validation passed
            const contactNameInput = $('#contact-name');
            const contactName = contactNameInput ? contactNameInput.value : "there";
            formSubmissionFeedback.innerHTML = `<div class="alert alert-success" role="alert"><i class="fas fa-check-circle"></i> Thank you, ${contactName}! Message sent (simulated).</div>`;
            contactForm.reset();
            if (carDetailsGroup) carDetailsGroup.style.display = 'none';
            $('#contact-car-details')?.removeAttribute('required');
            contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
            contactForm.querySelectorAll('.form-feedback').forEach(el => el.textContent = '');
            setTimeout(() => { formSubmissionFeedback.innerHTML = ''; }, 7000);
        });
    }
    console.log("Contact page initialized.");
}


// 7. DOMContentLoaded Event Listener (Main Execution)
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('Vintage Rides JS Initializing...');
    cacheDOMElements();
    updateUserLoginStateInNavbar(); 
    
    initializeNavbar();
    initializeModals();
    initializeForms(); // Global form setup
    initializeChatWidget();
    initializeScrollAnimations();
    initializeSmoothScroll();

    const bodyId = document.body.id;
    switch (bodyId) {
// In your DOMContentLoaded event listener
        case 'page-index':
            initializeIndexPage();
            initializeFeaturedCarsSwiper(); // Add this line
            break;
        case 'page-login':
            initializeLoginPage(); // Handles tabs and specific login/reg form submission logic
            break;
        case 'page-cars':
            initializeCarsPage();
            break;
        case 'page-compare':
            initializeComparePage();
            break;
        case 'page-cart':
            initializeCartPage();
            break;
        case 'page-contact':
            initializeContactPage();
            break;
        // User.html has its own inline script
    }
    updateActiveNavLink(); // Call after all other initializations that might affect nav
    updateCartIconCounter(); // Initial cart count on page load

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();


    // Ensure the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const sliderInner = document.querySelector('.slider-inner');
    const cars = document.querySelectorAll('.car-item');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentIndex = 0;

    // Function to update the center car and apply the effect
    function updateSlider() {
        cars.forEach((car, index) => {
            car.classList.remove('center', 'prev', 'next');
            if (index === currentIndex) {
                car.classList.add('center');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === cars.length - 1)) {
                car.classList.add('prev');
            } else if (index === currentIndex + 1 || (currentIndex === cars.length - 1 && index === 0)) {
                car.classList.add('next');
            }
        });

        // Move the slider to the correct position
        const offset = -currentIndex * (cars[0].offsetWidth + 30); // 30 is the margin
        sliderInner.style.transform = `translateX(${offset}px)`;
    }

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cars.length;
        updateSlider();
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cars.length) % cars.length;
        updateSlider();
    });

    // Enable mouse drag functionality
    let isDragging = false;
    let startX;
    
    sliderInner.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        sliderInner.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const moveX = e.pageX - startX;
        sliderInner.style.transform = `translateX(${moveX}px)`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        sliderInner.style.cursor = 'grab';
        updateSlider(); // Reset the position of the cars after dragging
    });

    // Initialize the first car
    updateSlider();
});

    
    console.log("Vintage Rides JS Initialized and Ready.");
});
