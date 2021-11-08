import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { hideRecords } from '../shared/animations';
import { GameTypeService } from '../shared/game-type.service';
import { User } from '../shared/interfaces';
import { RecordsService } from '../shared/records.service';

@Component({
  selector: 'app-win',
  templateUrl: './win.component.html',
  styleUrls: ['./win.component.scss'],
  animations: [hideRecords],
})
export class WinComponent implements OnInit {
  currentResults: Array<User> = [];
  resultsFor10Cards: Array<User> = [];
  resultsFor20Cards: Array<User> = [];
  buttonsActive = true;
  winUser!: User;
  recordsState = 'hide';

  constructor(
    private gameType: GameTypeService,
    private router: Router,
    private recordsService: RecordsService
  ) { }

  ngOnInit(): void {
    this.winUser = this.gameType.getUser();
    if (!this.winUser) {
      this.router.navigate(['/']);
      return;
    }

    this.recordsService.getRecord().subscribe((allResults: Array<User>) => {
      this.resultsFor10Cards = this.sortData(allResults, 10);
      this.resultsFor20Cards = this.sortData(allResults, 20);
      this.changeRecordsData(+this.winUser.numberOfCard);
    });

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

    while (!target.classList.contains('win-content')) {
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

}
