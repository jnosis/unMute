import { browser } from './Api/api';

export default function localizeHtmlPage() {
  const elements = document.querySelectorAll('.locale-text');
  const msgRegex = /__MSG_(\w+)__/g;
  for (const element of elements) {
    const text = element.textContent;
    if (typeof text === 'string') {
      const localizedText = text.replace(msgRegex, (_match, key: string) => {
        return key ? browser.i18n.getMessage(key) : text;
      });

      if (localizedText !== text) {
        element.textContent = localizedText;
      }
    }
  }
}
