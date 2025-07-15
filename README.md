# Weekly Menu for Home Assistant

A Home Assistant integration that provides sensors for your weekly meal plan and includes a beautiful, responsive card to display the data. Shows today's meal prominently and expands to show the full week when clicked.

## Features

- 🍽️ **Today's Meal Sensor**: Get today's meal as a sensor
- 🍽️ **Tomorrow's Meal Sensor**: Get tomorrow's meal as a sensor  
- 📊 **Progress Sensor**: Track meal planning progress
- 🎨 **Custom Card**: Beautiful expandable card for dashboard display
- 🔄 **Auto-refresh**: Updates every 5 minutes
- 📱 **Responsive**: Works on mobile and desktop
- 🎨 **Theme-aware**: Uses your Home Assistant theme colors

## Installation

### Option 1: HACS (Recommended)

1. Make sure you have [HACS](https://hacs.xyz/) installed
2. Add this repository as a custom repository in HACS
3. Search for "Weekly Menu" in the Integrations section
4. Click "Download"
5. Restart Home Assistant

### Option 2: Manual Installation

1. Download the `custom_components/weekly_menu` folder
2. Place it in your `<config>/custom_components/` folder
3. Restart Home Assistant

## Configuration

### Get Your API Key

1. Log into your menu system at https://projects.lukedev.co.uk/menu
2. Go to Settings → Family Settings
3. Copy your Family API Key

### Add the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **"+ ADD INTEGRATION"**
3. Search for "Weekly Menu"
4. Enter your configuration:
   - **API URL**: `https://projects.lukedev.co.uk/menu/ha_api.php`
   - **API Key**: Your family API key
   - **Family ID**: `1` (or your family ID)

### Add the Custom Card

1. Go to your dashboard
2. Click the three dots → "Edit Dashboard"
3. Click the "+" to add a card
4. Search for "Weekly Menu Card"
5. Configure with your settings

### Card Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `api_url` | string | `https://projects.lukedev.co.uk/menu/ha_api.php` | URL of your menu API |
| `api_key` | string | **Required** | Your family API key |
| `family_id` | number | `1` | Your family ID |
| `title` | string | `Weekly Menu` | Card title |
| `refresh_interval` | number | `300` | Refresh interval in seconds (0 to disable) |

### Example Card Configuration

```yaml
type: custom:weekly-menu-card
api_url: https://projects.lukedev.co.uk/menu/ha_api.php
api_key: your-api-key-here
family_id: 1
title: Weekly Menu
refresh_interval: 300
```

## Available Sensors

After installation, you'll have these sensors available:

- `sensor.todays_meal` - Today's planned meal
- `sensor.tomorrows_meal` - Tomorrow's planned meal  
- `sensor.meal_planning_progress` - Progress (e.g., "5/7 planned")

## Example Dashboard

```yaml
type: entities
title: Weekly Menu
entities:
  - entity: sensor.todays_meal
    name: Today's Meal
    icon: mdi:food
  - entity: sensor.tomorrows_meal
    name: Tomorrow's Meal
    icon: mdi:food-variant
  - entity: sensor.meal_planning_progress
    name: Planning Progress
    icon: mdi:calendar-check
```

## Troubleshooting

### Integration not showing up?
- Check that the files are in the correct location: `<config>/custom_components/weekly_menu/`
- Restart Home Assistant after installation
- Check the logs for any errors

### Sensors not updating?
- Verify your API key is correct
- Check that the API URL is accessible
- Look at the sensor attributes for error details

### Card not loading?
- Make sure you've added the integration first
- Check browser console for JavaScript errors
- Verify the API is returning data

## Support

If you have any issues or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Open an issue on GitHub
3. Join the Home Assistant community

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [HairyDuck](https://github.com/HairyDuck)

---

**Note**: This integration requires a compatible menu system API. Make sure your menu system supports the required API endpoints. 