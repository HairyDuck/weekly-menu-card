# Weekly Menu Dashboard Examples

This guide shows you how to create beautiful dashboards using the Weekly Menu integration cards.

## Card Types Available

1. **Weekly Menu Card** (`weekly-menu-card`) - Complete weekly overview with today/tomorrow highlights
2. **Weekly Menu Day Card** (`weekly-menu-day-card`) - Individual day cards for mushroom-style layouts

## Installation

First, make sure you have the Weekly Menu integration installed and configured. Then, add the custom cards to your Home Assistant:

1. Go to **Settings** > **Dashboards** > **Resources**
2. Click **+ Add Resource**
3. Add these URLs:
   - `http://your-ha-instance/local/weekly_menu_card.js`
   - `http://your-ha-instance/local/weekly_menu_day_card.js`
4. Set resource type to **JavaScript Module**
5. Restart Home Assistant

## Example 1: Complete Weekly Overview

This creates a comprehensive weekly menu dashboard:

```yaml
type: vertical-stack
title: Weekly Family Menu
cards:
  # Main weekly overview card
  - type: custom:weekly-menu-card
    title: This Week's Meals
    show_progress: true
    show_today_tomorrow: true
```

## Example 2: Mushroom-Style Individual Day Cards

Create individual cards for each day in a mushroom-style layout:

```yaml
type: vertical-stack
title: Weekly Menu - Individual Days
cards:
  # Today and Tomorrow highlighted
  - type: horizontal-stack
    cards:
      - type: custom:weekly-menu-day-card
        entity: sensor.today_s_meal
        title: Today
        show_icon: true
      - type: custom:weekly-menu-day-card
        entity: sensor.tomorrow_s_meal
        title: Tomorrow
        show_icon: true
  
  # Rest of the week
  - type: grid
    columns: 5
    square: false
    cards:
      - type: custom:weekly-menu-day-card
        entity: sensor.monday_s_meal
        title: Monday
        show_icon: false
      - type: custom:weekly-menu-day-card
        entity: sensor.tuesday_s_meal
        title: Tuesday
        show_icon: false
      - type: custom:weekly-menu-day-card
        entity: sensor.wednesday_s_meal
        title: Wednesday
        show_icon: false
      - type: custom:weekly-menu-day-card
        entity: sensor.thursday_s_meal
        title: Thursday
        show_icon: false
      - type: custom:weekly-menu-day-card
        entity: sensor.friday_s_meal
        title: Friday
        show_icon: false
  
  # Weekend
  - type: horizontal-stack
    cards:
      - type: custom:weekly-menu-day-card
        entity: sensor.saturday_s_meal
        title: Saturday
        show_icon: false
      - type: custom:weekly-menu-day-card
        entity: sensor.sunday_s_meal
        title: Sunday
        show_icon: false
```

## Example 3: Compact Dashboard

A compact version showing just the essentials:

```yaml
type: vertical-stack
title: Quick Menu Overview
cards:
  # Progress indicator
  - type: entities
    title: Meal Planning Progress
    entities:
      - entity: sensor.meal_planning_progress
        name: Progress
        icon: mdi:chart-line
  
  # Today and Tomorrow
  - type: horizontal-stack
    cards:
      - type: custom:weekly-menu-day-card
        entity: sensor.today_s_meal
        title: Today
      - type: custom:weekly-menu-day-card
        entity: sensor.tomorrow_s_meal
        title: Tomorrow
  
  # Weekly grid
  - type: grid
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

## Example 4: Kitchen Dashboard

Perfect for a kitchen tablet or display:

```yaml
type: vertical-stack
title: Kitchen Menu Board
cards:
  # Large today display
  - type: custom:weekly-menu-day-card
    entity: sensor.today_s_meal
    title: Today's Meal
    show_icon: true
  
  # Tomorrow preview
  - type: custom:weekly-menu-day-card
    entity: sensor.tomorrow_s_meal
    title: Tomorrow
    show_icon: true
  
  # Weekly overview
  - type: custom:weekly-menu-card
    title: This Week
    show_progress: true
    show_today_tomorrow: false
```

## Example 5: Mobile-Friendly Layout

Optimized for mobile devices:

```yaml
type: vertical-stack
title: Mobile Menu View
cards:
  # Today's meal prominently displayed
  - type: custom:weekly-menu-day-card
    entity: sensor.today_s_meal
    title: Today
    show_icon: true
  
  # Progress indicator
  - type: entities
    entities:
      - entity: sensor.meal_planning_progress
        name: Planning Progress
    show_header_toggle: false
  
  # Weekly menu in a single column
  - type: custom:weekly-menu-card
    title: Weekly Menu
    show_progress: false
    show_today_tomorrow: false
```

## Card Configuration Options

### Weekly Menu Card Options:
- `title` (string): Card title (default: "Weekly Menu")
- `show_progress` (boolean): Show progress indicator (default: true)
- `show_today_tomorrow` (boolean): Show today/tomorrow highlights (default: true)

### Weekly Menu Day Card Options:
- `entity` (string): **Required** - The sensor entity ID
- `title` (string): Card title (default: "Meal")
- `show_icon` (boolean): Show food icon (default: true)

## Available Sensors

After installing the integration, you'll have these sensors available:

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

## Tips for Best Results

1. **Use grid layouts** for consistent spacing with individual day cards
2. **Highlight today/tomorrow** with larger cards or different styling
3. **Show progress** to encourage meal planning completion
4. **Use icons sparingly** to avoid visual clutter
5. **Consider mobile layouts** with single-column arrangements
6. **Group related information** using horizontal-stack and vertical-stack

## Troubleshooting

If cards don't appear:
1. Check that the integration is properly installed and configured
2. Verify the sensor entities exist in Developer Tools > States
3. Ensure the custom card resources are properly loaded
4. Check the browser console for JavaScript errors
5. Restart Home Assistant if needed 