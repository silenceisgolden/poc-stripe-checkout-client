/* eslint-disable class-methods-use-this */

import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { installRouter } from 'pwa-helpers/router.js';

// set these values before running "npm start"
const API_HOST = '';
const stripe = window.Stripe('');

export class PocStripeCheckoutClient extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
      }
    `;
  }

  constructor() {
    super();

    installRouter((location) => this.handleNavigation(location));
  }

  render() {
    return html`
      <main>
        ${this._renderPage()}
      </main>
    `;
  }

  _renderPage() {
    switch (this.page) {
      case '/':
        return html`
          <p>
            <button @click=${this.startSession}>Create Subscription</button>
          </p>

          <p>
            <button @click=${this.updateSession}>Update Subscription</button>
          </p>
        `;
      case '/success':
        return html`
          <p>Success</p>
          <p><a href="/">Home</a>
        `;
      case '/cancel':
        return html`
          <p>Cancel</p>
          <p><a href="/">Home</a>
        `;

      default:
        return html`
          <p>Page not found try going to <a href="/">Main</a></p>
        `;
    }
  }

  __navClass(page) {
    return classMap({ active: this.page === page });
  }

  handleNavigation(location, event) {
    if (event && event.type === 'click') {
      window.scrollTo(0, 0);
    }

    this.page = location.pathname;
  }

  goToRoute(path) {
    window.history.pushState({}, '', `/${path}`);
    this.handleNavigation(window.location);
  }

  async startSession() {
    const res = await fetch(`${API_HOST}/subscriptions/session-create`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();

    return stripe.redirectToCheckout({
      sessionId: body.id
    });
  }

  async updateSession() {
    const res = await fetch(`${API_HOST}/subscriptions/session-update`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const body = await res.json();

    return stripe.redirectToCheckout({
      sessionId: body.id
    });
  }
}
