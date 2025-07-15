class WeeklyMenuCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._expanded = false;
        this._data = null;
    }

    setConfig(config) {
        this.config = {
            api_url: config.api_url || 'https://projects.lukedev.co.uk/menu/ha_api.php',
            api_key: config.api_key,
            family_id: config.family_id || 1,
            title: config.title || 'Weekly Menu',
            refresh_interval: config.refresh_interval || 300,
            ...config
        };
        
        this.render();
        this.loadData();
        
        if (this.config.refresh_interval > 0) {
            setInterval(() => this.loadData(), this.config.refresh_interval * 1000);
        }
    }

    async loadData() {
        try {
            const url = `${this.config.api_url}?api_key=${this.config.api_key}&family_id=${this.config.family_id}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this._data = data.data;
                this.render();
            } else {
                console.error('Failed to load menu data:', data.error);
            }
        } catch (error) {
            console.error('Error loading menu data:', error);
        }
    }

    render() {
        if (!this._data) {
            this.shadowRoot.innerHTML = '<div style="padding: 20px; text-align: center;">Loading menu...</div>';
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: var(--ha-card-background, #ffffff);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 1px solid #e0e0e0;
                }
                
                .card:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    transform: translateY(-1px);
                }
                
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }
                
                .title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--primary-text-color, #000000);
                    margin: 0;
                }
                
                .expand-icon {
                    font-size: 20px;
                    color: var(--primary-color, #03a9f4);
                    transition: transform 0.3s ease;
                }
                
                .expand-icon.expanded {
                    transform: rotate(180deg);
                }
                
                .today-meal {
                    background: linear-gradient(135deg, #03a9f4, #ff9800);
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    text-align: center;
                }
                
                .today-label {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .meal-text {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                    word-wrap: break-word;
                }
                
                .summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    color: var(--secondary-text-color, #666666);
                }
                
                .progress {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .progress-bar {
                    width: 60px;
                    height: 6px;
                    background: #cccccc;
                    border-radius: 3px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: #03a9f4;
                    transition: width 0.3s ease;
                }
                
                .weekly-menu {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }
                
                .weekly-menu.expanded {
                    max-height: 500px;
                }
                
                .day-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .day-item:last-child {
                    border-bottom: none;
                }
                
                .day-name {
                    font-weight: 500;
                    color: var(--primary-text-color, #000000);
                    min-width: 80px;
                }
                
                .day-meal {
                    color: var(--secondary-text-color, #666666);
                    text-align: right;
                    flex: 1;
                    margin-left: 12px;
                }
                
                .day-meal.empty {
                    font-style: italic;
                    opacity: 0.6;
                }
            </style>
            
            <div class="card" onclick="this.getRootNode().host.toggleExpanded()">
                <div class="header">
                    <h3 class="title">${this.config.title}</h3>
                    <div class="expand-icon ${this._expanded ? 'expanded' : ''}">▼</div>
                </div>
                
                <div class="today-meal">
                    <div class="today-label">Today</div>
                    <div class="meal-text">${this._data.today.meal}</div>
                </div>
                
                <div class="summary">
                    <div class="progress">
                        <span>${this._data.summary.planned_meals}/${this._data.summary.total_days} planned</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this._data.summary.planned_meals / this._data.summary.total_days) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="weekly-menu ${this._expanded ? 'expanded' : ''}">
                    ${this._data.weekly_menu.map(day => `
                        <div class="day-item">
                            <div class="day-name">${day.day}</div>
                            <div class="day-meal ${!day.has_meal ? 'empty' : ''}">${day.dish}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    toggleExpanded() {
        this._expanded = !this._expanded;
        this.render();
    }

    set hass(hass) {
        this.hass = hass;
    }
}

customElements.define('weekly-menu-card', WeeklyMenuCard);

// Register with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'weekly-menu-card',
    name: 'Weekly Menu Card',
    description: 'A card to display your weekly meal plan'
}); 