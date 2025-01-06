async function openTabInUnddit(tab: chrome.tabs.Tab): Promise<void> {
  const { url } = tab;
  if (url === undefined) {
    console.error("The current page URL is undefined.");
    return;
  }
  const redditUrlPattern = /(www\.)?reddit\.com/;
  if (!redditUrlPattern.test(url)) {
    console.warn("The current page is not a Reddit page.");
    return;
  }
  const newUrl = url.replace(redditUrlPattern, "undelete.pullpush.io");
  await chrome.tabs.create({ url: newUrl });
}

chrome.action.onClicked.addListener((tab) => void openTabInUnddit(tab));
