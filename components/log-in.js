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
      this.clientId = 'e9ba8a5be607dd037705e53bd02932bc5821e98e5bce344b45beba4135f65d29';
      this.redirectURI = baseURL
      this.authURL = `https://app.youneedabudget.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectURI}&response_type=code`;
    }

    connectedCallback() {
      const logInButton = this.querySelector('button.primary');
      logInButton.addEventListener('click', () => window.location.assign(this.authURL));
    }
  }
  // Define the custom element.
  window.customElements.define('log-in', LogIn);
}