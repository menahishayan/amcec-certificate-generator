import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import 'rxjs';

@Component({
  selector: 'certificate',
  template: `<canvas #canvas></canvas>`,
})
export class Certificate {
  @ViewChild('canvas') public c: ElementRef<HTMLCanvasElement>;

  @Input() public certType: string;

  @Input() public dept: string;

  @Input() public personName: string;

  @Input() public bodyText1: string;
  @Input() public bodyText2: string;

  @Input() public person1Name: string;
  @Input() public person1Desig: string;

  @Input() public person2Name: string;
  @Input() public person2Desig: string;

  @Input() public person3Name: string;
  @Input() public person3Desig: string;

  @Input() public prefixString: string;

  ctx: CanvasRenderingContext2D;
  bg = new Image();
  certHeader = new Image();
  cseLogo = new Image();
  csiLogo = new Image();

  fontsizeBody = 11.44614;
  fontsizePerson = 7.44;

  deptTitles = {
    CSE: 'Dept. of Computer Science & Engg.',
    ISE: 'Dept. of Information Science & Engg.',
    ECE: 'Dept. of Electronics & Communication',
    EEE: 'Dept. of Electrical & Electronics Engg.',
    ME: 'Dept. of Mechanical Engineering',
    CIV: 'Dept. of Civil Engineering',
    MATH: 'Dept. of Mathematics',
    PHY: 'Dept. of Physics',
    CHEM: 'Dept. of Chemistry',
    None: '',
    Custom: '',
  };

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    return window.innerWidth;
  }

  public ngAfterViewInit() {
    let c = this.c.nativeElement;
    this.ctx = this.c.nativeElement.getContext('2d');

    c.height = 372;

    if (this.getScreenSize() < 768) {
      let rescaleFactor = (this.getScreenSize() * 0.9) / (c.height * 1.414516);
      c.height = c.height * rescaleFactor;
      this.fontsizeBody = this.fontsizeBody * rescaleFactor;
      this.fontsizePerson = this.fontsizePerson * rescaleFactor;
    }

    c.width = c.height * 1.414516;

    this.bg.src = './assets/template@2x.jpg';

    this.certHeader.src = './assets/' + this.certType + '@2x.png';
    this.cseLogo.src = './assets/cse.png';
    this.csiLogo.src = './assets/csi.png';

    this.bg.onload = () => {
      this.certHeader.src = './assets/' + this.certType + '@2x.png';
      setTimeout(() => this.drawCanvas(), 50);
    };
  }

  public drawCanvas(exportRender = false) {
    let c = this.c.nativeElement;
    c.width = c.height * 1.414516;

    this.certHeader.src =
      './assets/' + this.certType + (exportRender ? '@10x.png' : '@2x.png');
    this.ctx.drawImage(this.bg, 0, 0, c.width, c.height);

    this.ctx.drawImage(
      this.certHeader,
      c.width * 0.167,
      c.height * 0.243,
      c.width * 0.682828,
      c.height * 0.1395238
    );

    this.dept == 'CSE' &&
      this.ctx.drawImage(
        this.cseLogo,
        c.width * 0.8448,
        c.height * 0.1224,
        c.height * 1.06 * 0.16143,
        c.height * 1.06 * 0.16143
      );
    this.dept == 'CSE' &&
      this.ctx.drawImage(
        this.csiLogo,
        c.width * 0.041077,
        c.height * 0.38476,
        c.height * 1.02 * 0.1138,
        c.height * 1.02 * 0.1138
      );

    this.ctx.font = this.fontsizeBody + 'px GeorgiaBI';
    this.ctx.fillStyle = 'black';
    var yb = [0.6397, 0.6994];
    var yp = [0.868, 0.892];
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.bodyText1, c.width / 2, c.height * yb[0]);
    this.ctx.fillText(this.bodyText2, c.width / 2, c.height * yb[1]);

    this.ctx.font = this.fontsizeBody * 1.2 + 'px times italic';
    this.ctx.fillText(this.personName, c.width / 2, c.height * 0.55);

    this.ctx.font = this.fontsizePerson + 'px GeorgiaBI';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(
      this.dept == 'Custom' ? this.prefixString : this.deptTitles[this.dept],
      c.width / 2,
      c.height * 0.2
    );

    this.ctx.fillStyle = '#00194c';

    this.ctx.fillText(this.person1Name, c.width / 5, c.height * yp[0]);
    this.ctx.fillText(this.person1Desig, c.width / 5, c.height * yp[1]);

    this.ctx.fillText(this.person2Name, c.width / 2, c.height * yp[0]);
    this.ctx.fillText(this.person2Desig, c.width / 2, c.height * yp[1]);

    this.ctx.fillText(this.person3Name, c.width * (4 / 5), c.height * yp[0]);
    this.ctx.fillText(this.person3Desig, c.width * (4 / 5), c.height * yp[1]);
  }

  public render0() {
    this.bg.src = './assets/template@10x.jpg';
    return new Promise((resolve) => {
      this.bg.onload = () => {
        resolve(true);
      };
    });
  }

  public render1() {
    this.certHeader.src = './assets/' + this.certType + '@10x.png';
    return new Promise((resolve) => {
      this.certHeader.onload = () => {
        resolve(true);
      };
    });
  }

  public download() {
    let c = this.c.nativeElement;

    let origHeight = c.height,
      newHeight = 2500;

    c.height = newHeight;
    this.fontsizeBody = this.fontsizeBody * (newHeight / origHeight);
    this.fontsizePerson = this.fontsizePerson * (newHeight / origHeight);

    this.certHeader.src = './assets/' + this.certType + '@2x.png';
    this.drawCanvas(true);
    var image2 = c.toDataURL('image/png');
    c.height = origHeight;
    this.fontsizeBody = this.fontsizeBody / (newHeight / origHeight);
    this.fontsizePerson = this.fontsizePerson / (newHeight / origHeight);
    this.drawCanvas();
    return image2;
  }
}
