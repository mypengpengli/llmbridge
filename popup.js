document.addEventListener('DOMContentLoaded', async () => {
  I18n.localizeDocument();
  document.title = I18n.t('appName');

  const statusBadge = document.getElementById('status-badge');
  const statusHint = document.getElementById('status-hint');
  const helpLink = document.getElementById('help-link');
  document.getElementById('version').textContent = `v${chrome.runtime.getManifest().version}`;

  async function checkStatus() {
    statusBadge.textContent = I18n.t('checking');
    statusBadge.className = 'status-badge checking';

    try {
      const response = await chrome.runtime.sendMessage({ type: 'FS_STATUS' });
      if (response.success) {
        if (response.mode === 'native') {
          statusBadge.textContent = I18n.t('nativeConnected');
          statusBadge.className = 'status-badge native';
          statusHint.textContent = response.rootDir
            ? I18n.t('workingDirectoryValue', response.rootDir)
            : I18n.t('setWorkingDirectoryHint');
        } else {
          statusBadge.textContent = I18n.t('browserMode');
          statusBadge.className = 'status-badge filesystem';
          statusHint.textContent = I18n.t('browserModeHint');
        }
      }
    } catch {
      statusBadge.textContent = I18n.t('notConnected');
      statusBadge.className = 'status-badge disconnected';
      statusHint.textContent = I18n.t('notConnectedHint');
    }
  }

  const siteCheckboxes = document.querySelectorAll('[data-site]');
  const savedSites = await chrome.storage.sync.get('enabledSites');
  const enabledSites = savedSites.enabledSites || ['chat.qwen.ai', 'chatgpt.com', 'gemini.google.com', 'claude.ai'];

  siteCheckboxes.forEach(cb => {
    cb.checked = enabledSites.includes(cb.dataset.site);
    cb.addEventListener('change', async () => {
      const sites = Array.from(siteCheckboxes)
        .filter(c => c.checked)
        .map(c => c.dataset.site);
      await chrome.storage.sync.set({ enabledSites: sites });
    });
  });

  helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('help.html') });
  });

  checkStatus();
});
