export interface Token {
  address: string;
  symbol: string;
  quoteSymbol: string;
  poolAddress: string;
  pairCreatedAt: number;
  priceNatives: number[];
  priceCaches: {
    priceNative: number;
    timestamp: number;
  }[];
  liquidity: number;
  volumeH24: number;
  buyParameters: BuyParameters;
}

export interface BuyParameters {
  keyLiq: number;
  keyVol: number;
  buyMax: number;
  buyIn: number[]; // amount if > 1, percent if < 1
  drop: number[]; // percent
  slip: number[]; // percent
  fee: number[]; // sol
  tip: number[]; // sol
}
