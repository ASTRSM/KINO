import img from "../assets/images/kinologo.png";

class Top extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <section>
        <h1>KINO</h1>
        <h2>Everything about cinema at your own garsp, seek your desire and thrist of art and thrill. </h2>
        </section>
        <section>
            <img src="${img}" alt="splash">
        </section>
    `;
  }
}

customElements.define("top-element", Top);
