import { state } from '@angular/animations';
import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    role: '',
  },
  {
    state: 'category',
    name: 'Manage Category',
    icon: 'inventory',
    role: 'admin', //hoda
  },
  {
    state: 'product',
    name: 'Manage Product',
    icon: 'shopping_cart',
    role: 'admin', //hoda
  },
  // { state: 'order', name: 'Manage Order', icon: 'list_alt', role: '' },
  {
    state: 'bill',
    name: 'View Bill',
    icon: 'attach_money',
    role: '',
  },
];
@Injectable()
export class MenuItems {
  gotMenuitem(): Menu[] {
    return MENUITEMS;
  }
}

// @Injectable()
// export class MenuItems {
//   // Get all menu items or filter by user role
//   getMenuItemsForRole(role?: string): Menu[] {
//     return MENUITEMS.filter(item => !item.role || item.role === role);
//   }
// }
