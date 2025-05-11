import { TileColor } from "$lib/types/Tile.ts";
import { MatchResult } from "./MatchResult";


const tilecolorsMap = new Map<TileColor, string>([
    [TileColor.Green, "--tile-green"],
    [TileColor.Yellow, "--tile-yellow"],
    [TileColor.Gray, "--tile-gray"],
]);

export const getTileTypeCssColor = (tileType: TileColor) => tilecolorsMap.has(tileType) ? `var(${tilecolorsMap.get(tileType)!})` : "";
export const getTileTypeCssColorDark = (tileType: TileColor) => tilecolorsMap.has(tileType) ? `var(${tilecolorsMap.get(tileType)!}-dark)` : "";


const matchColorsMap = new Map<MatchResult, string>([
    [MatchResult.Match, "--tile-green"],
    [MatchResult.Misplaced, "--tile-yellow"],
    [MatchResult.Absent, "--tile-gray"],
]);

export const getMatchResultCssColor = (result: MatchResult) => matchColorsMap.has(result) ? `var(${matchColorsMap.get(result)!})` : "";
export const getMatchResultCssColorDark = (result: MatchResult) => matchColorsMap.has(result) ? `var(${matchColorsMap.get(result)!}-dark)` : "";
