export default function localizeHtmlPage() {
  const elements = document.querySelectorAll('.locale-text');
  const messageRegex = /__MSG_(\w+)__/g;
  for (const element of elements) {
    const text = element.textContent as string;
    const localizedText = text.replace(messageRegex, (_match, key: string) => {
      return key ? chrome.i18n.getMessage(key) : '';
    });

    if (localizedText !== text) {
      element.textContent = localizedText;
    }
  }
}
