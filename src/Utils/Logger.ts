export default class Logger {
    public static warn(text: string): void {
        console.log("\x1b[96m%s\x1b[0m", text);
    }

    public static error(text: string | unknown): void {
        console.log("\x1b[91m%s\x1b[0m", text);
    }

    public static success(text: string | unknown): void {
        console.log("\x1b[92m%s\x1b[0m", text);
    }

    public static preload(text: string | unknown): void {
        console.log("\x1b[93m%s\x1b[0m", text);
    }

    public static debug(text: string | unknown): void {
        console.log("\x1b[97m%s\x1b[0m", text);
    }
}
