export enum TileColor {
    Empty,
    Yellow,
    Gray,
    Green,
}

export class Tile {
    constructor(
        readonly id: bigint,
        readonly color: TileColor = TileColor.Empty,
        readonly letter: string = "",
        readonly currentWordColor: TileColor | null = null,
    ) {}
}