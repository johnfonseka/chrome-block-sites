/**
 * Author: johnfonseka <shan4max@gmail.com>
 * Project: chrome-block-sites
 * Date: 10/10/2025
 */

async function fetchJson(url) {
  try {
    if (!url) {
      return [];
    }
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

var removeSite = (url, isAllowed) => {};
var attachRemoveSiteHandler = () => {};
var showSaveMessage = (message, isError = false) => {};
var handleFinishSave = (saveChangesBtn, spinner, message, error) => {};
