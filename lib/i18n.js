const I18n = (() => {
  function t(key, substitutions) {
    const message = chrome.i18n.getMessage(key, substitutions);
    return message || key;
  }

  function localizeDocument(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-html]').forEach((element) => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });
    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    if (root === document) {
      document.documentElement.lang = chrome.i18n.getUILanguage();
    }
  }

  return Object.freeze({ t, localizeDocument });
})();
