export interface EquipmentBikeRef {
  shop: string;
  pref: string;
  maker: string;
  model: string;
  /** Paid add-on keys this model offers: topcase, sidebag, pannier. Empty means none. */
  paid: string[];
}

export function matchEquipmentBike(
  shop: string,
  bikeText: string,
  bikes: EquipmentBikeRef[],
): EquipmentBikeRef | null;
