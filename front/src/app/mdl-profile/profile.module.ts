import { ProfileRoutingComponents, ProfileRoutingModule } from './profile-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AllDialogsComponents } from './main/dialogs/dialogs.components';
import { MatDialogModule } from '@angular/material/dialog';
import {SharedModule} from '../mdl-shared/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
    declarations: [AllDialogsComponents, ProfileRoutingComponents],
    imports: [
        CommonModule,
        SharedModule,
        ProfileRoutingModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatCheckboxModule,
    ]
})
export class ProfileModule { }
