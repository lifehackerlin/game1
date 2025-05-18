// 深色模式管理
const DarkMode = {
    init() {
        this.darkModeToggle = document.querySelector('button i.fa-moon');
        this.setupEventListeners();
        this.loadPreference();
    },

    setupEventListeners() {
        this.darkModeToggle.addEventListener('click', () => this.toggle());
    },

    toggle() {
        document.documentElement.classList.toggle('dark');
        this.darkModeToggle.classList.toggle('fa-moon');
        this.darkModeToggle.classList.toggle('fa-sun');
        this.savePreference();
    },

    loadPreference() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark');
            this.darkModeToggle.classList.remove('fa-moon');
            this.darkModeToggle.classList.add('fa-sun');
        }
    },

    savePreference() {
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    }
};

// 搜索功能
const Search = {
    init() {
        this.searchInput = document.querySelector('input[type="text"]');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    },

    performSearch() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            window.location.href = `/search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }
};

// 分类筛选
const CategoryFilter = {
    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filter(button));
        });
    },

    filter(selectedButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('bg-funion-primary', 'text-white');
            btn.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-white');
        });
        selectedButton.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-white');
        selectedButton.classList.add('bg-funion-primary', 'text-white');
    }
};

// 图片懒加载
const LazyLoad = {
    init() {
        this.images = document.querySelectorAll('img[data-src]');
        this.setupIntersectionObserver();
    },

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(image => observer.observe(image));
    },

    loadImage(image) {
        const src = image.getAttribute('data-src');
        if (!src) return;
        
        image.src = src;
        image.removeAttribute('data-src');
        image.classList.remove('img-placeholder');
    }
};

// 表单验证
const FormValidation = {
    init() {
        this.forms = document.querySelectorAll('form');
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e, form));
        });
    },

    validateForm(e, form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showError(field, '此字段为必填项');
            } else {
                this.clearError(field);
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    },

    showError(field, message) {
        const errorDiv = field.nextElementSibling?.classList.contains('error-message')
            ? field.nextElementSibling
            : document.createElement('div');
        
        errorDiv.textContent = message;
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        
        if (!field.nextElementSibling?.classList.contains('error-message')) {
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        
        field.classList.add('border-red-500');
    },

    clearError(field) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
            errorDiv.remove();
        }
        field.classList.remove('border-red-500');
    }
};

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    DarkMode.init();
    Search.init();
    CategoryFilter.init();
    LazyLoad.init();
    FormValidation.init();
}); 