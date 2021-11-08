import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './interfaces';


@Injectable({
  providedIn: 'root'
})
export class GameTypeService {
  userData!: User;
  cards: any = {
    Fruits: [
      '/assets/img/fruits/1.jpg',
      '/assets/img/fruits/2.jpg',
      '/assets/img/fruits/3.jpg',
      '/assets/img/fruits/4.jpg',
      '/assets/img/fruits/5.jpg',
      '/assets/img/fruits/6.jpg',
      '/assets/img/fruits/7.jpg',
      '/assets/img/fruits/8.jpg',
      '/assets/img/fruits/9.jpg',
      '/assets/img/fruits/10.jpg',
    ],
    Animals: [
      '/assets/img/animals/1.jpg',
      '/assets/img/animals/2.jpg',
      '/assets/img/animals/3.jpg',
      '/assets/img/animals/4.jpg',
      '/assets/img/animals/5.jpg',
      '/assets/img/animals/6.jpg',
      '/assets/img/animals/7.jpg',
      '/assets/img/animals/8.jpg',
      '/assets/img/animals/9.jpg',
      '/assets/img/animals/10.jpg',
    ],
    Cars: [
      '/assets/img/cars/1.jpg',
      '/assets/img/cars/2.jpg',
      '/assets/img/cars/3.jpg',
      '/assets/img/cars/4.jpg',
      '/assets/img/cars/5.jpg',
      '/assets/img/cars/6.jpg',
      '/assets/img/cars/7.jpg',
      '/assets/img/cars/8.jpg',
      '/assets/img/cars/9.jpg',
      '/assets/img/cars/10.jpg',
    ],
  };

  constructor(private router: Router) { }

  setUserData(user: User): void {
    this.userData = user;
  }

  getCards(): Array<string> {
    if (this.userData) {
      const cardType = this.cards[this.userData.cardType]
        .sort(() => Math.random() - 0.5)
        .slice(0, +this.userData.numberOfCard / 2);
      return [...cardType, ...cardType].sort(() => Math.random() - 0.5);
    }
    this.router.navigate(['/']);
    return [];
  }

  addDataToUser(steps: number, time: number, date: Date): void {
    this.userData.steps = steps;
    this.userData.time = time;
    this.userData.date = date;
  }

  getUser(): User {
    return this.userData;
  }
}
