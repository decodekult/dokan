import { test, Page } from '@playwright/test';
import { MenuManagerPage } from '@pages/menuManagerPage';
import { dbUtils } from '@utils/dbUtils';
import { data } from '@utils/testData';
import { dbData } from '@utils/dbData';

test.describe('Menu Manager test', () => {
    test.skip(true, 'feature not merged yet');
    let admin: MenuManagerPage;
    let aPage: Page;

    test.beforeAll(async ({ browser }) => {
        const adminContext = await browser.newContext(data.auth.adminAuth);
        aPage = await adminContext.newPage();
        admin = new MenuManagerPage(aPage);
    });

    test.afterAll(async () => {
        await dbUtils.setDokanSettings(dbData.dokan.optionName.menuManager, dbData.dokan.menuManagerSettings);
        await aPage.close();
    });

    //admin

    test('admin can deactivate menu @pro @a', async () => {
        await admin.updateMenuStatus('Analytics', 'deactivate', 'analytics');
        //reset
        await dbUtils.setDokanSettings(dbData.dokan.optionName.menuManager, dbData.dokan.menuManagerSettings);
    });

    test('admin can activate menu@pro @a', async () => {
        await updateMenuStatusByDB('user-subscription', 'false');
        await admin.updateMenuStatus('User Subscriptions', 'activate', 'userSubscriptions');
    });

    test('admin can rename menu @pro @a', async () => {
        await admin.renameMenu('Request Quotes', 'Quotations');
        //reset
        await dbUtils.setDokanSettings(dbData.dokan.optionName.menuManager, dbData.dokan.menuManagerSettings);
    });

    test("admin can't rename disabled menu @pro @a", async () => {
        await updateMenuStatusByDB('auction', 'false');
        await admin.cantRenameMenu('Auction');
    });

    test('admin can redorder menu @pro @a', async () => {
        await admin.reorderMenu('Orders', 'Products');
    });

    test("admin can't redorder or toggle status of dashboard & store menu @pro @a", async () => {
        await admin.cantAlterMenu('Dashboard');
        await admin.cantAlterMenu('Store', true);
    });

    test('admin can reset menu manager settings @pro @a', async () => {
        await updateMenuStatusByDB('auction', 'false');
        await admin.resetMenuManagerSettings('Auction');
    });
});

// update menu switch status
async function updateMenuStatusByDB(key: string, value: string) {
    const menuManagerSettings = dbData.dokan.menuManagerSettings;
    menuManagerSettings.dashboard_menu_manager.left_menus[key as keyof typeof menuManagerSettings.dashboard_menu_manager.left_menus].is_switched_on = value;
    await dbUtils.setDokanSettings(dbData.dokan.optionName.menuManager, menuManagerSettings);
}
