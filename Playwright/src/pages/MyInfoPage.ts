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
 * Navigates to the "My Info" tab and returns the current page URL.
 */

  async clickMyInfoTab() {
    await this.myInfoTab.click();
    return this.page.url();
  }

/**
 * Clears the name field and returns validation message, if any.
 */

  async clearAndEnterName(){
    await this.clickMyInfoTab();
    await this.nameField.click();
    await this.nameField.clear();
    return this.spanMsg.innerText();
  }

  /**
 * Updates the user's name in the "My Info" tab and returns the profile name after saving and reloading.
 */

  async updateUniqueNAmeAndVerifyName(newName: string){
    await this.clickMyInfoTab();
    await this.nameField.click();
    await this.nameField.clear();    
    await this.nameField.fill(newName);
    await this.saveButton.click();
    await this.page.reload();
    await this.page.waitForTimeout(2000);
    const displayedProfileName =await this.page.locator("//p[@class='oxd-userdropdown-name']").innerText();

    return displayedProfileName;
    
  }

  async getDisplayedProfileName(): Promise<string> {
    return await this.profileDropdown.innerText();
  }

  async getSubTabHrefs(): Promise<string[]> {
    const count = await this.subTabLinks.count();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await this.subTabLinks.nth(i).getAttribute("href");
      if (href) hrefs.push(href);
    }
    return hrefs;
  }
}
