import { Provider, Type } from '@angular/core';
import { FacadeService } from '../services/facade.service';
import { CoreService } from '../services/core.service';
import { ApiService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { PageComponent } from '../components/page/page.component';

export const DocumentImports: Type<unknown>[] = [PageComponent];

export const DocumentProviders: Provider[] = [FacadeService, CoreService, ApiService, StateService];
