"""Sensor platform for Weekly Menu integration."""
from __future__ import annotations

import logging
import aiohttp
from typing import Any
from datetime import timedelta

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import StateType
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

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
    
    # Create coordinator
    coordinator = WeeklyMenuCoordinator(hass, api_url, api_key, family_id)
    
    # Start the coordinator
    await coordinator.async_config_entry_first_refresh()
    
    # Add sensors for each day of the week
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    entities = []
    
    # Add individual day sensors
    for day in days:
        entities.append(WeeklyMenuDaySensor(coordinator, day.capitalize(), day))
    
    # Add summary sensors
    entities.extend([
        WeeklyMenuTodaySensor(coordinator, "Today's Meal", "today_meal"),
        WeeklyMenuTomorrowSensor(coordinator, "Tomorrow's Meal", "tomorrow_meal"),
        WeeklyMenuProgressSensor(coordinator, "Meal Planning Progress", "meal_progress"),
    ])
    
    async_add_entities(entities)


class WeeklyMenuCoordinator(DataUpdateCoordinator):
    """Class to manage fetching Weekly Menu data."""

    def __init__(self, hass: HomeAssistant, api_url: str, api_key: str, family_id: int):
        """Initialize."""
        self.api_url = api_url
        self.api_key = api_key
        self.family_id = family_id
        
        super().__init__(
            hass,
            _LOGGER,
            name="Weekly Menu",
            update_interval=timedelta(minutes=5),
        )

    async def _async_update_data(self):
        """Update data via API."""
        try:
            url = f"{self.api_url}?api_key={self.api_key}&family_id={self.family_id}"
            _LOGGER.debug("Fetching data from: %s", url)
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        _LOGGER.debug("Received data: %s", data)
                        if data.get("success"):
                            return data["data"]
                        else:
                            raise UpdateFailed(f"API error: {data.get('error', 'Unknown error')}")
                    else:
                        raise UpdateFailed(f"HTTP {response.status}")
        except Exception as err:
            _LOGGER.error("Error fetching Weekly Menu data: %s", err)
            raise UpdateFailed(f"Error fetching data: {err}")


class WeeklyMenuBaseSensor(SensorEntity):
    """Base class for Weekly Menu sensors."""

    def __init__(self, coordinator: WeeklyMenuCoordinator, name: str, unique_id: str) -> None:
        """Initialize the sensor."""
        self.coordinator = coordinator
        self._attr_name = name
        self._attr_unique_id = f"weekly_menu_{unique_id}"
        self._attr_native_value = None
        self._attr_extra_state_attributes = {}

    @property
    def available(self):
        """Return True if entity is available."""
        return self.coordinator.last_update_success

    async def async_added_to_hass(self):
        """When entity is added to hass."""
        await super().async_added_to_hass()
        self.async_on_remove(
            self.coordinator.async_add_listener(self._handle_coordinator_update)
        )

    def _handle_coordinator_update(self):
        """Handle updated data from the coordinator."""
        self.async_write_ha_state()

    @property
    def should_poll(self):
        """No need to poll. Coordinator notifies entity of updates."""
        return False

    def _update_from_data(self, data: dict[str, Any]) -> None:
        """Update sensor from API data."""
        # Override in subclasses
        pass


class WeeklyMenuDaySensor(WeeklyMenuBaseSensor):
    """Sensor for individual day meals."""

    def __init__(self, coordinator: WeeklyMenuCoordinator, name: str, day: str) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, f"{name}'s Meal", day)
        self.day = day

    def _update_from_data(self, data: dict[str, Any]) -> None:
        """Update sensor from API data."""
        weekly_menu = data.get("weekly_menu", [])
        meal = "No meal planned"
        
        for item in weekly_menu:
            if item.get("day", "").lower() == self.day.lower():
                meal = item.get("dish", "No meal planned")
                break
        
        self._attr_native_value = meal
        self._attr_extra_state_attributes = {
            "day": self.day.capitalize(),
            "has_meal": meal != "No meal planned",
            "last_updated": data.get("last_updated", "")
        }

    @property
    def native_value(self):
        """Return the state of the sensor."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_native_value

    @property
    def extra_state_attributes(self):
        """Return the state attributes."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_extra_state_attributes

    @property
    def icon(self):
        """Return the icon of the sensor."""
        return "mdi:food-variant"


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

    @property
    def native_value(self):
        """Return the state of the sensor."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_native_value

    @property
    def extra_state_attributes(self):
        """Return the state attributes."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_extra_state_attributes

    @property
    def icon(self):
        """Return the icon of the sensor."""
        return "mdi:food"


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

    @property
    def native_value(self):
        """Return the state of the sensor."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_native_value

    @property
    def extra_state_attributes(self):
        """Return the state attributes."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_extra_state_attributes

    @property
    def icon(self):
        """Return the icon of the sensor."""
        return "mdi:food-variant"


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

    @property
    def native_value(self):
        """Return the state of the sensor."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_native_value

    @property
    def extra_state_attributes(self):
        """Return the state attributes."""
        if self.coordinator.data:
            self._update_from_data(self.coordinator.data)
        return self._attr_extra_state_attributes

    @property
    def icon(self):
        """Return the icon of the sensor."""
        return "mdi:chart-line" 