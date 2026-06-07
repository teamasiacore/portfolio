document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }

    // Set Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Dynamic redirect URL based on current host for Web3Forms
    const redirectInput = document.querySelector('input[name="redirect"]');
    if (redirectInput) {
        redirectInput.value = window.location.origin + '/success.html';
    }
    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu && mobileMenuIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-xmark');
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            });
        });
    }

    // Visitor Tracking System
    function trackVisitor() {
        if (sessionStorage.getItem('visitor_tracked')) return;

        // Collect tech details
        const os = navigator.userAgent;
        const lang = navigator.language;
        const res = `${window.screen.width}x${window.screen.height}`;
        const referrer = document.referrer || 'Direct / None';
        const page = window.location.href;

        // Fetch IP and Location
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const message = `
                    New Website Visitor!
                    
                    Location Details:
                    IP Address: ${data.ip || 'Unknown'}
                    City: ${data.city || 'Unknown'}
                    Region: ${data.region || 'Unknown'}
                    Country: ${data.country_name || 'Unknown'}
                    ISP / Org: ${data.org || 'Unknown'}
                    
                    Tech Details:
                    OS & Browser (User Agent): ${os}
                    Language: ${lang}
                    Screen Resolution: ${res}
                    
                    Traffic Source:
                    Came from: ${referrer}
                    Landed on: ${page}
                `;

                // Send to Web3Forms
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: '532893d0-8cc3-4500-8311-137342d3bcf2',
                        subject: '🚨 New Website Visitor Notification',
                        from_name: 'Visitor Tracker',
                        message: message.trim()
                    })
                }).then(() => {
                    sessionStorage.setItem('visitor_tracked', 'true');
                }).catch(err => console.error('Tracker submission error:', err));
            })
            .catch(err => console.error('IP fetch error:', err));
    }

    trackVisitor();

    // Modal Logic
    window.openModal = function(type, projectId) {
        const modal = document.getElementById('media-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');

        if (!modal || !modalTitle || !modalContent) return;

        modalContent.innerHTML = ''; // Clear previous content
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
        document.body.style.overflow = 'hidden';

        if (type === 'gallery') {
            modalTitle.innerHTML = '<i class="fa-solid fa-images mr-2"></i> Project Gallery';
            
            // Build gallery based on projectId
            let images = [];
            if (projectId === 'visiotech-pres') {
                images = [
                    'Photos/Project Presentation/Project Presentation - photo.jpg',
                    'Photos/Project Presentation/Project Presentation - photo1.jpg',
                    'Photos/Project Presentation/Project Presentation - photo2.jpg',
                    'Photos/Project Presentation/Project Presentation - photo3.jpg'
                ];
            } else if (projectId === 'hackspectra') {
                images = [
                    'Photos/Hackspectra 2.0/Hackspetra - Photo1.jpg',
                    'Photos/Hackspectra 2.0/Hackspetra - photo 2.jpg',
                    'Photos/Hackspectra 2.0/Hacksptra - photo 3.jpg'
                ];
            }

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'w-full h-auto rounded-lg object-cover border border-white/10 shadow-lg';
                img.alt = 'Project Photo';
                grid.appendChild(img);
            });
            modalContent.appendChild(grid);

        } else if (type === 'certificate') {
            modalTitle.innerHTML = '<i class="fa-solid fa-award mr-2"></i> Certificate';
            
            let certSrc = '';
            if (projectId === 'visiotech-pres') {
                certSrc = 'Photos/Project Presentation/Project Presentation - Certificate.png';
            } else if (projectId === 'hackspectra') {
                certSrc = 'Photos/Hackspectra 2.0/Hackspetra Certificate.jpg';
            }

            if (certSrc) {
                const img = document.createElement('img');
                img.src = certSrc;
                img.className = 'w-full max-w-3xl mx-auto rounded-lg object-contain border border-white/10 shadow-lg';
                img.alt = 'Certificate';
                modalContent.appendChild(img);
            }
        }
    };

    window.closeModal = function() {
        const modal = document.getElementById('media-modal');
        if (modal) {
            modal.classList.add('modal-hidden');
            modal.classList.remove('modal-visible');
            document.body.style.overflow = 'auto';
        }
    };

    // Close modal on outside click
    const modal = document.getElementById('media-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // PDF Generation logic for resume page
    window.generatePDF = function() {
        const element = document.getElementById('resume-content');
        const btn = document.getElementById('download-btn');
        if (!element || !btn) return;
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Generating...';
        btn.disabled = true;

        const opt = {
            margin:       [0.5, 0.5, 0.5, 0.5],
            filename:     'ASIA-Core-Team-Profile.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Use html2pdf if available
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save().then(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        } else {
            alert('PDF generation library not loaded. Please try again later.');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };

    // Country Code Dropdown Logic
    const phoneInput = document.getElementById('phoneInput');
    const countrySelect = document.getElementById('countrySelect');

    if (phoneInput && countrySelect) {
        const countryData = [
            { code: "+1", country: "US/CA", min: 10, max: 10 },
            { code: "+7", country: "RU/KZ", min: 10, max: 10 },
            { code: "+20", country: "EG", min: 10, max: 10 },
            { code: "+27", country: "ZA", min: 9, max: 9 },
            { code: "+30", country: "GR", min: 10, max: 10 },
            { code: "+31", country: "NL", min: 9, max: 9 },
            { code: "+32", country: "BE", min: 9, max: 9 },
            { code: "+33", country: "FR", min: 9, max: 9 },
            { code: "+34", country: "ES", min: 9, max: 9 },
            { code: "+36", country: "HU", min: 9, max: 9 },
            { code: "+39", country: "IT", min: 10, max: 10 },
            { code: "+41", country: "CH", min: 9, max: 9 },
            { code: "+43", country: "AT", min: 10, max: 10 },
            { code: "+44", country: "UK", min: 10, max: 10 },
            { code: "+45", country: "DK", min: 8, max: 8 },
            { code: "+46", country: "SE", min: 9, max: 9 },
            { code: "+47", country: "NO", min: 8, max: 8 },
            { code: "+48", country: "PL", min: 9, max: 9 },
            { code: "+49", country: "DE", min: 10, max: 11 },
            { code: "+51", country: "PE", min: 9, max: 9 },
            { code: "+52", country: "MX", min: 10, max: 10 },
            { code: "+54", country: "AR", min: 10, max: 10 },
            { code: "+55", country: "BR", min: 10, max: 11 },
            { code: "+56", country: "CL", min: 9, max: 9 },
            { code: "+57", country: "CO", min: 10, max: 10 },
            { code: "+58", country: "VE", min: 10, max: 10 },
            { code: "+60", country: "MY", min: 9, max: 10 },
            { code: "+61", country: "AU", min: 9, max: 9 },
            { code: "+62", country: "ID", min: 9, max: 12 },
            { code: "+63", country: "PH", min: 10, max: 10 },
            { code: "+64", country: "NZ", min: 9, max: 10 },
            { code: "+65", country: "SG", min: 8, max: 8 },
            { code: "+66", country: "TH", min: 9, max: 9 },
            { code: "+81", country: "JP", min: 10, max: 10 },
            { code: "+82", country: "KR", min: 9, max: 10 },
            { code: "+84", country: "VN", min: 9, max: 10 },
            { code: "+86", country: "CN", min: 11, max: 11 },
            { code: "+90", country: "TR", min: 10, max: 10 },
            { code: "+91", country: "IN", min: 10, max: 10 },
            { code: "+92", country: "PK", min: 10, max: 10 },
            { code: "+93", country: "AF", min: 9, max: 9 },
            { code: "+94", country: "LK", min: 9, max: 9 },
            { code: "+95", country: "MM", min: 9, max: 9 },
            { code: "+98", country: "IR", min: 10, max: 10 },
            { code: "+212", country: "MA", min: 9, max: 9 },
            { code: "+213", country: "DZ", min: 9, max: 9 },
            { code: "+216", country: "TN", min: 8, max: 8 },
            { code: "+218", country: "LY", min: 9, max: 9 },
            { code: "+220", country: "GM", min: 7, max: 7 },
            { code: "+221", country: "SN", min: 9, max: 9 },
            { code: "+222", country: "MR", min: 8, max: 8 },
            { code: "+223", country: "ML", min: 8, max: 8 },
            { code: "+224", country: "GN", min: 9, max: 9 },
            { code: "+225", country: "CI", min: 10, max: 10 },
            { code: "+226", country: "BF", min: 8, max: 8 },
            { code: "+227", country: "NE", min: 8, max: 8 },
            { code: "+228", country: "TG", min: 8, max: 8 },
            { code: "+229", country: "BJ", min: 8, max: 8 },
            { code: "+230", country: "MU", min: 8, max: 8 },
            { code: "+231", country: "LR", min: 9, max: 9 },
            { code: "+232", country: "SL", min: 8, max: 8 },
            { code: "+233", country: "GH", min: 9, max: 9 },
            { code: "+234", country: "NG", min: 10, max: 11 },
            { code: "+235", country: "TD", min: 8, max: 8 },
            { code: "+236", country: "CF", min: 8, max: 8 },
            { code: "+237", country: "CM", min: 9, max: 9 },
            { code: "+238", country: "CV", min: 7, max: 7 },
            { code: "+239", country: "ST", min: 7, max: 7 },
            { code: "+240", country: "GQ", min: 9, max: 9 },
            { code: "+241", country: "GA", min: 7, max: 8 },
            { code: "+242", country: "CG", min: 9, max: 9 },
            { code: "+243", country: "CD", min: 9, max: 9 },
            { code: "+244", country: "AO", min: 9, max: 9 },
            { code: "+245", country: "GW", min: 7, max: 7 },
            { code: "+246", country: "IO", min: 7, max: 7 },
            { code: "+248", country: "SC", min: 7, max: 7 },
            { code: "+249", country: "SD", min: 9, max: 9 },
            { code: "+250", country: "RW", min: 9, max: 9 },
            { code: "+251", country: "ET", min: 9, max: 9 },
            { code: "+252", country: "SO", min: 8, max: 8 },
            { code: "+253", country: "DJ", min: 8, max: 8 },
            { code: "+254", country: "KE", min: 9, max: 9 },
            { code: "+255", country: "TZ", min: 9, max: 9 },
            { code: "+256", country: "UG", min: 9, max: 9 },
            { code: "+257", country: "BI", min: 8, max: 8 },
            { code: "+258", country: "MZ", min: 9, max: 9 },
            { code: "+260", country: "ZM", min: 9, max: 9 },
            { code: "+261", country: "MG", min: 9, max: 9 },
            { code: "+262", country: "RE", min: 9, max: 9 },
            { code: "+263", country: "ZW", min: 9, max: 9 },
            { code: "+264", country: "NA", min: 9, max: 9 },
            { code: "+265", country: "MW", min: 9, max: 9 },
            { code: "+266", country: "LS", min: 8, max: 8 },
            { code: "+267", country: "BW", min: 8, max: 8 },
            { code: "+268", country: "SZ", min: 8, max: 8 },
            { code: "+269", country: "KM", min: 7, max: 7 },
            { code: "+350", country: "GI", min: 8, max: 8 },
            { code: "+351", country: "PT", min: 9, max: 9 },
            { code: "+352", country: "LU", min: 9, max: 9 },
            { code: "+353", country: "IE", min: 9, max: 9 },
            { code: "+354", country: "IS", min: 7, max: 7 },
            { code: "+355", country: "AL", min: 9, max: 9 },
            { code: "+356", country: "MT", min: 8, max: 8 },
            { code: "+357", country: "CY", min: 8, max: 8 },
            { code: "+358", country: "FI", min: 9, max: 9 },
            { code: "+359", country: "BG", min: 9, max: 9 },
            { code: "+370", country: "LT", min: 8, max: 8 },
            { code: "+371", country: "LV", min: 8, max: 8 },
            { code: "+372", country: "EE", min: 7, max: 8 },
            { code: "+373", country: "MD", min: 8, max: 8 },
            { code: "+374", country: "AM", min: 8, max: 8 },
            { code: "+375", country: "BY", min: 9, max: 9 },
            { code: "+376", country: "AD", min: 6, max: 6 },
            { code: "+377", country: "MC", min: 8, max: 9 },
            { code: "+378", country: "SM", min: 6, max: 10 },
            { code: "+380", country: "UA", min: 9, max: 9 },
            { code: "+381", country: "RS", min: 9, max: 9 },
            { code: "+382", country: "ME", min: 8, max: 8 },
            { code: "+383", country: "XK", min: 8, max: 8 },
            { code: "+385", country: "HR", min: 9, max: 9 },
            { code: "+386", country: "SI", min: 8, max: 8 },
            { code: "+387", country: "BA", min: 8, max: 8 },
            { code: "+389", country: "MK", min: 8, max: 8 },
            { code: "+420", country: "CZ", min: 9, max: 9 },
            { code: "+421", country: "SK", min: 9, max: 9 },
            { code: "+423", country: "LI", min: 7, max: 7 },
            { code: "+500", country: "FK", min: 5, max: 5 },
            { code: "+501", country: "BZ", min: 7, max: 7 },
            { code: "+502", country: "GT", min: 8, max: 8 },
            { code: "+503", country: "SV", min: 8, max: 8 },
            { code: "+504", country: "HN", min: 8, max: 8 },
            { code: "+505", country: "NI", min: 8, max: 8 },
            { code: "+506", country: "CR", min: 8, max: 8 },
            { code: "+507", country: "PA", min: 7, max: 8 },
            { code: "+508", country: "PM", min: 6, max: 6 },
            { code: "+509", country: "HT", min: 8, max: 8 },
            { code: "+590", country: "GP", min: 9, max: 9 },
            { code: "+591", country: "BO", min: 8, max: 8 },
            { code: "+592", country: "GY", min: 7, max: 7 },
            { code: "+593", country: "EC", min: 9, max: 9 },
            { code: "+594", country: "GF", min: 9, max: 9 },
            { code: "+595", country: "PY", min: 9, max: 9 },
            { code: "+596", country: "MQ", min: 9, max: 9 },
            { code: "+597", country: "SR", min: 7, max: 7 },
            { code: "+598", country: "UY", min: 8, max: 8 },
            { code: "+599", country: "CW", min: 7, max: 8 },
            { code: "+850", country: "KP", min: 10, max: 10 },
            { code: "+852", country: "HK", min: 8, max: 8 },
            { code: "+853", country: "MO", min: 8, max: 8 },
            { code: "+855", country: "KH", min: 8, max: 9 },
            { code: "+856", country: "LA", min: 8, max: 10 },
            { code: "+880", country: "BD", min: 10, max: 10 },
            { code: "+886", country: "TW", min: 9, max: 9 },
            { code: "+960", country: "MV", min: 7, max: 7 },
            { code: "+961", country: "LB", min: 7, max: 8 },
            { code: "+962", country: "JO", min: 9, max: 9 },
            { code: "+963", country: "SY", min: 9, max: 9 },
            { code: "+964", country: "IQ", min: 10, max: 10 },
            { code: "+965", country: "KW", min: 8, max: 8 },
            { code: "+966", country: "SA", min: 9, max: 9 },
            { code: "+967", country: "YE", min: 9, max: 9 },
            { code: "+968", country: "OM", min: 8, max: 8 },
            { code: "+970", country: "PS", min: 9, max: 9 },
            { code: "+971", country: "AE", min: 9, max: 9 },
            { code: "+972", country: "IL", min: 9, max: 9 },
            { code: "+973", country: "BH", min: 8, max: 8 },
            { code: "+974", country: "QA", min: 8, max: 8 },
            { code: "+975", country: "BT", min: 8, max: 8 },
            { code: "+976", country: "MN", min: 8, max: 8 },
            { code: "+977", country: "NP", min: 10, max: 10 },
            { code: "+992", country: "TJ", min: 9, max: 9 },
            { code: "+993", country: "TM", min: 8, max: 8 },
            { code: "+994", country: "AZ", min: 9, max: 9 },
            { code: "+995", country: "GE", min: 9, max: 9 },
            { code: "+996", country: "KG", min: 9, max: 9 },
            { code: "+998", country: "UZ", min: 9, max: 9 }
        ];

        // Sort data numerically
        countryData.sort((a, b) => parseInt(a.code.substring(1)) - parseInt(b.code.substring(1)));

        // Populate dropdown
        countryData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = `${item.code} (${item.country})`;
            if (item.code === '+91') option.selected = true; // Default to India
            countrySelect.appendChild(option);
        });

        // Validation logic
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            const selectedCode = countrySelect.value;
            const rules = countryData.find(c => c.code === selectedCode);
            
            if (rules) {
                if (this.value.length > rules.max) {
                    this.value = this.value.slice(0, rules.max);
                }
            }
        });
    }
});
