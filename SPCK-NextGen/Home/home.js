// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTags = document.querySelectorAll('.filter-tag');
const blogCards = document.querySelectorAll('.blog-card');

// Search with Enter key
searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

searchBtn?.addEventListener('click', performSearch);

function performSearch() {
    const keyword = searchInput.value.toLowerCase();
    console.log('Searching for:', keyword);
    // Add search logic here
}

// Filter functionality
filterTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        filterTags.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        console.log('Filter selected:', filter);
        // Add filter logic here
    });
});

// Load more functionality
const loadMoreBtn = document.querySelector('.btn-load-more');
loadMoreBtn?.addEventListener('click', () => {
    console.log('Loading more blogs...');
    // Add load-more logic here
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.blog-card, .featured-card').forEach(card => {
    observer.observe(card);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
