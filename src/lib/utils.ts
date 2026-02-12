import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateTableName(existingTables: { name: string }[]): string {
  let counter = 1;
  let name = `Table_${counter}`;
  
  while (existingTables.some(t => t.name === name)) {
    counter++;
    name = `Table_${counter}`;
  }
  
  return name;
}

export function generateColumnName(existingColumns: { name: string }[]): string {
  let counter = 1;
  let name = `column_${counter}`;
  
  while (existingColumns.some(c => c.name === name)) {
    counter++;
    name = `column_${counter}`;
  }
  
  return name;
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    .replace(/^_/, '');
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^./, char => char.toUpperCase());
}
