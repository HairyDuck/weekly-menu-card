class WeeklyMenuCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        this.config = {
            title: 'Weekly Menu',
            show_progress: true,
            show_today_tomorrow: true,
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
                
                .weekly-menu-card {
                    background: var(--ha-card-background, #fff);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    font-family: var(--mdc-typography-font-family, Roboto, sans-serif);
                }
                
                .card-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--divider-color, #e0e0e0);
                }
                
                .card-title {
                    font-size: 18px;
                    font-weight: 500;
                    color: var(--primary-text-color, #212121);
                    margin: 0;
                    flex-grow: 1;
                }
                
                .progress-indicator {
                    background: var(--accent-color, #03dac6);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .today-tomorrow-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                
                .today-card, .tomorrow-card {
                    background: linear-gradient(135deg, var(--accent-color, #03dac6), var(--primary-color, #2196f3));
                    color: white;
                    padding: 16px;
                    border-radius: 12px;
                    text-align: center;
                }
                
                .today-card {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                }
                
                .tomorrow-card {
                    background: linear-gradient(135deg, #4ecdc4, #44a08d);
                }
                
                .day-label {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-bottom: 4px;
                }
                
                .meal-text {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                    word-break: break-word;
                }
                
                .weekly-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 12px;
                }
                
                .day-card {
                    background: var(--ha-card-background, #fff);
                    border: 2px solid var(--divider-color, #e0e0e0);
                    border-radius: 12px;
                    padding: 12px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
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
                
                .day-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--primary-text-color, #212121);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .day-meal {
                    font-size: 13px;
                    color: var(--secondary-text-color, #757575);
                    margin: 0;
                    line-height: 1.3;
                    word-break: break-word;
                }
                
                .day-meal.has-meal {
                    color: var(--primary-text-color, #212121);
                    font-weight: 500;
                }
                
                .no-meal {
                    color: var(--disabled-text-color, #bdbdbd);
                    font-style: italic;
                }
                
                .loading {
                    text-align: center;
                    padding: 20px;
                    color: var(--secondary-text-color, #757575);
                }
                
                .error {
                    background: #ffebee;
                    color: #c62828;
                    padding: 12px;
                    border-radius: 8px;
                    margin: 8px 0;
                }
                
                @media (max-width: 600px) {
                    .weekly-grid {
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 8px;
                    }
                    
                    .today-tomorrow-section {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                }
            </style>
            
            <ha-card class="weekly-menu-card">
                <div class="card-header">
                    <h2 class="card-title">${this.config.title}</h2>
                    ${this.config.show_progress ? '<div class="progress-indicator" id="progress"></div>' : ''}
                </div>
                
                ${this.config.show_today_tomorrow ? `
                    <div class="today-tomorrow-section">
                        <div class="today-card">
                            <div class="day-label">Today</div>
                            <p class="meal-text" id="today-meal">Loading...</p>
                        </div>
                        <div class="tomorrow-card">
                            <div class="day-label">Tomorrow</div>
                            <p class="meal-text" id="tomorrow-meal">Loading...</p>
                        </div>
                    </div>
                ` : ''}
                
                <div class="weekly-grid" id="weekly-grid">
                    <div class="loading">Loading weekly menu...</div>
                </div>
            </ha-card>
        `;
        
        this.updateContent();
    }

    set hass(hass) {
        this.hass = hass;
        this.updateContent();
    }

    updateContent() {
        if (!this.hass) return;
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        // Update progress
        if (this.config.show_progress) {
            const progressEntity = this.hass.states['sensor.meal_planning_progress'];
            if (progressEntity) {
                this.shadowRoot.getElementById('progress').textContent = progressEntity.state;
            }
        }
        
        // Update today/tomorrow
        if (this.config.show_today_tomorrow) {
            const todayEntity = this.hass.states['sensor.today_s_meal'];
            const tomorrowEntity = this.hass.states['sensor.tomorrow_s_meal'];
            
            if (todayEntity) {
                this.shadowRoot.getElementById('today-meal').textContent = todayEntity.state;
            }
            
            if (tomorrowEntity) {
                this.shadowRoot.getElementById('tomorrow-meal').textContent = tomorrowEntity.state;
            }
        }
        
        // Update weekly grid
        const weeklyGrid = this.shadowRoot.getElementById('weekly-grid');
        if (!weeklyGrid) return;
        
        let hasData = false;
        let gridHTML = '';
        
        days.forEach(day => {
            const entityId = `sensor.${day}_s_meal`;
            const entity = this.hass.states[entityId];
            
            if (entity) {
                hasData = true;
                const meal = entity.state;
                const hasMeal = meal !== 'No meal planned' && meal !== 'unknown';
                const mealClass = hasMeal ? 'has-meal' : '';
                const cardClass = hasMeal ? 'day-card has-meal' : 'day-card';
                
                gridHTML += `
                    <div class="${cardClass}">
                        <div class="day-name">${day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        <p class="day-meal ${mealClass}">${hasMeal ? meal : '<span class="no-meal">No meal planned</span>'}</p>
                    </div>
                `;
            }
        });
        
        if (hasData) {
            weeklyGrid.innerHTML = gridHTML;
        } else {
            weeklyGrid.innerHTML = '<div class="loading">No menu data available</div>';
        }
    }

    getCardSize() {
        return 3;
    }
}

customElements.define('weekly-menu-card', WeeklyMenuCard);

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'weekly-menu-card',
    name: 'Weekly Menu Card',
    description: 'A card to display your weekly meal plan',
    preview: true
}); 