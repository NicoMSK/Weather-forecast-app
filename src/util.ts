const START_STRING = 11;
const END_STRING = 16;

export function getTextSlice(string: string) {
  return string.slice(START_STRING, END_STRING);
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
