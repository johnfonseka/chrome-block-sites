// This is a free JSON hosting site. We store our blocked sites here. Edit via
// https://www.npoint.io/docs/4a65cbcfe0556bbb9ace
const blockedSitesStoreUrl = "https://api.npoint.io/4a65cbcfe0556bbb9ace";

// If you want to explicitly allow an URL, add it to this list.
const allowedUrls = ["music.youtube.com"];

// Default blocked sites
const defaultBlockedSites = [
  {
    url: "facebook.com",
  },
  {
    url: "youtube.com",
    time: { s: 18, e: 22 },
    allow_on_time: true,
  },
];

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

const allowBeforeBlock = (url) => {
  const currentUrl = window.location.href;
  return currentUrl.includes(url);
};

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop + 1 - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

// Main check function
// check whether URL is blocked by the rules
const isRuleBlocked = (block) => {
  const currentUrl = window.location.href;
  if (!currentUrl.includes(block.url)) {
    return false;
  }
  if ("time" in block) {
    return !allowedOnTimeBase(block);
  }
  return true;
};

const allowedOnTimeBase = (block) => {
  if (!("s" in block.time && "e" in block.time)) {
    return false;
  }
  if (!("allow_on_time" in block)) {
    return false;
  }
  if (block.time.s > block.time.e) {
    return false;
  }
  const c_hour = new Date().getHours();
  const hour_range = range(block.time.s, block.time.e);
  if (hour_range.includes(c_hour)) {
    return block.allow_on_time;
  }
};

// Function to show the blocking overlay
const showBlockerOverlay = () => {
  const currentUrl = window.location.href;
  const overlay = document.createElement("div");
  overlay.id = "blocker-overlay";
  overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: #000000ff; /* Red-50 */
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 20px;
    `;
  const content = `
        <div style="text-align: center; background-color: #000000ff; padding: 40px 60px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); max-width: 450px; width: 90%;">
        <p style="font-size: 120px; margin: 0 0 20px 0; color: #ffffff;">☠</p>
        <h1 style="color: #ff5252; font-size: 32px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            Access Blocked
        </h1>
    `;
  overlay.innerHTML = content;
  document.documentElement.appendChild(overlay);
  document.body.style.overflow = "hidden";
};

// Main execution function
const checkAndBlock = async () => {
  const explicitlyAllowedUrl = allowedUrls.some(allowBeforeBlock);
  if (explicitlyAllowedUrl) {
    return;
  }
  const blockList = await fetchJson(blockedSitesStoreUrl);
  defaultBlockedSites.map((a) => blockList.push(a));
  const iscurrentUrlBlocked = blockList.some(isRuleBlocked);
  if (iscurrentUrlBlocked) {
    // Clear the entire page content before showing the overlay
    document.documentElement.innerHTML =
      "<html><head><title>Blocked</title></head><body></body></html>";
    showBlockerOverlay();
  }
};
checkAndBlock();
