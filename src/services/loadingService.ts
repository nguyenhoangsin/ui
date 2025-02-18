import { useLoadingOverlayStore } from '../stores/loadingOverlayStore';

export function showLoading() {
  const loadingOverlayStore = useLoadingOverlayStore();

  if (loadingOverlayStore.isLoading) {
    return;
  }

  loadingOverlayStore.showLoading();
}

export function hideLoading() {
  const loadingOverlayStore = useLoadingOverlayStore();

  if (!loadingOverlayStore.isLoading) {
    return;
  }

  loadingOverlayStore.hideLoading();
}

export default { showLoading, hideLoading };
