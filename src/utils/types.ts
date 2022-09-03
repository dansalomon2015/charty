export interface RootStateType {
    followedCurrencies: Currency[];
    currentCurrency?: Currency;
    firstLaunch: boolean;
    currenciesSelectionDone: boolean;
}

export type RootReducerType = {
    rootReducer: RootStateType;
};

export type Currency = {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
};
