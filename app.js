class App {
  constructor() {
    this.ref = document.getElementById('app');
    const logIn = document.createElement('log-in');
    this.update(logIn);
  }

  /**
   * 
   * @typedef {object} HTMLElement 
   */
  /**
   * Clear the contents of the app and show the new content. 
   * @param {HTMLElement} newContent The new app content.
   */
   update(newContent) {
    // clear content
    this.ref.innerHTML = "";
    // add new content
    this.ref.appendChild(newContent);
  }
}
const app = new App();