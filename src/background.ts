const REDDIT_PAGE_URL_PATTERN = /https?:\/\/(\w+\.)?reddit\.com\/r\//;
const REDDIT_HOST_PATTERN = /(\w+\.)?reddit\.com/;

async function openTabInUnddit(tab: chrome.tabs.Tab): Promise<void> {
  const { url } = tab;
  if (url === undefined) {
    console.warn("The current page URL is undefined.");
    return;
  }
  if (!REDDIT_PAGE_URL_PATTERN.test(url)) {
    console.warn("Can only open Unddit on subreddit/post/comment pages.", url);
    return;
  }
  const newUrl = url.replace(REDDIT_HOST_PATTERN, "undelete.pullpush.io");
  await chrome.tabs.create({
    url: newUrl,
    openerTabId: tab.id,
    index: tab.index + 1,
  });
}

chrome.action.onClicked.addListener((tab) => void openTabInUnddit(tab));

chrome.runtime.onInstalled.addListener((_details) => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const redditPageStateMatcher =
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostSuffix: ".reddit.com", schemes: ["http", "https"] },
      });
    const showActionOnRedditPageRule = {
      conditions: [redditPageStateMatcher],
      actions: [new chrome.declarativeContent.ShowAction()],
    };
    const rules = [showActionOnRedditPageRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});
