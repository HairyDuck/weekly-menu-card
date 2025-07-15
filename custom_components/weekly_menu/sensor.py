"""Sensor platform for Weekly Menu integration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.rest import RestData
from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import StateType

from .const import DOMAIN, DEFAULT_API_URL

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Weekly Menu sensor."""
    config = config_entry.data
    
    api_url = config.get("api_url", DEFAULT_API_URL)
    api_key = config["api_key"]
    family_id = config.get("family_id", 1)
    
    # Create REST data object
    rest = RestData(
        hass,
        "GET",
        f"{api_url}?api_key={api_key}&family_id={family_id}",
        None,
        None,
        None,
        False,
        10,
    )
    
    # Add sensors
    async_add_entities([
        WeeklyMenuTodaySensor(rest, "Today's Meal", "today_meal"),
        WeeklyMenuTomorrowSensor(rest, "Tomorrow's Meal", "tomorrow_meal"),
        WeeklyMenuProgressSensor(rest, "Meal Planning Progress", "meal_progress"),
    ])


class WeeklyMenuBaseSensor(SensorEntity):
    """Base class for Weekly Menu sensors."""

    def __init__(self, rest: RestData, name: str, unique_id: str) -> None:
        """Initialize the sensor."""
        self._rest = rest
        self._attr_name = name
        self._attr_unique_id = f"weekly_menu_{unique_id}"
        self._attr_native_value = None
        self._attr_extra_state_attributes = {}

    async def async_update(self) -> None:
        """Update the sensor."""
        await self._rest.async_update()
        
        if self._rest.data is None:
            return
            
        try:
            data = self._rest.json_data()
            if data and data.get("success"):
                self._update_from_data(data["data"])
        except Exception as err:
            _LOGGER.error("Error updating Weekly Menu sensor: %s", err)

    def _update_from_data(self, data: dict[str, Any]) -> None:
        """Update sensor from API data."""
        # Override in subclasses
        pass


class WeeklyMenuTodaySensor(WeeklyMenuBaseSensor):
    """Sensor for today's meal."""

    def _update_from_data(self, data: dict[str, Any]) -> None:
        """Update sensor from API data."""
        today_data = data.get("today", {})
        self._attr_native_value = today_data.get("meal", "No meal planned")
        self._attr_extra_state_attributes = {
            "day": today_data.get("day", ""),
            "last_updated": data.get("last_updated", "")
        }


class WeeklyMenuTomorrowSensor(WeeklyMenuBaseSensor):
    """Sensor for tomorrow's meal."""

    def _update_from_data(self, data: dict[str, Any]) -> None:
        """Update sensor from API data."""
        tomorrow_data = data.get("tomorrow", {})
        self._attr_native_value = tomorrow_data.get("meal", "No meal planned")
        self._attr_extra_state_attributes = {
            "day": tomorrow_data.get("day", ""),
            "last_updated": data.get("last_updated", "")
        }


class WeeklyMenuProgressSensor(WeeklyMenuBaseSensor):
    """Sensor for meal planning progress."""

    def _update_from_data(self, data: dict[str, Any]) -> None:
        """Update sensor from API data."""
        summary = data.get("summary", {})
        planned = summary.get("planned_meals", 0)
        total = summary.get("total_days", 7)
        
        self._attr_native_value = f"{planned}/{total}"
        self._attr_extra_state_attributes = {
            "planned_meals": planned,
            "total_days": total,
            "unplanned_meals": summary.get("unplanned_meals", 0),
            "last_updated": data.get("last_updated", "")
        } 