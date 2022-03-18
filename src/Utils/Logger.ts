export default class Logger {
    static warn(text: string): void {
        console.log("\x1b[96m%s\x1b[0m", text);
    }

    static error(text: string | unknown): void {
        console.log("\x1b[91m%s\x1b[0m", text);
    }

    static success(text: string | unknown): void {
        console.log("\x1b[92m%s\x1b[0m", text);
    }

    static preload(text: string | unknown): void {
        console.log("\x1b[93m%s\x1b[0m", text);
    }
}
