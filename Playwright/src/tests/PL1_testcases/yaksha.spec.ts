import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { MyInfoPage } from "../../pages/MyInfoPage";
import { DependentsPage } from "../../pages/DependentsPage";
import { TestData } from "../../Data/Config";

test.describe("Yaksha", () => {
  let loginPage: LoginPage;
  let myinfoPage: MyInfoPage;
  let dependentsPage: DependentsPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(TestData.loginURL);
    loginPage = new LoginPage(page);
    myinfoPage = new MyInfoPage(page);
    dependentsPage = new DependentsPage(page);
    await loginPage.performLogin();
  });

  /**
   * Test Case 1: Verify My Info tab Loads
   *
   * Steps:
   * 1. Login with valid credentials
   * 2. Click on the "My Info" tab
   *
   * Expected:
   * The My Info tab should be visible and accessible
   */
  test("TC1 - Verify My Info tab Loads", async () => {
    const URL = await myinfoPage.clickMyInfoTab();
    expect(URL.length).toBeGreaterThan(0);
    expect(URL).toContain(myinfoUrl);
  });

  /**
   * Test Case 2: Verify required field error on blank name
   *
   * Steps:
   * 1. Navigate to "My Info"
   * 2. Clear the name input
   * 3. Check for validation
   *
   * Expected:
   * Required field error should be displayed for empty name
   */
  test("TC2 - Verify required field error on blank name", async () => {
    const nameValue = await myinfoPage.clearAndEnterName();
    expect(nameValue.length).toBeGreaterThan(0);
    expect(nameValue).toBe("Required");
  });

  /**
 * Test Case 3: Verify name gets edited
 *
 * Purpose:
 * Ensures that a user can successfully update their name in the personal details section.
 *
 * Steps:
 * 1. Generate a unique name dynamically.
 * 2. Navigate to the "My Info" tab.
 * 3. Clear the existing name field and enter the new name.
 * 4. Save the changes and reload the page.
 * 5. Retrieve the displayed profile name from the header.
 *
 * Expected:
 * The updated profile name should be visible in the top-right dropdown and match the new name.
 */
  test("TC3 - Verify name gets edited", async () => {
    const newName = `TestUser_${Math.floor(Math.random() * 10000)}`;
    const updatedName = await myinfoPage.updateUniqueNAmeAndVerifyName(newName);
    expect(updatedName.length).toBeGreaterThan(0);
    expect(updatedName).toContain(newName);
  });

 /**
 * Test Case 4: Verify all My Info sub-tabs have unique hrefs
 *
 * Purpose:
 * Ensure that each sub-tab under the "My Info" section has a unique navigation URL,
 * preventing routing conflicts and confirming correct tab linkage.
 *
 * Steps:
 * 1. Navigate to the "My Info" tab.
 * 2. Locate the sub-tabs (e.g., Personal Details, Contact Details, Emergency Contacts).
 * 3. Extract the `href` attributes from each sub-tab element.
 * 4. Assert that the extracted list is not empty.
 * 5. Check that each `href` is unique.
 *
 * Expected:
 * All extracted sub-tab `href`s must be unique and valid.
 */

  test("TC4 - Verify all My Info sub-tabs have unique hrefs", async () => {
    const Urls = await dependentsPage.areMyInfoSubTabHrefsUnique();
    console.log("-----------------------------------------")
   expect(Urls.length).toBeGreaterThan(0);
    const areUnique: boolean = new Set(Urls).size === Urls.length;
    expect(areUnique).toBeTruthy();
  });

  /**
 * Test Case 5: Add a new dependent
 *
 * Purpose:
 * Verify that a user can add a new dependent under the "Dependents" section of the My Info tab.
 *
 * Steps:
 * 1. Generate a unique dependent name using a timestamp.
 * 2. Navigate to the "My Info" > "Dependents" section.
 * 3. Click the "Add" button to initiate the add flow.
 * 4. Enter the dependent name and select the relationship from the dropdown.
 * 5. If "Other" is selected, specify the relationship manually.
 * 6. Click the "Save" button to submit.
 * 7. Assert that the newly added dependent appears in the list.
 *
 * Expected:
 * The newly added dependent name should be visible in the dependents table.
 */

  test("TC5 - Add a new dependent", async () => {
    const name = `Child_${Date.now()}`;
    await dependentsPage.addDependent(name, TestData.defaultDependentRelation);
    const dependentEntry = dependentsPage.page.locator(
      `.orangehrm-container:has-text("${name}")`
    );
    await expect(dependentEntry).toBeVisible();
  });

  /**
 * Test Case 6: Show 'Specify' field only when 'Other' is selected
 *
 * Purpose:
 * Ensure the "Specify" input field becomes visible only when the "Other" option is selected from the relationship dropdown.
 *
 * Steps:
 * 1. Navigate to the "My Info" > "Dependents" section.
 * 2. Click the "Add" button to add a new dependent.
 * 3. Open the relationship dropdown and select the "Other" option.
 * 4. Check whether the "Specify" input field is displayed.
 *
 * Expected:
 * The "Specify" field should be visible only after selecting the "Other" option.
 */

  test("TC6 - Show 'Specify' field only when 'Other' is selected", async () => {
    const isSpecifyVisible = await dependentsPage.selectOtherAndCheckSpecifyField();
    expect(isSpecifyVisible).toBeTruthy();
  });

  /**
 * Test Case 7: Edit existing dependent name
 *
 * Purpose:
 * Verify that a user can successfully edit the name of an existing dependent.
 *
 * Steps:
 * 1. Navigate to "My Info" > "Dependents" section.
 * 2. Add a new dependent using a unique name and default relation.
 * 3. Click on the edit icon next to the added dependent.
 * 4. Modify the name with a new unique value.
 * 5. Save the changes and retrieve the list of dependents.
 *
 * Expected:
 * The edited dependent name should appear in the updated list, confirming the change.
 */

  test("TC7 - Edit existing dependent name", async () => {
    const name = `Child_${Date.now()}`;
    const editName = generateEditName();
    const editlist = await dependentsPage.editDependentNameFlow(name, TestData.defaultDependentRelation, editName);
    expect(editlist.length).toBeGreaterThan(0);
    expect(editlist).toContain(editName);
  });

  /**
 * Test Case 8: Delete existing dependent
 *
 * Purpose:
 * Ensure that a dependent added to the user profile can be successfully deleted.
 *
 * Steps:
 * 1. Navigate to "My Info" > "Dependents" section.
 * 2. Add a new dependent using a unique name and relation.
 * 3. Locate and click the delete icon associated with the added dependent.
 * 4. Confirm the deletion in the confirmation dialog.
 * 5. Fetch the updated list of dependents.
 *
 * Expected:
 * The deleted dependent's name should no longer be present in the list.
 */

  test("TC8 - Delete existing dependent", async () => {
    const deleteName = generateDeleteName();
    const deleteNameList = await dependentsPage.deleteDependentFlow(deleteName);
    expect(deleteNameList.length).toBeGreaterThan(0);
    expect(deleteNameList).not.toContain(deleteName);
  });

  /**
 * Test Case 9: Upload dependent attachment
 *
 * Purpose:
 * To verify that a user can successfully upload an attachment with a comment under the Dependents section.
 *
 * Steps:
 * 1. Navigate to "My Info" > "Dependents" section.
 * 2. Click on the "Add Attachment" button.
 * 3. Enter a unique comment.
 * 4. Upload a file from the system.
 * 5. Save the attachment entry.
 * 6. Retrieve the list of comments shown for uploaded attachments.
 *
 * Expected:
 * The newly added comment should appear in the attachment list, confirming successful upload.
 */

  test("TC9 - Upload dependent attachment", async () => {
  const comnt = generateUniqueComment();
  const list = await dependentsPage.UploadAttachmentInDependent(comnt);
  expect(list.length).toBeGreaterThan(0);
  expect(list).toContain(comnt);
});

  /**
 * Test Case 10: Verify comment box shows 'Should not exceed 200 characters' when input is too long
 *
 * Purpose:
 * To ensure the application validates the comment field and displays a warning message if input exceeds character limits.
 *
 * Steps:
 * 1. Navigate to "My Info" > "Dependents" > "Add Attachment".
 * 2. Attempt to input a comment longer than 200 characters (e.g., 250 characters).
 * 3. Observe the validation or warning message.
 * 4. Retrieve and verify the displayed validation message(s).
 *
 * Expected:
 * A warning message such as "Should not exceed 200 characters" should be displayed when character limit is exceeded.
 */

  test("TC10 - Verify comment box shows 'Should not exceed 200 characters' when input is too long", async () => {
    const list = await dependentsPage.CommentBarInputLimit();
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain(limitmsg);
  });
});


//---------------------------------helper function-----------------------------------------------------------------------

function generateUniqueComment(prefix: string = "Comment"): string {
    const timestamp = Date.now(); // Use timestamp to ensure uniqueness
    return `${prefix}_${timestamp}`;
  }
  function generateEditName(prefix: string = "name"): string {
    const timestamp = Date.now(); // Use timestamp to ensure uniqueness
    return `${prefix}_${timestamp}`;
  }
   function generateDeleteName(prefix: string = "delete"): string {
    const timestamp = Date.now(); // Use timestamp to ensure uniqueness
    return `${prefix}_${timestamp}`;
  }

  const limitmsg = "Should not exceed 200 characters";
  const myinfoUrl= "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7"