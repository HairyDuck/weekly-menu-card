# Weekly Menu for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

A Home Assistant integration that provides sensors for your weekly meal plan and includes beautiful, responsive cards to display the data. Shows today's meal prominently and provides individual day sensors for flexible dashboard layouts.

## Features

- 🍽️ **Individual Day Sensors**: Separate sensors for Monday through Sunday
- 🍽️ **Today's Meal Sensor**: Get today's meal as a sensor
- 🍽️ **Tomorrow's Meal Sensor**: Get tomorrow's meal as a sensor  
- 📊 **Progress Sensor**: Track meal planning progress
- 🎨 **Custom Cards**: Multiple card types for different layouts
  - **Weekly Menu Card**: Complete overview with today/tomorrow highlights
  - **Weekly Menu Day Card**: Individual day cards for mushroom-style layouts
- 🔄 **Auto-refresh**: Updates every 5 minutes
- 📱 **Responsive**: Works on mobile and desktop
- 🎨 **Theme-aware**: Uses your Home Assistant theme colors
- ⚡ **Super Simple Setup**: Only requires your API key

## Installation

### Option 1: HACS (Recommended)

1. Make sure you have [HACS](https://hacs.xyz/) installed
2. Add this repository as a custom repository in HACS:
   - Go to **HACS** → **Integrations**
   - Click **"+"** → **"Custom Repository"**
   - Repository: `https://github.com/HairyDuck/weekly-menu-card`
   - Category: **Integration**
3. Search for "Weekly Menu" in the Integrations section
4. Click **"Download"**
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
4. Enter your **API Key** (that's it!)
5. Click **Submit**

The integration automatically uses:
- **API URL**: `https://projects.lukedev.co.uk/menu/ha_api.php`
- **Family ID**: `1`

### Add Custom Cards (Optional)

For the best experience, add the custom cards:

1. Go to **Settings** → **Dashboards** → **Resources**
2. Click **+ Add Resource**
3. Add these URLs:
   - `http://your-ha-instance/local/weekly_menu_card.js`
   - `http://your-ha-instance/local/weekly_menu_day_card.js`
4. Set resource type to **JavaScript Module**
5. Restart Home Assistant

## Available Sensors

After installation, you'll have these sensors available:

- `sensor.monday_s_meal` - Monday's meal
- `sensor.tuesday_s_meal` - Tuesday's meal
- `sensor.wednesday_s_meal` - Wednesday's meal
- `sensor.thursday_s_meal` - Thursday's meal
- `sensor.friday_s_meal` - Friday's meal
- `sensor.saturday_s_meal` - Saturday's meal
- `sensor.sunday_s_meal` - Sunday's meal
- `sensor.today_s_meal` - Today's meal
- `sensor.tomorrow_s_meal` - Tomorrow's meal
- `sensor.meal_planning_progress` - Planning progress (e.g., "4/7")

## Dashboard Examples

### Simple Entities Card

```yaml
type: entities
title: Weekly Menu
entities:
  - entity: sensor.today_s_meal
    name: Today's Meal
    icon: mdi:food
  - entity: sensor.tomorrow_s_meal
    name: Tomorrow's Meal
    icon: mdi:food-variant
  - entity: sensor.meal_planning_progress
    name: Planning Progress
    icon: mdi:chart-line
```

### Complete Weekly Overview Card

```yaml
type: custom:weekly-menu-card
title: This Week's Meals
show_progress: true
show_today_tomorrow: true
```

### Mushroom-Style Individual Day Cards

```yaml
type: grid
columns: 7
square: true
cards:
  - type: custom:weekly-menu-day-card
    entity: sensor.monday_s_meal
    title: Mon
    show_icon: false
  - type: custom:weekly-menu-day-card
    entity: sensor.tuesday_s_meal
    title: Tue
    show_icon: false
  - type: custom:weekly-menu-day-card
    entity: sensor.wednesday_s_meal
    title: Wed
    show_icon: false
  - type: custom:weekly-menu-day-card
    entity: sensor.thursday_s_meal
    title: Thu
    show_icon: false
  - type: custom:weekly-menu-day-card
    entity: sensor.friday_s_meal
    title: Fri
    show_icon: false
  - type: custom:weekly-menu-day-card
    entity: sensor.saturday_s_meal
    title: Sat
    show_icon: false
  - type: custom:weekly-menu-day-card
    entity: sensor.sunday_s_meal
    title: Sun
    show_icon: false
```

For more examples and detailed configuration options, see [Dashboard Examples](dashboard_examples.md).

## Card Configuration Options

### Weekly Menu Card Options:
- `title` (string): Card title (default: "Weekly Menu")
- `show_progress` (boolean): Show progress indicator (default: true)
- `show_today_tomorrow` (boolean): Show today/tomorrow highlights (default: true)

### Weekly Menu Day Card Options:
- `entity` (string): **Required** - The sensor entity ID
- `title` (string): Card title (default: "Meal")
- `show_icon` (boolean): Show food icon (default: true)

## Screenshots

### Integration Setup
![Integration Setup](https://raw.githubusercontent.com/HairyDuck/weekly-menu-card/main/images/setup.png)

### Weekly Menu Card
![Weekly Menu Card](https://raw.githubusercontent.com/HairyDuck/weekly-menu-card/main/images/card.png)

### Individual Day Cards
![Individual Day Cards](https://raw.githubusercontent.com/HairyDuck/weekly-menu-card/main/images/day-cards.png)

## Troubleshooting

### Integration not showing up?
- Check that the files are in the correct location: `<config>/custom_components/weekly_menu/`
- Restart Home Assistant after installation
- Check the logs for any errors

### Sensors showing "unknown"?
- Verify your API key is correct
- Check that the API URL is accessible
- Look at the sensor attributes for error details
- Check the logs for "Weekly Menu" messages

### Cards not loading?
- Make sure you've added the integration first
- Check browser console for JavaScript errors
- Verify the API is returning data
- Ensure custom card resources are properly loaded

### API Key Issues?
- Make sure you're using the Family API Key, not a user password
- The API key can be found in Settings → Family Settings in your menu system
- Test the API directly: `https://projects.lukedev.co.uk/menu/ha_api.php?api_key=YOUR_KEY&family_id=1`

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