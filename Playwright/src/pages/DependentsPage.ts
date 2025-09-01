import { Page, Locator } from "@playwright/test";
import { test, expect } from "@playwright/test";
import { TestData } from "../Data/TestData";
import path from "path";
const filePath = path.resolve(__dirname, "../../sample_upload.pdf");

export class DependentsPage {
  
  readonly page: Page;
  private confirmDel: Locator;
  private editname :Locator;
  private limitmsg : Locator;
  private textinput: Locator;
  readonly infoPage: Locator;
  readonly dependentsTab: Locator;
  readonly addBtn: Locator;
  readonly nameInput: Locator;
  readonly relationshipDropdown: Locator;
  readonly specifyInput: Locator;
  readonly saveBtn: Locator;
  readonly rows: Locator;
  readonly AddFile: Locator;
  readonly Browse: Locator;
  readonly CommentBox: Locator;
  readonly myinfo: Locator;
  


  constructor(page: Page) {
    this.page = page;
    this.confirmDel = page.locator("//button[text()=' Yes, Delete ']");
    this.editname= page.locator("i.oxd-icon.bi-pencil-fill");
    this.limitmsg=page.locator("//span[text()='Should not exceed 200 characters']");
    this.textinput = page.locator("textarea.oxd-textarea");
    this.infoPage = page.locator('a:has-text("My Info")');
    this.dependentsTab = page.locator('a[href*="viewDependents"]');
    this.addBtn = page.getByRole("button", { name: /add/i }).first();
    this.nameInput = page.getByRole("textbox").nth(1);
    this.relationshipDropdown = page.locator(".oxd-select-text");
    this.saveBtn = page.getByRole("button", { name: /save/i });
    this.rows = page.locator(".orangehrm-horizontal-padding .oxd-table-row");
    this.specifyInput = page.getByRole("textbox").nth(2);
    this.AddFile = page.getByRole("button", { name: /add/i }).nth(1);
    this.Browse = page.getByText("Browse");
    this.CommentBox = page.getByRole("textbox", { name: "Type comment here" });
    this.myinfo = page.locator('a:has-text("My Info")');
  }

  async openTab() {
     await this.dependentsTab.click();
     await this.page.waitForTimeout(500);
  }


  /**
 * Collects  the href attributes from the sub-tabs
 * under the "My Info" section to verify uniqueness.
 */


  async areMyInfoSubTabHrefsUnique(){
    await this.page.waitForLoadState();
    await this.myinfo.click();
    await this.page.waitForTimeout(3000);

  }

  /**
 * Adds a dependent to the user's profile with the specified name and relationship.
 * If "Other" is selected as a relationship, an additional specify field is filled.
 */


  async addDependent(name: string, relation: string, otherSpecify?: string) {
    await this.myinfo.click();
    await this.dependentsTab.click();
    await this.addBtn.click();
    await this.nameInput.first().fill(name);
    await this.relationshipDropdown.click();
    await this.page.locator(`.oxd-select-dropdown div:has-text("${relation}")`).click();
    if (relation === "Other" && otherSpecify) {
      await this.specifyInput.fill(otherSpecify);
    }
    await this.saveBtn.click();
  }

  /**
 * Selects "Other" from the relationship dropdown and checks if the "Specify" input becomes visible.
 */


  async selectOtherAndCheckSpecifyField() {
    await this.infoPage.click();
    await this.dependentsTab.click();
    await this.addBtn.click();
    await this.relationshipDropdown.click();
    await this.page.locator(`.oxd-select-dropdown div:has-text("${TestData.specifyRelation}")`).click();
  
  }

  /**
 * Adds a dependent, edits its name.
 */


  async editDependentNameFlow(name: string, relation: string, editName: string, otherSpecify?: string) {
    await this.myinfo.click();
    await this.dependentsTab.click();
    await this.addBtn.click();
    await this.nameInput.first().fill(name);
    await this.relationshipDropdown.click();
    await this.page.locator(`.oxd-select-dropdown div:has-text("${relation}")`).click();
    if (relation === "Other" && otherSpecify) {
      await this.specifyInput.fill(otherSpecify);
    }
    await this.saveBtn.click();
    await this.page.waitForTimeout(6000);
    await this.editname.nth(1).click();
    await this.page.waitForTimeout(5000)
    await this.nameInput.first().fill(editName);
    await this.saveBtn.click();
    await this.page.waitForTimeout(6000)
  }

  /**
 * Adds a dependent, deletes it.
 */


  async deleteDependentFlow(deleteName: string) {
    await this.myinfo.click();
    await this.dependentsTab.click();
    await this.addBtn.click();
    await this.nameInput.first().fill(deleteName);
    await this.relationshipDropdown.click();
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
    await this.saveBtn.click();
    await this.page.waitForTimeout((6000));
    await this.page.locator(`//div[@class='oxd-table-card'][.//div[text()='${deleteName}']]//i[@class='oxd-icon bi-trash']`).click();
    await this.page.waitForTimeout(1000);
    await this.confirmDel.click();
    await this.page.waitForTimeout((6000));
 
    
  }

  /**
 * Uploads an attachment with a comment.
 */


  async UploadAttachmentInDependent(comnt: string) {
    await this.infoPage.click();
    await this.dependentsTab.click();
    await this.AddFile.click();
    await this.textinput.scrollIntoViewIfNeeded();
    await this.textinput.fill(comnt);
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await this.saveBtn.click();
    await  this.page.locator(`//div[text()='${comnt}']`).waitFor({state:'visible'})
    await this.page.waitForTimeout(1000);
  }
  /**
 * Enters over-limit characters in the comment input..
 */


  async CommentBarInputLimit() {
    await this.infoPage.click();
    await this.openTab();
    await this.page.waitForTimeout(2000);
    await this.AddFile.click();
    
    const longText = "A".repeat(250);
    await this.textinput.fill(longText);
    await this.page.waitForTimeout(1000);
   
   
  }
}





