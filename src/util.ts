export function getFormattedTime(string: string) {
  return string.slice(11, 16);
}

export function safetyQuerySelector<T extends Element>(
  queryString: string,
  parent?: Document | DocumentFragment | HTMLElement
): T {
  if (!parent) {
    parent = document;
  }
  const result = parent.querySelector<T>(queryString);

  if (!result) {
    throw new Error(`отсутствует: ${queryString}`);
  }

  return result as T;
}
