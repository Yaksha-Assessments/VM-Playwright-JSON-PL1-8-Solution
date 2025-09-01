import { Page, expect, Locator } from "@playwright/test";


export class MyInfoPage {
  readonly page: Page;
  private spanMsg:Locator;
  readonly myInfoTab: Locator;
  readonly nameField: Locator;
  readonly saveButton: Locator;
  readonly profileDropdown: Locator;
  readonly subTabLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.spanMsg=  page.locator("//span[text()='Required']");

    this.myInfoTab = page.locator('a:has-text("My Info")');
    this.nameField = page.locator('input[name="firstName"]');
    this.saveButton = page.locator("form:has-text('Employee') button").first();
    this.profileDropdown = page.locator(".oxd-userdropdown-name");
    this.subTabLinks = page.locator(".orangehrm-tabs > div > a");
  }

  /**
 * Navigates to the "My Info" tab .
 */

  async clickMyInfoTab() {
    await this.myInfoTab.click();
  }

/**
 * Clears the name field .
 */

  async clearAndEnterName(){
    await this.clickMyInfoTab();
    await this.nameField.click();
    await this.nameField.clear();
    
   
  }

  /**
 * Updates the user's name in the "My Info" tab.
 */

  async updateUniqueNAmeAndVerifyName(newName: string){
    await this.clickMyInfoTab();
    await this.nameField.click();
    await this.nameField.clear();    
    await this.nameField.fill(newName);
    await this.saveButton.click();
    await this.page.reload();
    await this.page.waitForTimeout(6000);
   
    
  }
}
