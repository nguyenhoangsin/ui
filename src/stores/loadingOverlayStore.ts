import { defineStore } from 'pinia';

export type LoadingOverlay = {
  isLoading: boolean;
};

const initialState: LoadingOverlay = {
  isLoading: false,
};

export const useLoadingOverlayStore = defineStore('loadingOverlay', {
  state: (): LoadingOverlay => ({
    ...initialState,
  }),

  actions: {
    showLoading() {
      this.isLoading = true;
    },
    hideLoading() {
      this.isLoading = false;
    },
    showHideLoading(payload: boolean) {
      this.isLoading = payload;
    },
  },

  getters: {
    isLoadingGetter(state): boolean {
      return state.isLoading;
    },
  },
});
