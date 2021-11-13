const createHomePage = () => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const html = xhr.responseText;
    defineHomePage(html);
  }
  xhr.open('GET', '/components/home-page.html');
  xhr.send();

}

const defineHomePage = (html) => {
  class HomePage extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = html;
      // Format transaction dates in US style.
      this.dateFormatter = new Intl.DateTimeFormat('en-US');
      this.amountFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
      this.getTransactions();
    }

    getTransactions() {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => this.loadTransactions(xhr);
      xhr.open('GET', '/proxy/transactions/index.php');
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.send();
    }

    loadTransactions(xhr) {
      const transactionData = JSON.parse(xhr.responseText);
      const transactions = transactionData.data.transactions;
      const tableFragment = new DocumentFragment();
      for (const transaction of transactions) {
        const tableRow = this.makeTableRow(transaction);
        tableFragment.appendChild(tableRow);
      }
      const tableBody = document.querySelector('#transactions-table > tbody');
      tableBody.appendChild(tableFragment);
    }

    /**
     * Create a table row element from the transaction. 
     * @param {Transaction} transaction 
     * @returns {HTMLElement} tr The table row.
     */
     makeTableRow(transaction) {
      // make table row
      const tr = document.createElement('tr');

      // add data for the date column
      const rawDate = Date.parse(transaction.date);
      const transactionDate = this.dateFormatter.format(rawDate);
      this.addTableData(tr, transactionDate);

      // add the account
      this.addTableData(tr, transaction.account_name);

      // add the category
      this.addTableData(tr, transaction.category_name);

      // add the amount
      const amountDisplay = this.amountFormatter.format(transaction.amount);
      this.addTableData(tr, amountDisplay)
      return tr
    }

    /**
     *  Add a td element to the row with the given data. 
     * @param {HTMLElement} tr The table row element.
     * @param {string} data The text to show in the table data.
     */
     addTableData(tr, data) {
      let td = document.createElement('td');
      td.innerText = data;
      tr.appendChild(td);
    }

  }
  window.customElements.define('home-page', HomePage);
}

createHomePage();
