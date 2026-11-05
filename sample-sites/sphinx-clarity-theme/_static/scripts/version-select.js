// ************************************************************************
// *** Version select handler ***
// ************************************************************************

// Exported for testing
export function getNewVersionUrl(
  newVersionUrlString,
  currentVersionString,
  currentPathname,
  currentHash,
  baseURI,
) {
  // Use URL class to handle path joining properly
  // If newVersionUrl is relative, the URL constructor needs base URL to resolve it correctly.
  const newUrl = new URL(newVersionUrlString, baseURI);

  // Extract after version part from pathname to append to new version URL
  // From, e.g., /2.1/user-guide-2.1/getting-started.html#installation
  // gets /user-guide-2.1/getting-started.html#installation
  const index = currentPathname.indexOf(currentVersionString);
  const after = currentPathname.substring(index + currentVersionString.length);

  // Ensure we don't end up with double slashes when joining paths
  newUrl.pathname = newUrl.pathname.replace(/\/$/, "") + after;
  newUrl.hash = currentHash;

  return newUrl.href;
}

export async function navigateToVersion(
  newVersionUrlString,
  versionHomepageUrl,
) {
  const exists = await doesUrlExist(newVersionUrlString);
  if (exists) {
    window.location.href = newVersionUrlString;
  } else {
    console.info(
      `Version URL '${newVersionUrlString}' does not exist, redirecting to version homepage`,
    );
    window.location.href = versionHomepageUrl;
  }
}

export async function doesUrlExist(url) {
  // Check if URL exists by making a HEAD request
  // This is a simple way to check if the target version page exists before navigating
  // Note: This will be subject to CORS restrictions, so it only works for same-origin URLs or if the server allows it.
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // true if status is in the range 200-299
  } catch {
    return false; // Treat any errors (e.g., network issues) as non-existent URL
  }
}

export function setupVersionSelect() {
  const el = document.getElementById("version-select");

  if (!el) {
    throw new Error(
      "Error: Version select element with id 'version-select' not found",
    );
  }

  el.addEventListener("change", (event) => {
    // Read currentVersion at event time (allows testing with mocked window value)
    const currentVersion = window.VERSION_SELECT_CURRENT_VERSION;

    const target = event.currentTarget;
    const selectedOption = target.options[target.selectedIndex];
    const newVersionHomepageUrl = selectedOption.dataset.url;
    const currentPageUrl = window.location.toString();

    if (!currentPageUrl.includes(currentVersion)) {
      throw new Error(
        `Error: Current version '${currentVersion}' not found in current page URL`,
      );
    }

    // Get current pathname and hash
    const currentPathname = window.location.pathname;
    const currentHash = window.location.hash;

    const href = getNewVersionUrl(
      newVersionHomepageUrl,
      currentVersion,
      currentPathname,
      currentHash,
      document.baseURI,
    );

    navigateToVersion(href, newVersionHomepageUrl);
  });
}

// Auto-initialize when script loads
// In tests, the element won't exist yet, so this will silently fail
// Tests will call setupVersionSelect() explicitly after setting up DOM
const versionSelectEl = document.getElementById("version-select");
if (versionSelectEl) {
  setupVersionSelect();
}
