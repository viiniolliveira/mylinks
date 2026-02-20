export default defineBackground(() => {
  // 3) Abrir o sidepanel (MV3)
  chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;

    // Open the side panel for the current tab
    await chrome.sidePanel.open({
      tabId: tab.id,
      windowId: tab.windowId // Also good practice to include windowId if available
    });
  });

  // 4) (Opcional) Definir o sidepanel por aba
  chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    try {
      await chrome.sidePanel.setOptions({
        tabId,
        path: "sidepanel.html",
        enabled: true,
      });
    } catch (error) {
      console.error("Failed to set side panel options:", error);
    }
  });
});
