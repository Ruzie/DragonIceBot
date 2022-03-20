export default class EmbedUtil extends null {
    static resolveColor(color: string | number): string | number {
        if (typeof color === "string") {
            if (color === "RANDOM") return Math.floor(Math.random() * (0xffffff + 1));
            if (color === "DEFAULT") return 0;
            color = parseInt(color.replace("#", ""), 16);
          } else if (Array.isArray(color)) {
            color = (color[0] << 16) + (color[1] << 8) + color[2];
          }

          if (color < 0 || color > 0xffffff) throw new RangeError("Color range too low or exceeds maximum range.");
          else if (Number.isNaN(color)) throw new TypeError("Provided value isn't a number.");
          return color;
    }

    static cloneObject(obj: Object): Object {
        return Object.assign(Object.create(obj), obj);
    }

    static verifyString(
        data: unknown,
        error = Error,
        errorMessage: string = `Expected a string, got ${data} instead.`,
        allowEmpty: boolean = true,
      ) {
        if (typeof data !== "string") throw new error(errorMessage);
        if (!allowEmpty && data.length === 0) throw new error(errorMessage);
        return data;
      }
}
