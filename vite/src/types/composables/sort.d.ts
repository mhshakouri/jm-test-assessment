import { SORT_OPTIONS, SORT_ORDERS } from '../../constants/sort';

type SortOptions = typeof SORT_OPTIONS[number];
type SortOrders = typeof SORT_ORDERS[number];

export type { SortOptions, SortOrders };