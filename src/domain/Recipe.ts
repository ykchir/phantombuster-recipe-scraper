export class Recipe {
  constructor(
    public readonly name: string,
    public readonly rating: number,
    public readonly reviews: number,
    public readonly url: string,
  ) {}
}
