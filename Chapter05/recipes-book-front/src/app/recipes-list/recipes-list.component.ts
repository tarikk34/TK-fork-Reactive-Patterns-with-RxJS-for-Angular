import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';
import { Observable, catchError, from, map, of, retry, retryWhen, tap, throwError } from 'rxjs';
import { Recipe } from '../core/model/recipe.model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent implements OnInit {

  constructor(private service: RecipesService) { }
  public recipes$!: Observable<Recipe[]>;
  
  ngOnInit(): void {
    // this.replaceStrategy()
    // this.rethrowStrategy()
    // this.retryStrategy()
    // this.retryWhenStrategy();
    this.recipes$ = this.service.recipes$;
  }

  replaceStrategy(){
    const stream$ = from(['5', '10', '6', 'Hello', '2']);
    stream$.pipe(map((value) => {
      if (isNaN(value as any)) {
        throw new Error('This is not a number')
      }
      return parseInt(value)
    }),
      catchError((error) => {
        console.log('Caught Error', error);
        return of();
      })
    ).subscribe({
      next: (res) => console.log('Value Emitted', res),
      error: (err) => console.log('Error Occurred', err),
      complete: () => console.log('Stream Completed'),
    })
  }

  rethrowStrategy(){
    const stream$ = from(['5', '10', '6', 'Hello', '2']);
    stream$.pipe(map((value) => {
      if(isNaN(value as any)) {
        throw new Error('This is not a number!');
      }
      return parseInt(value);
    }),
      catchError((error) => {
        console.log('Caught Error', error);
        return throwError(() => error)
      })
    ).subscribe({
      next: (res) => console.log('Value emitted', res),
      error: (err) => console.log('Error Occurred', err),
      complete: () => console.log('Stream Completed')
    })
  }

  retryStrategy(){
    const stream$ = from(['5', '10', '6', 'Hello', '2']);
    stream$.pipe(map((value) => {
      if(isNaN(value as any)) {
        throw new Error('This is not a number!');
      }
      return parseInt(value);
    }),
      retry(2),
      catchError((error) => {
        console.log('Caught Error', error);
        return throwError(() => error)
      })
    ).subscribe({
      next: (res) => console.log('Value Emitted', res),
      error: (err) => console.log('Error Occurred', err),
      complete: () => console.log('Stream Completed')
    })
  }

  retryWhenStrategy(){
    const stream$ = from(['5', '10', '6', 'Hello', '2']);
    stream$.pipe(map((value) => {
      if(isNaN(value as any)) {
        throw new Error('This is not a number!');
      }
      return parseInt(value);
    }),
      retryWhen((errors) => {
        return errors.pipe(
          tap(() => console.log('Retrying the source Observable...'))
        )
      })
    ).subscribe({
      next: (res) => console.log('Value Emitted', res),
      error: (err) => console.log('Error Occurred', err),
      complete: () => console.log('Stream Completed')
    })
  }

  delayWhenStrategy(){
  }
}
