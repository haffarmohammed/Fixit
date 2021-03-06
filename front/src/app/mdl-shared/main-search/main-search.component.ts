import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearchComponent implements OnInit {

  constructor(private sharedS: SharedService, private http: HttpClient) {
    this.IPback = this.sharedS.IPback;
  }
  states = this.sharedS.states;
  tages = this.sharedS.tages;
  annonces = [];
  mission: string;
  prix: number;
  code: string;
  IPback: string;


  ngOnInit(): void {
    this.mission = '';
    this.prix = null;
    this.code = '';
  }



  doSearch(){
    console.log(this.mission, this.prix, this.code);
    const url = this.IPback + '/search?';
    const body = {
      metier: this.mission,
      prix: this.prix,
      code: this.code.slice(0, 2) + '000'
    };
    let headers = new HttpHeaders();
    headers = headers.append('content-type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    // headers=headers.append('content-type','application/x-www-form-urlencoded');
    // @ts-ignore
    this.http.post<any>(url, body, {headers}).subscribe(
        (res) => {
          console.log(res);
          this.sharedS.storeData(res);
        },
        (err) => {
          console.error(err);
        }
    );
  }

}
