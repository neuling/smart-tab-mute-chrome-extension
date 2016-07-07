import { map, max } from 'lodash';

const muteOlderTabs = (changedTab) => {
  chrome.tabs.query({ audible: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id !== changedTab.id) {
        chrome.tabs.update(tab.id, { muted: true });
      }
    })
  });
};

const unmuteRecentTab = () => {
  chrome.tabs.query({ audible: true }, (tabs) => {
    const latestAudibleTabId = max(map(tabs, tab => tab.id));
    chrome.tabs.update(latestAudibleTabId, { muted: false });
  });
};

const tabUpdated = (tabId, changeInfo, tab) => {
  if (changeInfo && changeInfo.audible === true) {
    muteOlderTabs(tab);
  }
  if (changeInfo && changeInfo.audible === false) {
    unmuteRecentTab();
  }
};

chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onRemoved.addListener(unmuteRecentTab);
