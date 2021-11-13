// const baseURL = 'https://damp-castle-92074.herokuapp.com'
const baseURL = 'http://localhost:8888'
let accessToken;
let accessExpires;
class App {
  constructor() {
    this.ref = document.getElementById('app');
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      this.handleLogin(params.get('code'));
      return
    }
    // see if the accessToken is set
    if (accessToken) {
      this.showHome();
      return
    }
    // if not try the refresh token
    this.refreshAccessToken();
  }

  /**
   * Log the user in given the authorization code. 
   * @param {string} code The YNAB authorization code.
   */
  handleLogin(code) {
    // get the auth token
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const authData = JSON.parse(xhr.responseText);
      this.setAccessToken(authData);
      // set url
      window.history.replaceState({}, document.title, '/');
      this.showHome();
    }
    xhr.open('GET', `/proxy/oauth?code=${code}`);
    xhr.send();
  }

  /**
   * Request a new access token using the
   * refresh token set as a http only cookie.
   */
  refreshAccessToken() {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 401) {
        // refresh failed, show login
        this.showLogin();
        return;
      }
      let initialAccessToken = accessToken;
      const refreshData = JSON.parse(xhr.responseText);
      this.setAccessToken(refreshData);
      // if the accessToken was just set, show the home page
      if(!initialAccessToken) {
        this.showHome();
      }
    }
    xhr.open('GET', '/proxy/refresh');
    xhr.send();
  }

  /**
   * @typedef {Object} TokenResponse
   * @property {string} access_token The access token for the YNAB api.
   * @property {number} expires_in The number of seconds until the access token expires.
   */

  /**
   * Set the access token and expire time
   * and silently refresh the access token before it expires.
   * @param {TokenResponse} tokenData
   */
  setAccessToken(tokenData) {
    // update the token and expire time
    accessToken = tokenData.access_token;
    accessExpires = tokenData.expires_in;
    this.silentlyRefreshToken();
  }

  /**
   * Before the current access token expires
   * refresh the access token.
   */
  silentlyRefreshToken() {
    // The number of seconds before expiration to refresh.
    const secondsEarly = 60;
    const refreshSeconds = accessExpires - secondsEarly;
    const refreshMilliseconds = refreshSeconds * 1000;
    console.log({refreshMilliseconds});
    setTimeout(() => {
      console.log("refreshing accessToken");
      this.refreshAccessToken();
    }, refreshMilliseconds)
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

  /**
   * Shows the log in page.
   */
  showLogin() {
    const logIn = document.createElement('log-in');
    this.update(logIn);
  }

  /**
   * Shows the home page.
   */
  showHome() {
    // show the logout button
    const logOut = document.createElement('button');
    logOut.className = 'log-out';
    logOut.innerText = "Log Out";
    logOut.addEventListener('click', () => this.onLogout())
    const navBar = document.getElementById('nav-bar');
    navBar.appendChild(logOut);
    const home = document.createElement('home-page');
    this.update(home);
  }

  onLogout() {
    // Make a logout request to clear the refresh token cookie
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/proxy/logout');
    xhr.send();
    accessToken = null;
    accessExpires = null;
    // remove the logout button
    const logOut = document.querySelector('button.log-out');
    logOut.remove();
    this.showLogin();
  }

}
const app = new App();