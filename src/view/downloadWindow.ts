import { safetyQuerySelector } from "@/util";

const loadingData = safetyQuerySelector<HTMLDialogElement>(".dialog");
const textLoadingStatus = safetyQuerySelector<HTMLElement>(".dialog__text");
const spinnerLoading = safetyQuerySelector<HTMLElement>(".dialog__loader");

export async function showsDownloadWindow(promise: Promise<T>) {
  const timeoutId = setTimeout(() => loadingData.showModal(), 150);

  try {
    textLoadingStatus.textContent = "Загрузка данных...";
    spinnerLoading.style.display = "flex";

    const result = await promise;
    clearTimeout(timeoutId);
    loadingData.close();

    return result;
  } catch (error) {
    textLoadingStatus.textContent =
      "Ошибка загрузки данных. Попробуйте ещё раз.";
    spinnerLoading.style.display = "none";

    console.error(error);
  }
}
