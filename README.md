# Weekly Menu Card for Home Assistant

A beautiful, responsive card for Home Assistant that displays your weekly meal plan. Shows today's meal prominently and expands to show the full week when clicked.

## Features

- 🍽️ **Today's Meal**: Prominently displayed at the top
- 📊 **Progress Bar**: Shows how many meals are planned for the week
- 📱 **Expandable**: Click to see the full week's menu
- 🔄 **Auto-refresh**: Updates every 5 minutes (configurable)
- 📱 **Responsive**: Works on mobile and desktop
- 🎨 **Theme-aware**: Uses your Home Assistant theme colors

## Installation

### Option 1: HACS (Recommended)

1. Make sure you have [HACS](https://hacs.xyz/) installed
2. Add this repository as a custom repository in HACS
3. Search for "Weekly Menu Card" in the Frontend section
4. Click "Download"
5. Restart Home Assistant

### Option 2: Manual Installation

1. Download the `weekly_menu_card.js` file
2. Place it in your `<config>/www/` folder
3. Add the following to your `configuration.yaml`:

```yaml
lovelace:
  mode: storage
  resources:
    - url: /local/weekly_menu_card.js
      type: module
```

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

## Screenshots

![Card collapsed](https://raw.githubusercontent.com/HairyDuck/weekly-menu-card/main/images/card-collapsed.png)
![Card expanded](https://raw.githubusercontent.com/HairyDuck/weekly-menu-card/main/images/card-expanded.png)

## Troubleshooting

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

**Note**: This card requires a compatible menu system API. Make sure your menu system supports the required API endpoints. 