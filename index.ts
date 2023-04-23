// Note: So, the previous approach indeed hid the error from the output, however, it also emitted a complete notification instead, which still ended the main Subscription and everything stopped working.
// Let's now have a look at how could we change things to hide the error and keep the main, the outer Subscription working further.
// So, even after an error gets emitted by the inner Observable, the main/outer Subscription wouldn't stop and would be able to handle further notifications emitted by the source Observable.
// As we know, 'concatMap' doesn't pass the complete notifications coming from the inner Observables to the output. So, if we convert the error into a complete notification at the level of the inner Observable, our app will keep on working properly. So to achieve this, we simply need to apply this 'catchError' operator directly to this Ajax Observable
// So let's save now to run the code and type in 'food' and click 'Fetch'. OK, it works.No surprises here. And let's now type in 'incorrect-endpoint' and click 'Fetch' once more.OK, we don't see any error or complete notification, so it looks promising. Let's now bring back the value to 'food' and click 'Fetch' once again. OK, it works! So we have successfully handled the error, so it's not ending the main/outer Subscription and our app keeps on working even after the Ajax call failed.
// Note: As a side note, right now, when we provide an incorrect endpoint, we have no feedback that it was incorrect. If we want to provide some default value in case of an error, instead of using the EMPTY observable, we can use, for example, the 'of' function to which we can pass 'Could not fetch data', for example, or even use the error's payload as in below example.
import { fromEvent, EMPTY, of } from 'rxjs';
import { tap, map, concatMap, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const endpointInput: HTMLInputElement =
  document.querySelector('input#endpoint');
const fetchButton: HTMLButtonElement = document.querySelector('button#fetch');

fromEvent(fetchButton, 'click')
  .pipe(
    tap((value) => console.log(value)),
    map((value) => endpointInput.value),
    concatMap((value) =>
      ajax(`https://random-data-api.com/api/${value}/random_${value}`).pipe(
        // catchError((err) => EMPTY)
        catchError((err) => of(`Could not fetch data: ${err}`))
      )
    )
  )
  .subscribe({
    next: (value) => console.log(value),
    error: (err) => console.log('Error:', err),
    complete: () => console.log('Completed'),
  });
