export enum TileColor {
    Empty,
    Yellow,
    Gray,
    Green,
    Blue,
    BlueFlash
}

export class Tile {
    constructor(
        readonly id: bigint,
        readonly color: TileColor = TileColor.Empty,
        readonly letter: string = "",
        readonly tagColor: TileColor | null = null,
    ) {}
}