import { Tile, TileColor } from "$lib/types/Tile.ts";


const colorsMap = new Map<TileColor, string>([
    [TileColor.Green, "--tile-green"],
    [TileColor.Yellow, "--tile-yellow"],
    [TileColor.Gray, "--tile-gray"],
]);

export const getTileTypeCssColor = (tileType: TileColor) => colorsMap.has(tileType) ? `var(${colorsMap.get(tileType)!})` : "";
export const getTileTypeCssColorDark = (tileType: TileColor) => colorsMap.has(tileType) ? `var(${colorsMap.get(tileType)!}-dark)` : "";
