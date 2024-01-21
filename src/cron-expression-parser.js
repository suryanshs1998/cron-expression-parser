const parseCronField = require("./cron-field-parser.js")
const { CronField } = require("./constants.js");

class CronExpressionBuilder {
    constructor() {
        this.minute = [];
        this.hour = [];
        this.dayOfMonth = [];
        this.month = [];
        this.dayOfWeek = [];
        this.command = "";
    }

    static create() {
        return new CronExpressionBuilder();
    }

    addMinute(minuteValues) {
        this.minute = minuteValues;
    }

    addHour(hourValues) {
        this.hour = hourValues;
    }

    addDayOfMonth(dayOfMonthValues) {
        this.dayOfMonth = dayOfMonthValues;
    }

    addMonth(monthValues) {
        this.month = monthValues;

    }

    addDayOfWeek(dayOfWeekValues) {
        this.dayOfWeek = dayOfWeekValues;
    }

    addCommand(command) {
        this.command = command;
    }

    printCronExpressionResolution() {
        console.log([
            `minute`.padEnd(14) + `${this.minute.join(' ')}`,
            `hour`.padEnd(14) + `${this.hour.join(' ')}`,
            `day of month`.padEnd(14) + `${this.dayOfMonth.join(' ')}`,
            `month`.padEnd(14) + `${this.month.join(' ')}`,
            `day of week`.padEnd(14) + `${this.dayOfWeek.join(' ')}`,
            `command`.padEnd(14) + `${this.command}`
        ].join('\n'));
    }
}

function parseCronExpression(cronStr) {
    try {
        const cronExpressionBuilder = CronExpressionBuilder.create();

        const [minute, hour, day, month, weekDay, ...rest] = cronStr.split(' ');

        // In case insufficient fields are passed and command field turns out to be empty string
        if (rest.length == 0) {
            throw new Error("Insufficient fields in CRON Expression - Please check with CRON syntax");
        }

        const command = rest.join(' ');
        cronExpressionBuilder.addMinute(parseCronField(minute, CronField.MINUTE));
        cronExpressionBuilder.addHour(parseCronField(hour, CronField.HOUR));
        cronExpressionBuilder.addDayOfMonth(parseCronField(day, CronField.DAY));
        cronExpressionBuilder.addMonth(parseCronField(month, CronField.MONTH));
        cronExpressionBuilder.addDayOfWeek(parseCronField(weekDay, CronField.WEEK_DAY));
        cronExpressionBuilder.addCommand(command);
        cronExpressionBuilder.printCronExpressionResolution();
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = parseCronExpression;