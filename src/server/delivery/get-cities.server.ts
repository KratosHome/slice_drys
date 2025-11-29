"use server";

import {
  NovaPoshtaCities,
  NovaPoshtaDefaultCities,
} from "./nova-poshta-schema.server";

import { connectToDbServer } from "@/server/connect-to-db.server";
import { getNovaPoshtaApiData } from "./get-np-api-data.server";

export async function getDefaultNPCitiesFromDictionary(): Promise<
  IDirectoryCity[] | null
> {
  try {
    await connectToDbServer();

    const cities = await NovaPoshtaDefaultCities.find({}).lean<
      IDirectoryCity[]
    >();

    return cities.map(({ city, ref }) => ({
      city,
      ref,
    }));
  } catch (error) {
    console.error("Помилка при отриманні міст Нова Пошта:", error);
    return null;
  }
}

export async function getNPCitiesFromDictionary(
  city: string,
): Promise<IDirectoryCity[] | null> {
  try {
    await connectToDbServer();

    const cities = await NovaPoshtaCities.find({
      city: { $regex: city, $options: "i" },
    }).lean<IDirectoryCity[]>();

    return cities.map(({ city, ref }) => ({
      city,
      ref,
    }));
  } catch (error) {
    console.error("Помилка при отриманні міст Нова Пошта:", error);
    return null;
  }
}

export async function getNPCityOnline(): Promise<INovaPoshtaApiResponse<
  INovaPoshtaApiCity[]
> | null> {
  try {
    const result =
      await getNovaPoshtaApiData<INovaPoshtaApiCity[]>("getCities");
    return result;
  } catch (error) {
    console.error("Помилка при отриманні міст Нова Пошта з API:", error);
    return null;
  }
}
