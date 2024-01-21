# Deliveroo Take Home Assignment - CRON Expression Parser

### Steps for setup
- Ensure you have Node setup on your machine. Required Node version is 14.15 / 16.10 or above. Recommended to use Node 18.0 or above.
- Run command to install the dependencies. We are using Jest for testing<br>
    `npm install` 

### Steps to run
- Use the following syntax to run using custom CRON expression<br>
    `node index.js <cron_expression>`
- You can also use the below command to run with sample input <br>
    `npm run sample`
- To execute all test cases, run below command <br>
    `npm run test`

#### Sample Input
`node index.js "*/15 0 1,15 * 1-5 /usr/bin/find"`

#### Sample Output
```
minute          0 15 30 45
hour            0
day of month    1 15
month           1 2 3 4 5 6 7 8 9 10 11 12
day of week     1 2 3 4 5
command         /usr/bin/find
```