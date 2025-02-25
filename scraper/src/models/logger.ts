import fs from "fs"
import p from "path"

export enum LogLevel {
	DEBUG = "DEBUG",
	INFO = "INFO",
	WARN = "WARN",
	ERROR = "ERROR",
}

interface LoggerProps {
	allowedLevels: LogLevel[]
	logInFile: boolean
	logPath: string
}

export const DEFAULT_OPTIONS: LoggerProps = {
	allowedLevels: Object.values(LogLevel),
	logInFile: false,
	logPath: './logs'
}

export class Logger {
	constructor(private className: string, readonly options: LoggerProps = DEFAULT_OPTIONS) { }

	get allowedLevels() {
		return this.options.allowedLevels
	}

	set allowedLevels(allowedLevels: LogLevel[]) {
		this.options.allowedLevels = allowedLevels
	}

	info(msg: string) {
		return this.log(msg, LogLevel.INFO)
	}

	debug(msg: string) {
		return this.log(msg, LogLevel.DEBUG)
	}

	warn(msg: string) {
		return this.log(msg, LogLevel.WARN)
	}

	error(msg: string) {
		return this.log(msg, LogLevel.ERROR)
	}

	private log(msg: string, level: LogLevel = LogLevel.INFO) {
		if (!this.allowedLevels.includes(level)) return
		let pad = Math.max(...Object.values(LogLevel).map((l) => l.length))
		const [currentDate, currentTime] = new Date().toLocaleString().replace(",", "").split(" ")
		const message = `${this.className} | ${currentDate} ${currentTime} | ${level.padEnd(pad)} | ${msg}`
		console.log(message)
		if (this.options.logInFile) {
			fs.mkdirSync(this.options.logPath, { recursive: true })
			const file = this.className.toLowerCase().replace(" ", "_")
			const filePath = p.join(this.options.logPath, `${file}.txt`)
			fs.appendFileSync(filePath, `${message}\n`, { encoding: "utf-8" })
		}
	}

}