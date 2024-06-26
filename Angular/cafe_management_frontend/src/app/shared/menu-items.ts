import { state } from "@angular/animations";
import { Injectable } from "@angular/core";

export interface Menu {
    state: String;
    name: String;
    type: String;
    icon: String;
    role: String;

}
const MENUITEMS = [
    { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'dashboard', role: ''},
    { state: 'category', name: 'Manage Category', type: 'link', icon: 'category', role: 'admin'},
    { state: 'product', name: 'Manage Product', type: 'link', icon: 'inventory_2', role: 'admin'},
    { state: 'order', name: 'Manage Order', type: 'link', icon: 'shopping_cart', role: ''},
    { state: 'bill', name: 'View Bill', type: 'link', icon: 'backup_table', role: ''},
    { state: 'user', name: 'Manager User', type: 'link', icon: 'people', role: 'admin'},
]

@Injectable()
export class MenuItems {
    getMenuItems(): Menu[] {
        return MENUITEMS;
    }
}
