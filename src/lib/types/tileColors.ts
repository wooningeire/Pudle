import { TileColor } from "$lib/types/Tile.ts";
import { MatchResult } from "./MatchResult";


const tilecolorsMap = new Map<TileColor, string>([
    [TileColor.BlueFlash, "--tile-blue-flash"],
    [TileColor.Green, "--tile-match"],
    [TileColor.Yellow, "--tile-misplaced"],
    [TileColor.Gray, "--tile-absent"],
]);

export const getTileTypeCssColor = (tileType: TileColor) => tilecolorsMap.has(tileType) ? `var(${tilecolorsMap.get(tileType)!})` : "";
export const getTileTypeCssColorDark = (tileType: TileColor) => tilecolorsMap.has(tileType) ? `var(${tilecolorsMap.get(tileType)!}-dark)` : "";


const matchColorsMap = new Map<MatchResult, string>([
    [MatchResult.Match, "--tile-match"],
    [MatchResult.Misplaced, "--tile-misplaced"],
    [MatchResult.Absent, "--tile-absent"],
]);

export const getMatchResultCssColor = (result: MatchResult) => matchColorsMap.has(result) ? `var(${matchColorsMap.get(result)!})` : "";
export const getMatchResultCssColorDark = (result: MatchResult) => matchColorsMap.has(result) ? `var(${matchColorsMap.get(result)!}-dark)` : "";
