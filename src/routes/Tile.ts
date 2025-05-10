export enum TileType {
    Empty,
    Yellow,
    Gray,
    Green,
}

export class Tile {
    constructor(
        readonly id: bigint,
        readonly type: TileType = TileType.Empty,
        readonly letter: string = "",
    ) {}
}