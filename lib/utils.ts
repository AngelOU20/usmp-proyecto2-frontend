import { colors } from "@/constants/color";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de CSS de forma segura.
 * Utiliza `clsx` para combinar las clases y `twMerge` para fusionar las clases de Tailwind de manera inteligente.
 * @param inputs - Clases de CSS a combinar.
 * @returns Clases combinadas.
 */
export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea el tamaño de un archivo en bytes a una cadena legible (KB o MB).
 * @param sizeInBytes - El tamaño en bytes.
 * @returns El tamaño formateado como cadena.
 */
export const formatSize = (sizeInBytes: number): string => {
  if (sizeInBytes >= 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(sizeInBytes / 1024).toFixed(2)} KB`;
};

/**
 * Formatea una fecha dada en una cadena legible en formato español.
 * @param dateString - Fecha en formato Date.
 * @returns Fecha formateada como cadena.
 */
export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Convierte un archivo en un buffer para su manipulación o almacenamiento.
 * @param file - El archivo que se convertirá en buffer.
 * @returns El buffer correspondiente al archivo.
 */
export async function convertToBuffer (file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Obtiene valores únicos de una clave específica en un array de objetos.
 * Esta función es útil para generar filtros basados en valores únicos.
 * @param items - Array de objetos (como estudiantes) de los que obtener valores únicos.
 * @param key - Clave del objeto por la cual se obtendrán los valores únicos.
 * @returns Un array de valores únicos.
 */
export const getUniqueValues = <T, K extends keyof T> (items: T[], key: K): T[K][] => {
  const values = items.map((item) => item[key]);
  return Array.from(new Set(values)).filter((value) => value !== undefined && value !== null);
};

/**
 * Genera opciones de filtro basadas en valores únicos de una clave específica.
 * Convierte los valores únicos a una lista de opciones de filtro.
 * @param items - Array de objetos (como estudiantes) de los que generar opciones de filtro.
 * @param key - Clave del objeto por la cual se generarán las opciones de filtro.
 * @returns Un array de objetos con `label` y `value`, que pueden usarse en un select.
 */
export const generateFilterOptions = <T, K extends keyof T> (items: T[], key: K) => {
  const uniqueValues = getUniqueValues(items, key);
  return uniqueValues.map((value) => ({
    label: String(value), // Convertimos el valor a string para la etiqueta del filtro
    value,
  }));
};

/**
 * Obtener las iniciales del nombre del usuario
 * @param name - Nombre completo del usuario
 * @returns Las iniciales del nombre
 */
export const getInitials = (name: string): string => {
  const names = name.split(" ");
  const initials = names
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
  return initials.toUpperCase();
};

/**
 * Obtener un color basado en el nombre del usuario
 * @param name - Nombre del usuario
 * @returns Un color en formato hexadecimal
 */
export const getColorFromName = (name: string): string => {
  const charCodeSum = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};
