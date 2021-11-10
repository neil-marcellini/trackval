
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
    if(accessToken) {
      this.showHome();
      return
    }
    // if not try the refresh token
    this.refreshAccessToken();
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
      const refreshData = JSON.parse(xhr.responseText);
      // update the token and expire time
      accessToken = refreshData.access_token;
      accessExpires = refreshData.expires_in;
      this.showHome();
    }
    xhr.open('GET', '/refresh');
    xhr.send();
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
      accessToken = authData.access_token;
      accessExpires = authData.expires_in;
      // set url
      window.history.replaceState({}, document.title, '/');
      this.showHome();
    }
    xhr.open('GET', `/oauth?code=${code}`);
    xhr.send();
  }

  /**
   * Shows the home page.
   */
  showHome() {
    const home = document.createElement('h1');
    home.innerText = 'Home';
    this.update(home);
  }
}
const app = new App();