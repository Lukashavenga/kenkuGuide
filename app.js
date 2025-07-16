// D&D Character Guide JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeNavigation();
    initializeSmoothScrolling();
    initializeInteractiveElements();
    initializePrintSupport();
    initializeAccessibility();
    initializeThemeToggle();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add active state handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Update active navigation based on scroll position
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

/**
 * Update active navigation item based on scroll position
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    // Update active navigation item
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize interactive elements
 */
function initializeInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .trait-card, .feature-card, .combat-card, .roleplay-card, .equipment-card, .level-card, .question-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Add click-to-copy functionality for spell names
    const spellNames = document.querySelectorAll('.spell-name');
    
    spellNames.forEach(spellName => {
        spellName.style.cursor = 'pointer';
        spellName.title = 'Click to copy spell name';
        
        spellName.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const spellText = this.textContent.trim();
            copyToClipboard(spellText);
            showTooltip(this, 'Copied!');
            
            // Visual feedback
            const originalBg = this.style.backgroundColor;
            this.style.backgroundColor = 'var(--color-success)';
            this.style.color = 'var(--color-btn-primary-text)';
            
            setTimeout(() => {
                this.style.backgroundColor = originalBg;
                this.style.color = '';
            }, 200);
        });
    });
    
    // Add ability score calculator
    initializeAbilityScoreCalculator();
    
    // Add spell stat interactions
    initializeSpellStats();
}

/**
 * Initialize spell stat interactions
 */
function initializeSpellStats() {
    const spellStats = document.querySelectorAll('.spell-stat');
    
    spellStats.forEach(stat => {
        stat.addEventListener('click', function() {
            const text = this.textContent;
            if (text.includes('Spell Attack Bonus')) {
                showTooltip(this, 'Charisma modifier (+2) + Proficiency bonus (+2)');
            } else if (text.includes('Spell Save DC')) {
                showTooltip(this, '8 + Charisma modifier (+2) + Proficiency bonus (+2)');
            } else if (text.includes('Spellcasting Ability')) {
                showTooltip(this, 'All bard spells use Charisma as the spellcasting ability');
            }
        });
    });
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
            function() {
                console.log('Text copied to clipboard: ' + text);
            },
            function(err) {
                console.error('Failed to copy text: ', err);
                fallbackCopyTextToClipboard(text);
            }
        );
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        console.log('Fallback: Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
    } catch (err) {
        console.error('Fallback: Unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show tooltip message
 */
function showTooltip(element, message) {
    // Remove any existing tooltips
    const existingTooltips = document.querySelectorAll('.tooltip');
    existingTooltips.forEach(tooltip => tooltip.remove());
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top + scrollTop - 35) + 'px';
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 2000);
}

/**
 * Initialize ability score calculator
 */
function initializeAbilityScoreCalculator() {
    const abilityScores = document.querySelectorAll('.ability-score');
    
    abilityScores.forEach(score => {
        score.addEventListener('click', function() {
            const scoreText = this.textContent.trim();
            const match = scoreText.match(/(\d+)\s*\(([+-]\d+)\)/);
            
            if (match) {
                const scoreValue = parseInt(match[1]);
                const modifier = match[2];
                const savingThrow = getSavingThrowBonus(this, modifier);
                
                showTooltip(this, `Score: ${scoreValue}, Modifier: ${modifier}, Save: ${savingThrow}`);
            }
        });
    });
}

/**
 * Get saving throw bonus for ability score
 */
function getSavingThrowBonus(element, modifier) {
    const abilityName = element.parentElement.querySelector('.ability-name').textContent;
    const proficiencyBonus = 2; // Level 4 character
    const mod = parseInt(modifier);
    
    // Bards are proficient in Dexterity and Charisma saves
    if (abilityName === 'DEX' || abilityName === 'CHA') {
        const total = mod + proficiencyBonus;
        return total >= 0 ? '+' + total : total.toString();
    }
    
    return modifier;
}

/**
 * Initialize print support
 */
function initializePrintSupport() {
    // Add print button
    const printButton = document.createElement('button');
    printButton.className = 'btn btn--secondary fixed-button';
    printButton.innerHTML = '🖨️ Print';
    printButton.title = 'Print Character Guide';
    printButton.style.cssText = `
        bottom: 80px;
        right: 20px;
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
    
    // Hide print button when printing
    window.addEventListener('beforeprint', function() {
        printButton.style.display = 'none';
    });
    
    window.addEventListener('afterprint', function() {
        printButton.style.display = 'inline-flex';
    });
}

/**
 * Add accessibility improvements
 */
function initializeAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ARIA labels to navigation
    const nav = document.querySelector('.navigation');
    if (nav) {
        nav.setAttribute('aria-label', 'Character guide navigation');
    }
    
    // Add ARIA labels to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        const heading = section.querySelector('h2');
        if (heading) {
            const id = heading.id || `section-${section.id || index}`;
            heading.id = id;
            section.setAttribute('aria-labelledby', id);
        }
    });
    
    // Add main content landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
}

/**
 * Add theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn--secondary fixed-button';
    themeToggle.innerHTML = '🌙';
    themeToggle.title = 'Toggle dark mode';
    themeToggle.style.cssText = `
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    `;
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Save preference if localStorage is available
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.log('localStorage not available');
        }
    });
    
    // Load saved theme preference
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
            themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    } catch (e) {
        console.log('localStorage not available');
    }
    
    document.body.appendChild(themeToggle);
}

/**
 * Throttle function to limit function calls
 */
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
    };
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // Allow navigation with arrow keys
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                window.scrollBy(0, -100);
                break;
            case 'ArrowDown':
                e.preventDefault();
                window.scrollBy(0, 100);
                break;
            case 'Home':
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'End':
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                break;
        }
    }
});

/**
 * Initialize spell details expansion
 */
function initializeSpellDetails() {
    const spellItems = document.querySelectorAll('.spell-list li');
    
    spellItems.forEach(item => {
        item.addEventListener('click', function() {
            const spellName = this.querySelector('.spell-name');
            if (spellName) {
                const spellText = spellName.textContent.trim();
                showSpellDetails(spellText, spellName);
            }
        });
    });
}

/**
 * Show spell details in a tooltip
 */
function showSpellDetails(spellName, element) {
    const spellData = getSpellData(spellName);
    if (spellData) {
        showTooltip(element, spellData);
    }
}

/**
 * Get spell data (simplified version)
 */
function getSpellData(spellName) {
    const spells = {
        'Vicious Mockery': 'Cantrip • Enchantment • Verbal • 60 ft • Wisdom save',
        'Message': 'Cantrip • Transmutation • Verbal, Somatic, Material • 120 ft • 1 round',
        'Thunderclap': 'Cantrip • Evocation • Somatic • 5 ft radius • Constitution save',
        'Disguise Self': '1st level • Illusion • Verbal, Somatic • Self • 1 hour',
        'Dissonant Whispers': '1st level • Enchantment • Verbal • 60 ft • Wisdom save',
        'Faerie Fire': '1st level • Evocation • Verbal • 60 ft • Dexterity save',
        'Healing Word': '1st level • Evocation • Verbal • 60 ft • Bonus action',
        'Crown of Madness': '2nd level • Enchantment • Verbal, Somatic • 120 ft • Wisdom save',
        'Knock': '2nd level • Transmutation • Verbal • 60 ft • Instantaneous',
        'Suggestion': '2nd level • Enchantment • Verbal, Material • 30 ft • Wisdom save'
    };
    
    return spells[spellName] || null;
}

// Initialize spell details when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSpellDetails);