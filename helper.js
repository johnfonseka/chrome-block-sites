/**
 * Author: johnfonseka <shan4max@gmail.com>
 * Project: chrome-block-sites
 * Date: 10/10/2025
 */

const JSON_FETCH_URL = "https://api.npoint.io/4a65cbcfe0556bbb9ace";

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

const listBlockedSites = (blockList) => {
  const blocked_sites_ul_content = blockList
    .map((site) => {
      if (site.allow_on_time) {
        return `<li>${site.url} (allowed from ${site.time.s
          .toString()
          .padStart(2, "0")} to ${site.time.e
          .toString()
          .padStart(2, "0")}) <a>⌫</a></li>`;
      } else {
        return `<li>${site.url} <a>⌫</a></li>`;
      }
    })
    .join("");
  document.getElementById("blocked-sites-ul").innerHTML =
    blocked_sites_ul_content;
};

const listAllowedSites = (explicitlyAllowedUrl) => {
  const allowed_sites_ul_content = explicitlyAllowedUrl
    .map((site) => {
      return `<li>${site} <a>⌫</a></li>`;
    })
    .join("");
  document.getElementById("allowed-sites-ul").innerHTML =
    allowed_sites_ul_content;
};

showSaveMessage = (message, saveStatusDiv, isError = false) => {
  const success_alert = (
    message
  ) => `<div id="success-alert" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                <span class="font-medium">Success!</span> ${message}
              </div>`;
  const error_alert = (
    message
  ) => `<div id="error-alert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span class="font-medium">Error!</span> ${message}
              </div>`;
  saveStatusDiv.innerHTML = isError
    ? error_alert(message)
    : success_alert(message);
  setTimeout(() => {
    const alertDivId = isError ? "error-alert" : "success-alert";
    const alertDiv = document.getElementById(alertDivId);
    if (alertDiv) {
      alertDiv.remove();
    }
  }, 5000);
};

handleFinishSave = (saveChangesBtn, spinner, message, error) => {
  const saveStatusDiv = document.getElementById("save-status");
  showSaveMessage(message, saveStatusDiv, error);
  saveChangesBtn.disabled = false;
  spinner.style.display = "none";
};

removeSite = (url, isAllowed, blockList, explicitlyAllowedUrl) => {
  console.log("Removing site:", url, "isAllowed:", isAllowed);
  if (isAllowed) {
    const index = explicitlyAllowedUrl.indexOf(url);
    if (index > -1) {
      explicitlyAllowedUrl.splice(index, 1);
    }
  } else {
    const index = blockList.findIndex((site) => site.url === url);
    if (index > -1) {
      blockList.splice(index, 1);
    }
  }
};

attachRemoveSiteHandler = (
  link,
  blockList,
  explicitlyAllowedUrl,
  allowed = false
) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const url = e.target.parentElement.textContent.replace(" ⌫", "").trim();
    removeSite(url, allowed, blockList, explicitlyAllowedUrl);
    if (allowed) {
      listAllowedSites(explicitlyAllowedUrl);
    } else {
      listBlockedSites(blockList);
    }
  });
};
