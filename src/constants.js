const ERROR_MESSAGES = {
    INVALID_FIELD_VALUE: 'Invalid argument for field ',
    FIELD_VALUE_OUTSIDE_LIMITS: 'Argument outside field limits for ',
    UNSUPPORTED_FIELD_FORMAT: 'Unsupported format in field ',
    INVALID_RANGE_INPUT: 'Invalid range, from should be lesser than to. Field: '
}

const CronField = {
    MINUTE: 0,
    HOUR: 1,
    DAY: 2,
    MONTH: 3,
    WEEK_DAY: 4
};

const CRON_FIELD_VALUES_MAP = {
    [CronField.MINUTE]: Array.from({ length: 60 }, (_, i) => i),
    [CronField.HOUR]: Array.from({ length: 24 }, (_, i) => i),
    [CronField.DAY]: Array.from({ length: 31 }, (_, i) => i + 1),
    [CronField.MONTH]: Array.from({ length: 12 }, (_, i) => i + 1),
    [CronField.WEEK_DAY]: Array.from({ length: 7 }, (_, i) => i)
};

module.exports = { ERROR_MESSAGES, CronField, CRON_FIELD_VALUES_MAP };