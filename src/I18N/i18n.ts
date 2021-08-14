// * bypass i18n
export default abstract class I18N {
  static async getMessage(id: string) {
    let lang = navigator.language;
    lang = lang.indexOf('-') !== -1 ? (lang.split('-')[0] as string) : lang;
    const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
    const messages = await this.fetchMessagesJSON(url);
    let message: string = id;
    if (messages[id] !== undefined) {
      message = messages[id]?.message as string;
    }

    return message;
  }

  private static async fetchMessagesJSON(
    request: RequestInfo
  ): Promise<{ [id: string]: { message: string } }> {
    const response = await fetch(request);
    const messages = await response.json();
    return messages;
  }
}
