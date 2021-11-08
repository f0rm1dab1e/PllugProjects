import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { rotateCard } from '../shared/animations';
import { GameTypeService } from '../shared/game-type.service';
import { User } from '../shared/interfaces';
import { RecordsService } from '../shared/records.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: rotateCard,
})
export class GameComponent implements OnInit, OnDestroy {
  cardsState: Array<string> = [];
  elements: Array<string> = [];
  userData!: User;
  timer!: ReturnType<typeof setTimeout>;
  steps: number = 0;
  time: number = 0;

  constructor(
    private gameType: GameTypeService,
    private router: Router,
    private recordsService: RecordsService
  ) { }

  ngOnInit(): void {
    this.elements = this.gameType.getCards();
    this.userData = this.gameType.getUser();
    if (!this.userData) {
      this.router.navigate(['/']);
      return;
    }
    this.cardsState.length = this.elements.length;
    this.cardsState.fill('start', 0, this.elements.length);
    this.gameStart();

  }

  changeState(idx: number): void {
    let rotatedCards = this.cardsState.filter((card) => card === 'rotate').length;
    if (this.cardsState[idx] === 'rotate' || this.cardsState[idx] === 'invalid' || rotatedCards > 1) {
      return;
    }
    if (rotatedCards < 2) {
      this.cardsState[idx] = 'rotate';
      rotatedCards++;
    }

    if (rotatedCards > 1) {
      this.steps++;
      setTimeout(() => {
        this.guessedCards();
        this.cardsState = this.cardsState.map((card) => card === 'rotate' ? card = 'start' : card);
        if (this.winCheck()) {
          this.gameType.addDataToUser(this.steps, this.time, new Date);

          this.recordsService.setRecord(this.gameType.getUser()).subscribe(() => {
            this.router.navigate(['/win']);
          });
        }
      }, 1000);
    }
  }

  gameStart(): void {
    this.timer = setInterval(() => {
      this.time++;
    }, 1000);
  }

  winCheck(): boolean {
    const test = this.cardsState.map((card: any) => card === 'invalid');
    return test.every((val: boolean) => val === true);
  }

  guessedCards(): void {
    const firstIdx = this.cardsState.indexOf('rotate');
    const lastIdx = this.cardsState.lastIndexOf('rotate');

    if (this.elements[firstIdx] === this.elements[lastIdx]) {
      this.cardsState = this.cardsState.map((card) => card === 'rotate' ? card = 'invalid' : card);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}


