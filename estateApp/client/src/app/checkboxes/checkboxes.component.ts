import { Component } from '@angular/core';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkboxes',
  templateUrl: './checkboxes.component.html',
  styleUrls: ['./checkboxes.component.css']
})
export class CheckboxesComponent {
  places = [
    { name: 'Akweny wodne', checked: false },
    { name: 'Apteka', checked: false },
    { name: 'Centrum handlowe', checked: false },
    { name: 'Dentysta', checked: false },
    { name: 'Kawiarnia', checked: false },
    { name: 'Kościół', checked: false },
    { name: 'Las', checked: false },
    { name: 'Ośrodek sportowy', checked: false },
    { name: 'Park', checked: false },
    { name: 'Piekarnia', checked: false },
    { name: 'Plac zabaw', checked: false },
    { name: 'Plaża', checked: false },
    { name: 'Przedszkole', checked: false },
    { name: 'Przychodnia', checked: false },
    { name: 'Przystanek', checked: false },
    { name: 'Restauracje', checked: false },
    { name: 'Sklep spożywczy', checked: false },
    { name: 'Szkoła', checked: false },
    { name: 'Uczelnia', checked: false },
    { name: 'Żłobek', checked: false }
  ];

  constructor(
    private storageService: StorageService,
    private router: Router
  ){}

  onSubmit() {
  this.storageService.set("places", this.places)
  this.router.navigate(['/ahp'])
  }
}
