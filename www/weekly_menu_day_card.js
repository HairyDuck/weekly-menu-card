class WeeklyMenuDayCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        this.config = {
            entity: config.entity,
            title: config.title || 'Meal',
            show_icon: true,
            ...config
        };
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .day-card {
                    background: var(--ha-card-background, #fff);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    font-family: var(--mdc-typography-font-family, Roboto, sans-serif);
                    border: 2px solid var(--divider-color, #e0e0e0);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    text-align: center;
                }
                
                .day-card:hover {
                    border-color: var(--accent-color, #03dac6);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .day-card.has-meal {
                    border-color: var(--accent-color, #03dac6);
                    background: linear-gradient(135deg, rgba(3, 218, 198, 0.1), rgba(33, 150, 243, 0.1));
                }
                
                .day-card.today {
                    border-color: #ff6b6b;
                    background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
                }
                
                .day-card.tomorrow {
                    border-color: #4ecdc4;
                    background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(68, 160, 141, 0.1));
                }
                
                .card-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                    gap: 8px;
                }
                
                .card-icon {
                    font-size: 20px;
                    color: var(--accent-color, #03dac6);
                }
                
                .card-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--primary-text-color, #212121);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .meal-content {
                    font-size: 14px;
                    color: var(--secondary-text-color, #757575);
                    line-height: 1.4;
                    word-break: break-word;
                    margin: 0;
                }
                
                .meal-content.has-meal {
                    color: var(--primary-text-color, #212121);
                    font-weight: 500;
                }
                
                .no-meal {
                    color: var(--disabled-text-color, #bdbdbd);
                    font-style: italic;
                }
                
                .loading {
                    color: var(--secondary-text-color, #757575);
                    font-style: italic;
                }
                
                .error {
                    color: #f44336;
                    font-size: 12px;
                }
            </style>
            
            <ha-card class="day-card" id="day-card">
                <div class="card-header">
                    ${this.config.show_icon ? '<div class="card-icon">🍽️</div>' : ''}
                    <h3 class="card-title">${this.config.title}</h3>
                </div>
                <p class="meal-content" id="meal-content">Loading...</p>
            </ha-card>
        `;
        
        this.updateContent();
    }

    set hass(hass) {
        this.hass = hass;
        this.updateContent();
    }

    updateContent() {
        if (!this.hass || !this.config.entity) return;
        
        const entity = this.hass.states[this.config.entity];
        const card = this.shadowRoot.getElementById('day-card');
        const content = this.shadowRoot.getElementById('meal-content');
        
        if (!entity) {
            content.innerHTML = '<span class="error">Entity not found</span>';
            return;
        }
        
        const meal = entity.state;
        const hasMeal = meal !== 'No meal planned' && meal !== 'unknown';
        
        // Update card styling
        card.className = 'day-card';
        if (hasMeal) {
            card.classList.add('has-meal');
        }
        
        // Check if this is today or tomorrow
        const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
        const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'lowercase' });
        
        if (this.config.entity.includes(today)) {
            card.classList.add('today');
        } else if (this.config.entity.includes(tomorrow)) {
            card.classList.add('tomorrow');
        }
        
        // Update content
        if (hasMeal) {
            content.textContent = meal;
            content.className = 'meal-content has-meal';
        } else {
            content.innerHTML = '<span class="no-meal">No meal planned</span>';
            content.className = 'meal-content';
        }
    }

    getCardSize() {
        return 1;
    }
}

customElements.define('weekly-menu-day-card', WeeklyMenuDayCard); 