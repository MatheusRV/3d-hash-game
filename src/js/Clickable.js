window.addEventListener("click", () => {});
document.addEventListener(
  "click",
  event => {
    event.preventDefault();
  },
  { passive: false }
);

class Clickable {
  constructor(element, options) {
    this.position = {
      current: new THREE.Vector2(),
      start: new THREE.Vector2(),
      delta: new THREE.Vector2(),
      old: new THREE.Vector2(),
      click: new THREE.Vector2()
    };

    this.options = Object.assign(
      {
        calcDelta: false
      },
      options || {}
    );

    this.element = element;
    this.touch = null;

    this.click = {
      start: event => {
        if (event.type == "mousedown" && event.which != 1) return;
        if (event.type == "touchstart" && event.touches.length > 1) return;

        this.getPositionCurrent(event);

        if (this.options.calcDelta) {
          this.position.start = this.position.current.clone();
          this.position.delta.set(0, 0);
          this.position.click.set(0, 0);
        }

        this.touch = event.type == "touchstart";

        this.onClickStart(this.position);

        window.addEventListener(
          this.touch ? "touchmove" : "mousemove",
          this.click.move,
          false
        );
        window.addEventListener(
          this.touch ? "touchend" : "mouseup",
          this.click.end,
          false
        );
      },

      move: event => {
        if (this.options.calcDelta) {
          this.position.old = this.position.current.clone();
        }

        this.getPositionCurrent(event);

        if (this.options.calcDelta) {
          this.position.delta = this.position.current
            .clone()
            .sub(this.position.old);
          this.position.click = this.position.current
            .clone()
            .sub(this.position.start);
        }

        this.onClickMove(this.position);
      },

      end: event => {
        this.getPositionCurrent(event);

        this.onClickEnd(this.position);

        window.removeEventListener(
          this.touch ? "touchmove" : "mousemove",
          this.click.move,
          false
        );
        window.removeEventListener(
          this.touch ? "touchend" : "mouseup",
          this.click.end,
          false
        );
      }
    };

    this.onClickStart = () => {};
    this.onClickMove = () => {};
    this.onClickEnd = () => {};

    this.enable();

    return this;
  }

  enable() {
    this.element.addEventListener("touchstart", this.click.start, false);
    this.element.addEventListener("mousedown", this.click.start, false);

    return this;
  }

  disable() {
    this.element.removeEventListener("touchstart", this.click.start, false);
    this.element.removeEventListener("mousedown", this.click.start, false);

    return this;
  }

  getPositionCurrent(event) {
    const clickEvent = event.touches
      ? event.touches[0] || event.changedTouches[0]
      : event;

    this.position.current.set(clickEvent.pageX, clickEvent.pageY);
  }

  convertPosition(position) {
    position.x = (position.x / this.element.offsetWidth) * 2 - 1;
    position.y = -((position.y / this.element.offsetHeight) * 2 - 1);

    return position;
  }
}

export { Clickable };
