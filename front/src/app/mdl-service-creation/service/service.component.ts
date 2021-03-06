import {takeUntil} from 'rxjs/operators';
import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../../mdl-shared/shared.service';
import {Observable, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthState} from '../../store/reducers/auth.reducers';
import {AppState} from '../../store/app.states';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-hotel-creation',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit, OnDestroy {
  nom: string;
  tarifmin: number;
  code: number;
  description: string;
  tag: string;
  photo: any[];
  headers = new HttpHeaders();
  IPback: string;

  /** Constructor ==================================================================================================> */
  constructor(
    private sharedS: SharedService,
    private ngZone: NgZone,
    private store: Store<AppState>,
    private toast: ToastrService,
    private http: HttpClient
  ) {
    this.authState$ = store.select(state => state.auth);
    this.loadOptions();
    this.headers = this.headers.append('content-type', 'application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
    this.IPback = this.sharedS.IPback;
  }

  /** Variables ====================================================================================================> */
  @ViewChild('adresse') public searchElement: ElementRef;
  private destroyed$ = new Subject<boolean>();
  private authState$: Observable<AuthState>;
  authState: AuthState;
  states = this.sharedS.states;
  tags = this.sharedS.tages;
  arrowDown: HTMLElement;
  inputWrapper: HTMLElement;
  tabProgress = 1;
  images = [];
  editedImages = [];




  /** On_init ======================================================================================================> */
  ngOnInit(): void {
    this.nom = '';
    this.tarifmin = null;
    this.description = '';
    this.tag = '';
    this.photo = null;
    this.code = null;
  }
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  loadOptions() {
    // User infos
    this.authState$.pipe(takeUntil(this.destroyed$)).subscribe(state => this.authState = state);
  }

  /** Elements management ==========================================================================================> */
  input_focused(inputElement) { // Hilighting focused input
    if (this.inputWrapper) {
      this.inputWrapper.classList.remove('input-focused');
    }
    for (let index = 0; index < 4; index++) {
      this.inputWrapper = inputElement.parentElement;
      if (this.inputWrapper.classList.contains('input-wrapper')) {
        this.inputWrapper.classList.add('input-focused');
        break;
      }
    }
  }
  mat_toggled(event) {
    for (let index = 0; index < 4; index++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.inputWrapper.children.length; j++) {
        if (this.inputWrapper.children[j].classList.contains('arrow-down')) {
          this.arrowDown = (this.inputWrapper.children[j] as HTMLElement);
          break;
        }
      }
      if (this.arrowDown) {
        event ? this.arrowDown.classList.add('arrow-rotated') : this.arrowDown.classList.remove('arrow-rotated');
      }
    }
  }
  arrow_down_clicked() {
    (document.getElementsByClassName('cdk-overlay-backdrop')[0] as HTMLElement).click();
  }



  /** photos management =======================================================================================> */
  onFileDropped($event) {
    /** on file drop handler */
    this.prepareFilesList($event);
  }
  fileBrowseHandler(files) {
    /** handle file from browsing */
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) { /** @param files (Files List) */
    for (const file of files) {
      const object = {
        imageSRC: undefined
      };
      const reader = new FileReader();
      reader.onload = () => {
        object.imageSRC = reader.result;
      };
      reader.readAsDataURL(file);
      this.images.push(file);
      this.editedImages.push(object);
    }
  }
  deleteFile(index: number) {
    this.editedImages.splice(index, 1);
    this.images.splice(index, 1);
  }

  resend() {
    const url = this.IPback + '/resend';
    this.http.post<any>(url, { auth: this.authState }, { headers: this.headers }).subscribe(
        (res) => {
        },
        (err) => {
          console.error(err);
        }
    );
    this.toast.info('Email envoy??, Verifiez votre boite de r??ception ! ', '', {positionClass: 'toast-top-center', timeOut: 4000});
  }

  /** POST form ===============================================================> */
  SubmitService(){
    console.log('clicked');
    console.log(this.authState.user);
    console.log(this.tag, this.description, this.nom, this.tarifmin);

    const fd = new FormData();
    fd.append('nom', this.nom);
    fd.append('tag', this.tag);
    // @ts-ignore
    fd.append('tarifmin', this.tarifmin);
    fd.append('description', this.description);
    fd.append('user', this.authState.user.nom);
    fd.append('photo', this.images[0]);
    // @ts-ignore
    fd.append('code', this.code);

    const url = this.IPback + '/submit';
    let head = new HttpHeaders();
    head = head.append('Access-Control-Allow-Origin', '*');
    this.http.post(url, fd, {headers: head}).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
    );
  }





}

