# Home Assistant Weekly Menu Card Setup

## 1. Install the Custom Card

### Option A: Using HACS (Recommended)
1. Install [HACS](https://hacs.xyz/) if you haven't already
2. Go to HACS → Frontend → "+" → "Custom Repository"
3. Add repository: `https://github.com/your-username/weekly-menu-card`
4. Install the card

### Option B: Manual Installation
1. Copy the `weekly_menu_card.js` file to your Home Assistant `www` folder
2. Add this to your `configuration.yaml`:
```yaml
lovelace:
  mode: storage
  resources:
    - url: /local/weekly_menu_card.js
      type: module
```

## 2. Get Your API Key

1. Log into your menu system at https://projects.lukedev.co.uk/menu
2. Go to Settings → Family Settings
3. Copy your Family API Key

## 3. Add the Card to Your Dashboard

### Using the UI (Recommended)
1. Go to your dashboard
2. Click the three dots → "Edit Dashboard"
3. Click the "+" to add a card
4. Search for "Weekly Menu Card"
5. Configure with:
   - **API URL**: `https://projects.lukedev.co.uk/menu/ha_api.php`
   - **API Key**: Your family API key from step 2
   - **Family ID**: `1` (or your family ID if different)
   - **Title**: "Weekly Menu" (or whatever you prefer)
   - **Refresh Interval**: `300` (5 minutes)

### Using YAML
```yaml
type: custom:weekly-menu-card
api_url: https://projects.lukedev.co.uk/menu/ha_api.php
api_key: your-api-key-here
family_id: 1
title: Weekly Menu
refresh_interval: 300
```

## 4. Features

- **Today's Meal**: Prominently displayed at the top
- **Progress Bar**: Shows how many meals are planned for the week
- **Expandable**: Click to see the full week's menu
- **Auto-refresh**: Updates every 5 minutes (configurable)
- **Responsive**: Works on mobile and desktop
- **Theme-aware**: Uses your Home Assistant theme colors

## 5. Troubleshooting

### Card not loading?
- Check your API key is correct
- Verify the API URL is accessible
- Check browser console for errors

### No data showing?
- Make sure you have meals planned in your menu system
- Check that your family ID is correct
- Verify the API is returning data by visiting the URL directly

### Styling issues?
- The card uses Home Assistant's CSS variables
- It should automatically match your theme
- If not, check your theme configuration

## 6. Example Dashboard Layout

```yaml
views:
  - title: Kitchen
    path: kitchen
    type: custom:grid-layout
    cards:
      - type: custom:weekly-menu-card
        api_url: https://projects.lukedev.co.uk/menu/ha_api.php
        api_key: your-api-key-here
        family_id: 1
        title: Weekly Menu
        grid:
          column: 1
          row: 1
          width: 2
          height: 2
```

## 7. Advanced Configuration

### Custom Styling
You can override the card's appearance by adding CSS to your theme:

```yaml
# In your theme file
weekly-menu-card:
  --ha-card-background: var(--card-background-color)
  --primary-color: var(--primary-color)
  --accent-color: var(--accent-color)
```

### Multiple Families
If you have multiple families, you can add multiple cards:

```yaml
- type: custom:weekly-menu-card
  api_key: family1-api-key
  family_id: 1
  title: Family 1 Menu

- type: custom:weekly-menu-card
  api_key: family2-api-key
  family_id: 2
  title: Family 2 Menu
``` 