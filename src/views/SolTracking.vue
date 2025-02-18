<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import apiClientUtils from '../utils/apiClientUtils';
import {
  formatTimeDifference,
  convertNumberToShortSuffix,
} from '../utils/commonUtils';
import { Token } from '../models/solTrackingModel';

// State to store data
const tokens = ref<Token[]>([]);
const searchQuery = ref<string>('');

let intervalId: ReturnType<typeof setInterval> | null = null;

// Function to fetch data from the API
const fetchTokens = async () => {
  const response = await apiClientUtils.get<Token[]>(
    'http://162.243.194.32:3000/app/tokens',
  );

  // Map the data to include latestPrice and other sortable fields
  tokens.value = response.data.map((token) => ({
    ...token,
    latestPrice: token.priceNatives?.at(-1) || 0,
    formattedLiquidity: convertNumberToShortSuffix(token.liquidity),
    formattedVolumeH24: convertNumberToShortSuffix(token.volumeH24),
    createdAtTimestamp: new Date(token.pairCreatedAt).getTime(),
  }));
};

// Fetch data when the component is mounted
onMounted(async () => {
  fetchTokens(); // Initial fetch

  // Set an interval to fetch data every 5 seconds
  intervalId = setInterval(fetchTokens, 3000);
});

// Clear the interval when the component is unmounted
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// Filter tokens by search query
const filteredTokens = computed(() => {
  return tokens.value.filter((token) =>
    [token.symbol, token.address, token.poolAddress].some((field) =>
      field?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
  );
});
</script>

<template>
  <div class="container">
    <!-- Search Input -->
    <div class="controls">
      <InputText
        v-model="searchQuery"
        placeholder="Search by Symbol, Address, Pool Address"
      />
    </div>

    <!-- Data table with PrimeVue -->
    <DataTable
      :value="filteredTokens"
      paginator
      :rows="15"
      tableStyle="min-width: 100%"
    >
      <Column field="symbol" header="Symbol" sortable />

      <Column field="latestPrice" header="Latest Price" sortable>
        <template #body="{ data }"> {{ data.latestPrice }} </template>
      </Column>

      <Column field="liquidity" header="Liquidity" sortable>
        <template #body="{ data }"> {{ data.formattedLiquidity }} </template>
      </Column>

      <Column field="volumeH24" header="24h Volume" sortable>
        <template #body="{ data }"> {{ data.formattedVolumeH24 }} </template>
      </Column>

      <Column field="createdAtTimestamp" header="Created At" sortable>
        <template #body="{ data }">
          {{ formatTimeDifference(data.pairCreatedAt) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
// Styles applied only to this component
.container {
  padding: 20px;

  .controls {
    margin-bottom: 20px;

    .p-inputtext {
      width: 100%;
      height: 45px;
    }
  }
}
</style>
