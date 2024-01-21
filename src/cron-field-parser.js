const { ERROR_MESSAGES, CronField, CRON_FIELD_VALUES_MAP } = require("./constants.js");

// For '*'
class AsteriskStrategy {
    constructor(field) {
        this.field = field
    }
    execute() {
        return CRON_FIELD_VALUES_MAP[this.field];
    }
}

// For ','
class ListStrategy {
    constructor(field) {
        this.field = field;
    }

    execute(input) {
        const numbers = input.split(',').map(x => getNumericValue(x, this.field)).filter(x => validateNumber(x, this.field));
        return numbers;
    }
}

// For '-'
class RangeStrategy {
    constructor(field) {
        this.field = field;
    }

    execute(input) {
        const numbers = input.split('-').map(x => getNumericValue(x, this.field)).filter(x => validateNumber(x, this.field));

        // IF expression has more than 1 '/'. Recursive solving of expression is not yet supported ( TODO? )
        if (numbers.length > 2) {
            throw new Error(generateErrorMessage(ERROR_MESSAGES.UNSUPPORTED_FIELD_FORMAT, this.field, input));
        }

        if (numbers[0] >= numbers[1]) {
            throw new Error(generateErrorMessage(ERROR_MESSAGES.INVALID_RANGE_INPUT, this.field, input));
        }

        return CRON_FIELD_VALUES_MAP[this.field].filter(x => x >= numbers[0] && x <= numbers[1]);
    }
}

// For '/'
class IntervalStrategy {
    constructor(field) {
        this.field = field;
    }

    execute(input) {
        const numbers = input.split('/');

        // IF expression has more than 1 '/'. Recursive solving of expression is not yet supported ( TODO? )
        if (numbers.length > 2) {
            throw new Error(generateErrorMessage(ERROR_MESSAGES.UNSUPPORTED_FIELD_FORMAT, this.field, input));
        }

        let from = numbers[0], interval = numbers[1];

        // Edge case to resolve in case expression is in the form */x, it should run every x intervals starting from lowest valid value for the field 
        if (from === '*')
            from = CRON_FIELD_VALUES_MAP[this.field][0];
        else
            from = getNumericValue(from, this.field);

        interval = getNumericValue(interval, this.field);

        if (!validateNumber(from, this.field) || !validateNumber(interval, this.field))
            return [];

        return CRON_FIELD_VALUES_MAP[this.field].filter(x => x >= from && (x - from) % interval === 0);
    }
}

// For single values like 11, 3
class SingleValueStrategy {
    constructor(field) {
        this.field = field;
    }

    execute(input) {
        if (!validateNumber(getNumericValue(input, this.field), this.field)) {
            return [];
        }
        return [Number(input)];
    }
}

// Select strategy on basis of symbol in input
class CronFieldParser {
    constructor(strategy) {
        this.strategy = strategy;
    }

    parse(input) {
        return this.strategy.execute(input);
    }
}

function parseCronField(input, field) {
    const asteriskStrategy = new AsteriskStrategy(field);
    const listStrategy = new ListStrategy(field);
    const rangeStrategy = new RangeStrategy(field);
    const intervalStrategy = new IntervalStrategy(field);
    const singleValueStrategy = new SingleValueStrategy(field);

    const cronFieldParser = new CronFieldParser(
        input === '*' ? asteriskStrategy :
            input.includes(',') ? listStrategy :
                input.includes('-') ? rangeStrategy :
                    input.includes('/') ? intervalStrategy :
                        singleValueStrategy
    );

    return cronFieldParser.parse(input);
}

function validateNumber(number, field) {
    const values = CRON_FIELD_VALUES_MAP[field];
    const inFieldLimits = values.includes(parseInt(number));
    if (!inFieldLimits)
        throw new Error(generateErrorMessage(ERROR_MESSAGES.FIELD_VALUE_OUTSIDE_LIMITS, field, number));
    return inFieldLimits;
}

function getNumericValue(number, field) {
    if (!isNumeric(number))
        throw new Error(generateErrorMessage(ERROR_MESSAGES.INVALID_FIELD_VALUE, field, number));
    return parseInt(number);
}

const isNumeric = (num) => (typeof (num) === 'number' || typeof (num) === "string" && num.trim() !== '') && !isNaN(num);

function generateErrorMessage(errormessage, field, input) {
    return `${errormessage} ${Object.entries(CronField).find(([key, value]) => value === field)[0]} : ${input}`;
}

module.exports = parseCronField;