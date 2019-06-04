export class Identicon {
  background = null;
  foreground = null;
  hash = null;
  margin = null;
  size = null;
  format = null;

  options: any = {};
  defaults = {
          margin:     0.08,
          size:       64,
          saturation: 0.9,
          brightness: 0.54,
          format:     'png'
  };

  constructor(hash, options) {
      if (typeof(hash) !== 'string' || hash.length < 15) {
          throw new Error('A hash of at least 15 characters is required.');
      }


      this.options = typeof(options) === 'object' ? options : this.defaults;

      // backward compatibility with old constructor (hash, size, margin)
      if (typeof(arguments[1]) === 'number') { this.options.size   = arguments[1]; }
      if (arguments[2])                      { this.options.margin = arguments[2]; }

      this.hash        = hash;

      this.size        = this.options.size       || this.defaults.size;
      this.format      = this.options.format     || this.defaults.format;
      this.margin      = this.options.margin !== undefined ? this.options.margin : this.defaults.margin;

      // foreground defaults to last 7 chars as hue at 70% saturation, 50% brightness
      const hue          = parseInt(this.hash.substr(-7), 16) / 0xfffffff;
      const saturation   = this.options.saturation || this.defaults.saturation;
      const brightness   = this.options.brightness || this.defaults.brightness;
      this.foreground  = this.options.foreground || this.hsl2rgb(hue, saturation, brightness);
      // 244 99 32
      let backgroundHue = hue - (170 / 360);
      if ( backgroundHue < 0 ) {
        backgroundHue = hue + (170 / 360);
      }

      const backgroundSaturation = 0.9;

      this.background  = this.options.background || this.hsl2rgb(backgroundHue, backgroundSaturation, 0.32);
  }


  private image(): Svg {
// tslint:disable-next-line: no-use-before-declare
        return new Svg(this.size, this.foreground, this.background);
  }

  private render() {
        const image = this.image(),
            // size       = this.size,
            size       = 360,
            baseMargin = Math.floor(size * this.margin),
            cell       = Math.floor((size - (baseMargin * 2)) / 5),
            margin     = Math.floor((size - cell * 5) / 2),
            bg         = image.color.apply(image, this.background),
            fg         = image.color.apply(image, this.foreground);

        // the first 15 characters of the hash control the pixels (even/odd)
        // they are drawn down the middle first, then mirrored outwards
        let i, color;
        for (i = 0; i < 15; i++) {
            color = parseInt(this.hash.charAt(i), 16) % 2 ? bg : fg;
            if (i < 5) {
                this.rectangle(2 * cell + margin, i * cell + margin, cell, cell, color, image);
            } else if (i < 10) {
                this.rectangle(1 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
                this.rectangle(3 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
            } else if (i < 15) {
                this.rectangle(0 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
                this.rectangle(4 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
            }
        }

        return image;
    }

    private rectangle(x, y, w, h, color, image) {
        image.rectangles.push({x, y, w, h, color});
    }

    // adapted from: https://gist.github.com/aemkei/1325937
    private hsl2rgb(h, s, b) {
        h *= 6;
        s = [
            b += s *= b < .5 ? b : 1 - b,
            b - h % 1 * s * 2,
            b -= s *= 2,
            b,
            b + h % 1 * s,
            b + s
        ];

        return[
            s[ ~~h    % 6 ] * 255, // red
            s[ (h | 16) % 6 ] * 255, // green
            s[ (h | 8)  % 6 ] * 255  // blue
        ];
    }

    public toString(raw = false) {
        // backward compatibility with old toString, default to base64
        if (raw) {
            return this.render().getDump();
        } else {
            return this.render().getBase64();
        }
    }

    public isSvg() {
        return true;
    }
}

class Svg {

  size =       null;
  foreground = null;
  background = null;
  rectangles = null;

  constructor(size, foreground, background) {
      this.size       = size;
      this.foreground = this.color.apply(this, foreground);
      this.background = this.color.apply(this, background);
      this.rectangles = [];
  }
      color(r, g, b, a) {
          const values = [r, g, b].map(Math.round);
          values.push((a >= 0) && (a <= 255) ? a / 255 : 1);
          return 'rgba(' + values.join(',') + ')';
      }

      getDump() {
        let i,
              xml,
              rect,
              fg     = this.foreground,
              bg     = this.background,
              stroke = this.size * 0.05;

        xml = '<svg xmlns=\'http://www.w3.org/2000/svg\''
              + ' viewBox=\'0 0 360 360\' preserveAspectRatio=\'xMidYMid meet\' '
              + ' width=\'' + this.size + '\' height=\'' + this.size + '\''
              + ' style=\'background-color:' + bg + ';\'>'
              + '<g style=\'fill:' + fg + '; stroke:' + fg + '; stroke-width:' + stroke + ';\'>';

        for (i = 0; i < this.rectangles.length; i++) {
              rect = this.rectangles[i];
              if (rect.color === bg) { continue; }
              xml += '<rect '
                  + ' x=\''      + rect.x + '\''
                  + ' y=\''      + rect.y + '\''
                  + ' width=\''  + rect.w + '\''
                  + ' height=\'' + rect.h + '\''
                  + '/>';
          }
        xml += '</g></svg>';

        return xml;
      }

      getBase64() {
          return btoa(this.getDump());
      }
  }
