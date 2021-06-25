import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItemModel } from '../_models/breadcrumb-item.model';
import { LayoutService } from '../../../../core';
import { SubheaderService } from '../_services/subheader.service';
import { KTUtil } from '../../../../../../assets/js/components/util';
import { Router } from '@angular/router';

@Component({
	selector: 'app-subheader6',
	templateUrl: './subheader6.component.html',
})
export class Subheader6Component implements OnInit {
	TABS: string[] = [
		'kt_aside_tab_0',
		'kt_aside_tab_1',
		'kt_aside_tab_2',
		'kt_aside_tab_3',
		'kt_aside_tab_4',
		'kt_aside_tab_5',
		'kt_aside_tab_6'];
	activeTabId;
	disableAsideSelfDisplay: boolean;
	asideMenuStatic: true;
	disableAsideSecondaryDisplay: boolean;
	ulCSSClasses: string;
	asideMenuHTMLAttributes: any = {};
	asideMenuCSSClasses: string;
	asideMenuDropdown;
	brandClasses: string;
	asideMenuScroll = 1;
	asideSelfMinimizeToggle = false;
	subheaderCSSClasses = '';
	subheaderContainerCSSClasses = '';
	subheaderMobileToggle = false;
	subheaderDisplayDesc = false;
	subheaderDisplayDaterangepicker = false;
	title$: Observable<string>;
	breadcrumbs$: Observable<BreadcrumbItemModel[]>;
	description$: Observable<string>;

	constructor(
		private layout: LayoutService,
		private subheader: SubheaderService,
		private cdr: ChangeDetectorRef,
		private router: Router
	) {
		this.title$ = this.subheader.titleSubject.asObservable();
		this.breadcrumbs$ = this.subheader.breadCrumbsSubject.asObservable();
		this.description$ = this.subheader.descriptionSubject.asObservable();
	}

	ngOnInit() {
		this.subheaderCSSClasses = this.layout.getStringCSSClasses('subheader');
		this.subheaderContainerCSSClasses = this.layout.getStringCSSClasses(
			'subheader_container'
		);
		this.subheaderMobileToggle = this.layout.getProp('subheader.mobileToggle');
		this.subheaderDisplayDesc = this.layout.getProp('subheader.displayDesc');
		this.subheaderDisplayDaterangepicker = this.layout.getProp(
			'subheader.displayDaterangepicker'
		);
		this.activeTabId = this.TABS[1];
		// load view settings
		this.disableAsideSelfDisplay =
			this.layout.getProp('aside.self.display') === false;
		this.asideMenuStatic = this.layout.getProp('aside.menu.static');
		this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
		this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
		this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
		this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
		this.brandClasses = this.layout.getProp('brand');
		this.asideSelfMinimizeToggle = this.layout.getProp(
			'aside.self.minimize.toggle'
		);
		this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
		this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;
		this.disableAsideSecondaryDisplay = this.layout.getProp('aside.secondary.display');
	}

	setTab(id) {
		this.activeTabId = id;
		const asideWorkspace = KTUtil.find(
			document.getElementById('kt_aside'),
			'.aside-secondary .aside-workspace'
		);
		if (asideWorkspace) {
			KTUtil.scrollUpdate(asideWorkspace);
		}
		this.cdr.detectChanges();
	}

	getCurrentUrl(url) {
		if (this.router.url.includes(url)) {
			return 'active'
		}
	}
}
