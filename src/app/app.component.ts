import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Certificate } from './certificate.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('DownloadBTN') down_btn: ElementRef;
  @ViewChild('ExportBTN') exp_btn: ElementRef;
  @ViewChild('NameField') namefield: ElementRef;
  @ViewChild('Loader') loader: ElementRef;
  @ViewChild('certificateMain') child: Certificate;

  title = 'Certificate Generator';
  renderer: Renderer2;

  certTypeMain = 'participate';
  deptMain = 'CSE';

  nameList = [];

  personNameMain = '';
  bodyText1Main = 'has attended the two-day workshop on “Sample Event Name” ';
  bodyText2Main =
    'held on 1st & 2nd of January 2019 at AMC Engineering College, Bangalore.';
  person1NameMain = 'Prof. Menahi Shayan,';
  person1DesigMain = 'Event Coordinator';
  person2NameMain = 'HOD,';
  person2DesigMain = 'Dept. of XYZ';
  person3NameMain = 'Dr. Girisha C';
  person3DesigMain = 'Principal, AMCEC';
  prefixString = 'Dept. of XYZ';

  exportReady = false;

  ngAfterViewInit() {
    this.reDraw();
  }

  public typeChange(value) {
    this.certTypeMain = value;
    this.child.certHeader.src = './assets/' + value + '@2x.png';
    this.reDraw();
  }

  public deptChange(value) {
    this.deptMain = value;
    this.reDraw();
  }

  public reDraw() {
    this.exportReady = false;
    this.downloadButtonDaemon();
    // this.child.certHeader.src = './assets/' + this.child.certType + '@2x.png';
    setTimeout(() => this.child.drawCanvas(), 50);
  }

  public nameListHandler(f) {
    this.nameList = [];
    let data = this.CSVToArray(
      atob(f.content.split('data:text/csv;base64,')[1])
    );
    let row = 0,
      col = 0,
      found = false;
    if (data[0][0] == 'Timestamp')
      data[0].forEach((d, i) => {
        if (d.toLowerCase().includes('name') && !found) {
          row = 1;
          col = i;
          found = true;
        }
      });
    data.forEach((d, i) => {
      if (i >= row) this.nameList.push(d[col]);
    });

    this.namefield.nativeElement.value = '';
    this.namefield.nativeElement.setAttribute('disabled', true);
    this.namefield.nativeElement.setAttribute('placeholder', f.name);

    this.exp_btn.nativeElement.innerHTML = 'Export & Download All';
  }

  public downloadButtonDaemon() {
    this.exp_btn.nativeElement.setAttribute(
      'style',
      this.exportReady ? 'display:none;' : 'display:inline;'
    );
    this.down_btn.nativeElement.setAttribute(
      'style',
      this.exportReady ? 'display:inline;' : 'display:none;'
    );
  }

  public async exportHandler() {
    this.loader.nativeElement.setAttribute('style', 'display:inline;');
    let status =
      <boolean>await this.child.render0() &&
      <boolean>await this.child.render1();
    if (status == true) {
      this.reDraw();
      this.exportReady = true;
      this.loader.nativeElement.setAttribute('style', 'display:none;');
      this.downloadButtonDaemon();
    } else {
      this.exp_btn.nativeElement.innerHTML = 'Error';
      this.loader.nativeElement.setAttribute('style', 'display:none;');
    }
  }

  public async downloadHandler() {
    let img = await this.child.download();
    this.down_btn.nativeElement.setAttribute('href', img);
    this.exportReady = false;
    this.downloadButtonDaemon();
  }

  public async downloadAll() {
    this.loader.nativeElement.setAttribute('style', 'display:inline;');
    for (let n in this.nameList) {
      this.personNameMain = this.nameList[n];
      let status =
        <boolean>await this.child.render0() &&
        <boolean>await this.child.render1();
      if (status == true) {
        this.reDraw();
        this.exportReady = true;
        this.downloadButtonDaemon();
        this.loader.nativeElement.setAttribute('style', 'display:none;');
      } else {
        this.exp_btn.nativeElement.innerHTML = 'Error';
        this.loader.nativeElement.setAttribute('style', 'display:none;');
      }
      this.down_btn.nativeElement.setAttribute(
        'download',
        this.nameList[n] + '.png'
      );
      let img = await this.child.download();
      this.down_btn.nativeElement.setAttribute('href', img);
      this.exportReady = false;
      this.downloadButtonDaemon();
      this.down_btn.nativeElement.click();
    }
  }

  public CSVToArray(strData) {
    var strDelimiter = ',';
    var objPattern = new RegExp(
      '(\\' +
        strDelimiter +
        '|\\r?\\n|\\r|^)' +
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        '([^"\\' +
        strDelimiter +
        '\\r\\n]*))',
      'gi'
    );
    var arrData = [[]],
      arrMatches = null;
    while ((arrMatches = objPattern.exec(strData))) {
      var strMatchedDelimiter = arrMatches[1],
        strMatchedValue;
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter)
        arrData.push([]);
      strMatchedValue = arrMatches[2]
        ? arrMatches[2].replace(new RegExp('""', 'g'), '"')
        : arrMatches[3];
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
  }
}
