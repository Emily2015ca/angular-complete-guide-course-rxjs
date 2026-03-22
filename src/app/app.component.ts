import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  intervalSingal = toSignal(this.interval$, {initialValue: 0});
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval()  * 2);
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interlId = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interlId);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value');
      subscriber.next({message: 'New value'});
      timesExecuted++
    }, 2000);
  });
  private destroyRef = inject(DestroyRef);
  constructor() {
    // effect(() => {
    //   console.log(`Clicked button ${this.clickCount()} times`);
    // })
  }
  ngOnInit(): void {
    // setInterval(() => {
    //   this.interval.update(prevIntervalNumber => prevIntervalNumber +1);
    // }, 1000);

    // const subscription =interval(1000).pipe(
    //   map((val) => val *2)
    // ).subscribe({
    //   next: (val) => console.log(val)
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // })
    this.customInterval$.subscribe({
      next: (val) => console.log('val:', val),
      complete: () => console.log('completed')
    })
    const subscription = this.clickCount$.subscribe({
      next: (val) => console.log(`Clicked button ${this.clickCount()} times`)
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  };

  onClick() {
    this.clickCount.update(prevCount => prevCount + 1);
  }
}
