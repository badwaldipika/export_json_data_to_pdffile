import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RestAPIService {

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    get<T>(url: any): Observable<T> {
        return this.http.get<T>(url).pipe(retry(1), catchError(this.handleError));
    }

    post<T>(url: any, body: any): Observable<T> {
        return this.http
            .post<T>(
                url,
                JSON.stringify(body),
                this.httpOptions
            ).pipe(retry(1), catchError(this.handleError));
    }

    put<T>(url: any, body: any): Observable<T> {
        return this.http
            .put<T>(
                url,
                JSON.stringify(body),
                this.httpOptions
            )
            .pipe(retry(1), catchError(this.handleError));
    }

    delete<T>(url: any, body: string): Observable<T> {
        return this.http
            .delete<T>(url, this.httpOptions)
            .pipe(retry(1), catchError(this.handleError));
    }

    // Error handling
    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(() => {
            return errorMessage;
        });
    }
}