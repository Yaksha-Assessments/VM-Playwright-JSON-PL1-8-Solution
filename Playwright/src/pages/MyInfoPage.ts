import { Page, expect, Locator } from "@playwright/test";


export class MyInfoPage {
  readonly page: Page;
  private spanMsg:Locator;
  private myInfoTab: Locator;
  private nameField: Locator;
  private saveButton: Locator;
  private memberships: Locator;
  private table: Locator;
  private inputTable : Locator;
  private saveBtn : Locator;
  private editBtn: Locator

  constructor(page: Page) {
    this.editBtn = page.locator("i.bi-pencil-fill")
    this.page = page;
    this.spanMsg=  page.locator("//span[text()='Required']");

    this.myInfoTab = page.locator('//span[text()="My Info"]');
    this.nameField = page.locator('input[name="firstName"]');
    this.saveButton = page.locator("form:has-text('Employee') button").first();
    this.memberships = page.locator("//a[text()='Memberships']");
    this.table = page.locator("//div[@class='orangehrm-container']");
    this.inputTable = page.locator("//textarea[@placeholder ='Type comment here']");
    this.saveBtn = page.locator("//button[text()=' Save ']");
  }

  
/**
 * Edits a personal info attachment comment.
 *
 * @param editcomnt - New comment text.
 */

  async editattachmentPersonaldetail(editcomnt:string) {
    await this.myInfoTab.click();
        await this.page.waitForTimeout(5000);

    await this.editBtn.first().click();
    await this.page.waitForTimeout(2000);
     await this.inputTable.fill(editcomnt)
    await this.saveBtn.nth(2).click();
    await this.page.waitForTimeout(6000);

  }

/**
 * Edits the comment for a membership attachment.
 *
 * @param editcomnt - New comment text to enter.
 */

  async editMmbrAtchmntCmnt(editcomnt:string){
     await this.myInfoTab.click();
    await this.memberships.click();
 await this.table.nth(1).locator("i.oxd-icon.bi-pencil-fill").nth(1).click();
 await this.page.waitForTimeout(2000);
    await this.inputTable.fill(editcomnt)
    await this.page.waitForTimeout(2000);
    await this.saveBtn.click();
    await this.page.waitForTimeout(6000);
  }

  /**
 * Updates the user's name in the "My Info" tab.
 */

  async updateUniqueNAmeAndVerifyName(newName: string){
     await this.myInfoTab.click();
    await this.nameField.click();
    await this.nameField.clear();    
    await this.nameField.fill(newName);
    await this.saveButton.click();
    await this.page.reload();
    await this.page.waitForTimeout(7000);
   
    
  }
}
