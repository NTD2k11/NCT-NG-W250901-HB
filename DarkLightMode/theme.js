(() => {
    const root = document.documentElement;

    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    }

    function updateToggleIcons(theme) {
        // Update any .btn-icon that contains a fa-moon/fa-sun icon
        document.querySelectorAll('.btn-icon').forEach(btn => {
            const icon = btn.querySelector('i');
            if (!icon) return;
            const cls = icon.className || '';
            if (cls.includes('fa-moon') || cls.includes('fa-sun')) {
                // remove both then add the correct one
                icon.classList.remove('fa-moon', 'fa-sun');
                if (theme === 'dark') icon.classList.add('fa-sun');
                else icon.classList.add('fa-moon');
            }
        });
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleIcons(theme);
    }

    const initial = getPreferredTheme();
    applyTheme(initial);

    // Attach toggle to existing buttons that show a moon/sun icon
    document.querySelectorAll('.btn-icon').forEach(btn => {
        const icon = btn.querySelector('i');
        if (!icon) return;
        const cls = icon.className || '';
        if (cls.includes('fa-moon') || cls.includes('fa-sun')) {
            btn.addEventListener('click', () => {
                const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }
    });

})();
