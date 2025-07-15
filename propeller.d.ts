// global.d.ts
export {};

declare global {
  interface Window {
    PropellerAds?: {
      displayAd: (zoneId: number) => void;
    };
  }
}
