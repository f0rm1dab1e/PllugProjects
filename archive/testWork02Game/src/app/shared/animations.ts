import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const rotateCard = [
  trigger('rotateCard', [
    state('start', style({
      transform: 'rotateY(0deg) scale(1)'
    })),
    state('rotate', style({
      transform: 'rotateY(180deg) scale(1)',
    })),
    state('invalid', style({
      boxShadow: 'none',
      transform: 'rotateY(0deg)',
      background: 'rgba(73, 73, 73, 0)'
    })),

    transition('start => rotate', [
      animate(600, keyframes([
        style({ transform: 'rotateY(0deg) scale(1)', offset: 0 }),
        style({ transform: 'rotateY(90deg) scale(1.15)', offset: 0.5 }),
        style({ transform: 'rotateY(180deg) scale(1)', offset: 1 }),
      ])),
    ]),
    transition('rotate => start', [
      animate(600, keyframes([
        style({ transform: 'rotateY(180deg) scale(1)', offset: 0 }),
        style({ transform: 'rotateY(90deg) scale(1.15)', offset: 0.5 }),
        style({ transform: 'rotateY(0deg) scale(1)', offset: 1 }),
      ])),
    ]),
    transition('* => invalid', animate(600, keyframes([
      style({ transition: ' rotateY(0deg)', offset: .2 }),
    ]))),
  ]),
];

export const hideRecords = [
  trigger('hideRecords', [
    state('hide', style({
      transform: 'translateY(-115%)'
    })),
    state('show', style({
      transform: 'translateY(0)'
    })),

    transition('*<=>*', [
      animate(600),
    ]),
  ]),
];

export const rotateBtn = [
  trigger('rotateBtn', [
    state('start', style({
      transform: 'rotate(0deg)'
    })),
    state('end', style({
      transform: 'rotate(0deg)'
    })),

    transition('start<=>end', [
      animate(1000, keyframes([
        style({ transform: 'rotate(-360deg)', pointerEvents: 'none', offset: 0 }),

        style({ transform: 'rotate(0deg)', pointerEvents: 'none', offset: 1 }),
      ])),
    ]),
  ]),
];
