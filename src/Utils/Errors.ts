["unhandledRejection", "uncaughtException", "uncaughtExceptionMonitor", "rejectionHandled", "multipleResolves", "warning"]
.forEach((value: string) => process.on(value, () => { }));
