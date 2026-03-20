import { Platform } from "react-native";

export interface RangeItem {
  a: string | number;
  b: string | number;
}

// Función para verificar si un valor está dentro de un rango
const isInRange = <T extends RangeItem>(
  range: T,
  value: string | number,
): boolean => {
  return range.a <= value && range.b >= value;
};

// Función para encontrar un valor en un array de rangos
const findInRanges = <T extends RangeItem>(
  ranges: T[],
  value: string | number,
): T | undefined => {
  return ranges.find((range) => isInRange(range, value));
};

// Función para obtener el dato más repetido en el array, omitiendo nulls
const getMostFrequentItem = (arr: (string | null)[]) => {
  const validItems = arr.filter((item): item is string => item !== null);

  if (validItems.length === 0) return null;

  const counts: Record<string, number> = {};
  let maxCount = 0;
  let mostFrequent = validItems[0];

  for (const text of validItems) {
    counts[text] = (counts[text] || 0) + 1;

    if (counts[text] > maxCount) {
      maxCount = counts[text];
      mostFrequent = text;
    }
  }

  return { mostFrequent, maxCount };
};

// Función que extrae el valor y serie de un texto en bruto
const extractBanknoteData = (text: string) => {
  const cleanText = text.replace(/[\n\r]/g, " ").toUpperCase();

  // Buscar valor del billete boliviano (10, 20, 50, 100, 200)
  const valueRegex = /\b(200|100|50|20|10)\b/;
  const valueMatch = cleanText.match(valueRegex);
  const value = valueMatch ? valueMatch[0] : null;

  // Buscar serie: Específicamente 9 números, un espacio y 1 letra (ej. "123456789 A")
  const serialRegex = /\b\d{9}\s[A-Z]\b/g;
  const wordMatches = cleanText.match(serialRegex) || [];

  let serial: string | null = null;

  if (wordMatches.length > 0) {
    // Guardamos la serie tal como es (ej. "123456789 A"), verificando que no sea undefined
    serial = wordMatches[0] ?? null;
  }

  return { value, serial };
};

// Verificar si es Android con API < 28 (Android < 9)
const isLowAndroidVersion = (version: number): boolean =>
  version > 0 && version < 28;

// Obtener la versión de Android
const getAndroidVersion = (): number =>
  Platform.OS === "android" ? Platform.Version : 0;

export {
  extractBanknoteData,
  findInRanges,
  getAndroidVersion,
  getMostFrequentItem,
  isInRange,
  isLowAndroidVersion,
};
