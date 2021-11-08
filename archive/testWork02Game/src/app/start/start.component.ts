import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { hideRecords, rotateBtn } from '../shared/animations';
import { GameTypeService } from '../shared/game-type.service';
import { User } from '../shared/interfaces';
import { RecordsService } from '../shared/records.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  animations: [hideRecords, rotateBtn],
})
export class StartComponent {
  checklist: Array<any>;
  form: FormGroup;
  currentResults: Array<User> = [];
  resultsFor10Cards: Array<User> = [];
  resultsFor20Cards: Array<User> = [];
  buttonsActive = true;
  recordsState = 'hide';
  rotateBtnState = 'start';

  constructor(
    private gameType: GameTypeService,
    private router: Router,
    private recordsService: RecordsService,
  ) {
    this.checklist = [
      { id: 1, value: 'Fruits', isSelected: true },
      { id: 2, value: 'Animals', isSelected: false },
      { id: 3, value: 'Cars', isSelected: false },
    ];
    this.form = new FormGroup({
      nickname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      numberOfCard: new FormControl(20)
    });
    this.recordsService.getRecord().subscribe((allResults: Array<User>) => {
      this.resultsFor10Cards = this.sortData(allResults, 10);
      this.resultsFor20Cards = this.sortData(allResults, 20);
      this.currentResults = this.resultsFor10Cards;
    });
  }

  refreshNickname(): void {
    this.rotateBtnState = this.rotateBtnState === 'end' ? 'start' : 'end';
    this.form.get('nickname')?.reset();
  }

  isAllSelected(event: Event | any, item: any): void {
    this.checklist.forEach(val => {
      if (val.id === item.id) {
        val.isSelected = !val.isSelected;
      } else {
        val.isSelected = false;
      }
    });
    event.target.style.pointerEvents = 'none';
  }

  startGame(): void {
    if (this.form.invalid) {
      return;
    }

    const user: User = {
      nickname: this.form.get('nickname')?.value,
      numberOfCard: this.form.get('numberOfCard')?.value,
      cardType: this.checklist.filter((el) => el.isSelected === true).shift().value,
    };
    this.gameType.setUserData(user);
    this.router.navigate(['/game']);
  }

  changeRecordsData(numberOfCard: number): void {
    this.buttonsActive = numberOfCard === 10 ? true : false;
    numberOfCard === 10 ? this.currentResults = this.resultsFor10Cards : this.currentResults = this.resultsFor20Cards;
  }

  sortData(results: Array<User>, numberOfCard: number): Array<User> {
    return results.filter((result) => +result.numberOfCard === numberOfCard)
      .sort((a: User, b: User) => {
        if (a.time && b.time) {
          return a.time - b.time;
        }
        return 0;
      })
      .slice(0, 10);
  }

  outsideClick(event: Event | any): void {
    let target = event.target;

    while (!target.classList.contains('start-content')) {
      if (target.classList.contains('all-results') || target.classList.contains('cup-btn')) {
        return;
      }
      target = target.offsetParent;
      if (!target) {
        break;
      }
    }
    this.recordsState = this.recordsState === 'show' ? 'hide' : 'hide';
  }
  nicknameInputFilter(): void {
    let inputValue: string = this.form.get('nickname')?.value;
    inputValue = inputValue.replace(/[^A-Za-z0-9А-Яа-я]/gi, '');
    this.form.get('nickname')?.setValue(inputValue);
  }
}
