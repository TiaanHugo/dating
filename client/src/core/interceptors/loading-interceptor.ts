import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { BusyService } from '../services/busy-service';
import { delay } from 'rxjs/internal/operators/delay';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  busyService.busy();
  return next(req).pipe(
    delay(500), // Simulate a delay for demonstration purposes
    finalize(() => busyService.idle()) 
  );
};
