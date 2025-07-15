# Weekly Menu Card

A beautiful, responsive card for Home Assistant that displays your weekly meal plan. Shows today's meal prominently and expands to show the full week when clicked.

## Features

- 🍽️ **Today's Meal**: Prominently displayed at the top
- 📊 **Progress Bar**: Shows how many meals are planned for the week
- 📱 **Expandable**: Click to see the full week's menu
- 🔄 **Auto-refresh**: Updates every 5 minutes (configurable)
- 📱 **Responsive**: Works on mobile and desktop
- 🎨 **Theme-aware**: Uses your Home Assistant theme colors

## Requirements

- Home Assistant 2023.8.0 or higher
- A compatible menu system API (like the one at https://projects.lukedev.co.uk/menu)

## Installation

1. Add this repository as a custom repository in HACS
2. Search for "Weekly Menu Card" in the Frontend section
3. Click "Download"
4. Restart Home Assistant

## Configuration

### Get Your API Key

1. Log into your menu system at https://projects.lukedev.co.uk/menu
2. Go to Settings → Family Settings
3. Copy your Family API Key

### Add the Card

1. Go to your dashboard
2. Click the three dots → "Edit Dashboard"
3. Click the "+" to add a card
4. Search for "Weekly Menu Card"
5. Configure with your settings

### Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `api_url` | string | `https://projects.lukedev.co.uk/menu/ha_api.php` | URL of your menu API |
| `api_key` | string | **Required** | Your family API key |
| `family_id` | number | `1` | Your family ID |
| `title` | string | `Weekly Menu` | Card title |
| `refresh_interval` | number | `300` | Refresh interval in seconds (0 to disable) |

### Example Configuration

```yaml
type: custom:weekly-menu-card
api_url: https://projects.lukedev.co.uk/menu/ha_api.php
api_key: your-api-key-here
family_id: 1
title: Weekly Menu
refresh_interval: 300
```

## Support

If you have any issues or questions, please open an issue on GitHub.

## License

This project is licensed under the MIT License. 