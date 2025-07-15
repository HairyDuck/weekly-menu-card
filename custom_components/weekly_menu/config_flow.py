"""Config flow for Weekly Menu integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN, DEFAULT_API_URL

_LOGGER = logging.getLogger(__name__)

class WeeklyMenuConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Weekly Menu."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema(
                    {
                        vol.Required("api_key"): str,
                    }
                ),
            )

        # Add the hard-coded values to the user input
        user_input["api_url"] = DEFAULT_API_URL
        user_input["family_id"] = 1

        return self.async_create_entry(
            title="Weekly Menu",
            data=user_input,
        ) 