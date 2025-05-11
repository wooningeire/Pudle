import type { Tile, TileColor } from "./Tile";


export class TileTag {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly existingTile: Tile,
        readonly tagColor: TileColor,
    ) {}
}
