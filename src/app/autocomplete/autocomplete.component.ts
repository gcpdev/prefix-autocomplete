import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';


export interface Prefix {
  name: string;
  url: String;
}

@Component({
  selector: 'app-autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: ['autocomplete.component.css'],
})
export class AutocompleteComponent implements OnInit {

  readonly PREFIX_URL = 'http://prefix.cc/context';

  prefixesJson = [];

  selectedPrefix;

  toHighlight: string = '';

  myControl = new FormControl();
  options: Prefix[];
  filteredOptions: Observable<Prefix[]>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getPrefixes().subscribe(data => {

      const context = data['@context'];
      const prefixes = Object.keys(context);

      prefixes.forEach(prefix => {
        const item = {};
        item['name'] = prefix;
        item['url'] = context[prefix];
        this.prefixesJson.push(item);
      });

      // this.options = this.sortByKey(this.prefixesJson, 'name'); // use this if you want sorted suggestions

      this.options = this.prefixesJson;

      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => value.length >= 2 ? this._filter(value) : [])
      );

    });
  }

  displayFn(prefix: Prefix): string {
    return prefix && prefix.name ? prefix.name : '';
  }

  selected(option) {
    this.selectedPrefix = option.value;
  }

  private getPrefixes(): Observable<Object> {
    return this.http.get<Object>(this.PREFIX_URL);
  }

  private sortByKey(array, key) {
    return array.sort(function(a, b) {
        const x = a[key]; const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

  private _filter(value: string): Prefix[] {
    if (typeof value !== 'string') {
      return null;
    }
    this.toHighlight = value;
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
