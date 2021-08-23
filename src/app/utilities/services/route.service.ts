import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private currentPath: string;

  constructor(private router: Router) {}

  public getCurrentUrl() {
    this.formatUrl(this.router.url);
  }

  public subscribeToRoute(): Observable<string> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: any) => {
        return event.url;
      })
    );
  }

  public formatUrl(url: string) {
    const path = url.split('/');
    return path[path.length - 1];
  }

  public getCurrentPath(url: string): string {
    return this.formatUrl(url);
  }
}
