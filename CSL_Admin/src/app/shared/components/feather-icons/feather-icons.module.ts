import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatherIconsComponent } from "./feather-icons.component";

import { FeatherModule } from "angular-feather";
import {
  Airplay,
  Briefcase,
  Edit3,
  FileText,
  Folder,
  Home,
  LogOut,
  Menu,
  Monitor,
  Settings,
  Smile,
  User,
} from "angular-feather/icons";

// Only the icons the admin shows (sidebar and header). Importing every Feather icon added ~290 icons to the bundle.
// To use a new icon, import it here and add it to this list.
const icons = {
  Airplay,
  Briefcase,
  Edit3,
  FileText,
  Folder,
  Home,
  LogOut,
  Menu,
  Monitor,
  Settings,
  Smile,
  User,
};

@NgModule({
  imports: [CommonModule, FeatherModule.pick(icons)],
  exports: [FeatherIconsComponent, FeatherModule],
  declarations: [FeatherIconsComponent],
})
export class FeatherIconsModule {}
