/**
 * Author: johnfonseka <shan4max@gmail.com>
 * Project: chrome-block-sites
 * Date: 18/10/2025
 */

const {
  password: originalPassword,
  blocked_sites: blockList,
  allowed_sites: explicitlyAllowedUrl,
} = await fetchJson(JSON_FETCH_URL);

listBlockedSites(blockList);
listAllowedSites(explicitlyAllowedUrl);

document
  .getElementById("allowed-sites-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const allowed_url = document.getElementById("allowed_url").value;
    explicitlyAllowedUrl.push(allowed_url);
    listAllowedSites(explicitlyAllowedUrl);
  });

document
  .getElementById("blocked-sites-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("url").value;
    const start_time = document.getElementById("start_time").value;
    const end_time = document.getElementById("end_time").value;
    const action = document.getElementById("action").value;
    let newSite = { url, allow_on_time: false };
    if (start_time !== "Allow start time" && end_time !== "Allow end time") {
      newSite = {
        url,
        allow_on_time: true,
        time: { s: parseInt(start_time), e: parseInt(end_time) },
      };
    }
    blockList.push(newSite);
    listBlockedSites(blockList);
  });

const saveChanges = async () => {
  const saveChangesBtn = document.getElementById("save-changes-btn");
  saveChangesBtn.disabled = true;
  const spinner = document.getElementById("save-spinner");
  spinner.style.display = "inline-block";
  const password = document.getElementById("password").value;
  if (!password) {
    handleFinishSave(
      saveChangesBtn,
      spinner,
      "Please enter your password.",
      true
    );
    return;
  }
  if (password !== originalPassword) {
    handleFinishSave(
      saveChangesBtn,
      spinner,
      "Incorrect password. Please try again.",
      true
    );
    return;
  }
  const json = JSON.stringify({
    password: password,
    blocked_sites: blockList,
    allowed_sites: explicitlyAllowedUrl,
  });
  try {
    const response = await fetch(JSON_FETCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });

    if (response.ok) {
      handleFinishSave(
        saveChangesBtn,
        spinner,
        "Changes saved successfully!",
        false
      );
    } else {
      handleFinishSave(
        saveChangesBtn,
        spinner,
        "Failed to save changes. Please check your password and try again.",
        true
      );
    }
  } catch (error) {
    console.error("[Block Sites][Save Error]", error);
    handleFinishSave(
      saveChangesBtn,
      spinner,
      "An error occurred. Please try again.",
      true
    );
  }
};

document
  .getElementById("password-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveChanges();
  });

const attachRemoveSiteHandlers = () => {
  document
    .querySelectorAll("#blocked-sites-ul li a")
    .forEach((link) =>
      attachRemoveSiteHandler(link, blockList, explicitlyAllowedUrl, false)
    );
  document
    .querySelectorAll("#allowed-sites-ul li a")
    .forEach((link) =>
      attachRemoveSiteHandler(link, blockList, explicitlyAllowedUrl, true)
    );
};

attachRemoveSiteHandlers();
