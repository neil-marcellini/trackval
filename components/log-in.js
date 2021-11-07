/*
Load the log in html and define the web component.
*/
const loginXHR = new XMLHttpRequest();
loginXHR.onload = () => {
  defineLogin(loginXHR.responseText);
}
loginXHR.open('GET', '/components/log-in.html');
loginXHR.send();

/** Define the log in web component
 * @param {string} html The html string for the web component.
 */
const defineLogin = (html) => {
  /**
   * A web component to show the log in.
   */
   class LogIn extends HTMLElement {
    /**
     * Create the Custom HTMLElement, attach the shadow DOM,
     * and add the html.
     */
    constructor() {
      super();
      this.innerHTML = html;
    }
  }
  // Define the custom element.
  window.customElements.define('log-in', LogIn);
}