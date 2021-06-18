import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ECommerceComponent } from './e-commerce.component';
import { ProductsComponent } from './products/products.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';

const routes: Routes = [
	{
		path: '',
		component: ECommerceComponent,
		children: [
			{
				path: 'products',
				component: ProductsComponent,
			},
			{
				path: 'product/add',
				component: ProductEditComponent
			},
			{
				path: 'product/edit',
				component: ProductEditComponent
			},
			{
				path: 'product/edit/:id',
				component: ProductEditComponent
			},
			{ path: '', redirectTo: 'analysis', pathMatch: 'full' },
			{ path: '**', redirectTo: 'analysis', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ECommerceRoutingModule { }
