import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent,
  {
    providers: [
      provideProtractorTestingSupport(),
      provideRouter(routes),
      provideHttpClient(withFetch()),
    ]
  }
).catch(err => console.error(err));