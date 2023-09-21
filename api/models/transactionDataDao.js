const dataSource = require('./dataSource');

const getTransactionDataByDeposits = async (userId, monthValue) => {
    try {
      const [result] = await dataSource.query( 
        `
        SELECT
          DAY(t.created_at) AS transactionDay, t.transaction_note AS transactionNote, 
          t.amount AS amount, p.image_url AS imageUrl, f.finance_number AS financeNumber
        FROM
          users AS u
          LEFT JOIN user_finaces AS f ON u.id = f.user_id
          LEFT JOIN transactions AS t ON t.user_finances_id = f.id
          LEFT JOIN providers AS p on f.provider_id = p.id
        WHERE u.id = ? AND t.amount > 0
          AND YEAR(t.created_at) = YEAR(NOW()) AND MONTH(t.created_at) = ?
        ORDER BY t.created_at DESC;
        `,
        [userId, monthValue]
       );
      return result;
    } catch (err) {
      console.log(err)
      const error = new Error('dataSource Error');
      error.statusCode = 400;
      throw error;
    }
  };

const getTransactionDataByExpenses = async (userId, monthValue, monthlyQuery) => {
    try {
      const [result] = await dataSource.query( 
        `
        SELECT
          DAY(t.created_at) AS transactionDay, t.transaction_note AS transactionNote,
           ABS(t.amount) AS amount, c.image_url AS imageUrl, f.finance_number AS financeNumber
        FROM
          users AS u
          LEFT JOIN user_finaces AS f ON u.id = f.user_id
          LEFT JOIN transactions AS t ON t.user_finances_id = f.id
          LEFT JOIN categories AS c on t.category_id = c.id
        WHERE u.id = ? AND YEAR(t.created_at) = YEAR(NOW()) 
        AND MONTH(t.created_at) = ? 
        ${monthlyQuery}
        ORDER BY t.created_at DESC;
        `,
        [userId, monthValue]
       );
      return result;
    } catch (err) {
      console.log(err)
      const error = new Error('dataSource Error');
      error.statusCode = 400;
      throw error;
    }
  };

const getFinanceDataByExpensesandCategory = async (userId, categoryId, yearValue, monthValue) => {
    try {
      const [result] = await dataSource.query( 
          `
        SELECT
          SUM(ABS(t.amount)) AS amountSum
        FROM
          users AS u
          LEFT JOIN user_finaces AS f ON u.id = f.user_id
          LEFT JOIN transactions AS t ON t.user_finances_id = f.id
        WHERE u.id = ? AND t.amount < 0 AND t.category_id = ?
          AND YEAR(t.created_at) = ? AND MONTH(t.created_at) = ?
        GROUP BY t.category_id
        ORDER BY amountSum DESC;
            `,
        [userId, categoryId, yearValue, monthValue]
       );
      return result;
    } catch (err) {
      console.log(err)
      const error = new Error('dataSource Error');
      error.statusCode = 400;
      throw error;
    }
  };

  module.exports = {
    getTransactionDataByDeposits,
    getTransactionDataByExpenses,
    getFinanceDataByExpensesandCategory,
    };